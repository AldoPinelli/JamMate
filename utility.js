
export async function loadBuffer(file, audioContext) {      
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  //console.log(audioContext.sampleRate);
  return audioBuffer;
}

export async function changeSampleRate(audioBuffer, newSampleRate = 44100) {
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.duration * newSampleRate,
    newSampleRate
  );

  const bufferSource = offlineContext.createBufferSource();
  bufferSource.buffer = audioBuffer;
  bufferSource.connect(offlineContext.destination);
  bufferSource.start();

  const newAudioBuffer = await offlineContext.startRendering();
  return newAudioBuffer; //ritorna un nuovo audiobuffer con freq. di campionamento modificata
}


export function convertMonoToStereo(audioBuffer, audioContext) {
    if (audioBuffer.numberOfChannels !== 1) {
        throw new Error("Audio buffer is not mono");
    }

    const numberOfChannels = 2;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length;

    // Crea un nuovo AudioBuffer stereo
    const stereoBuffer = audioContext.createBuffer(
        numberOfChannels,
        length,
        sampleRate
    );

    const monoData = audioBuffer.getChannelData(0);

    // Crea nuovi array per i dati stereo
    const leftChannelData = new Float32Array(monoData);
    const rightChannelData = new Float32Array(monoData);
    
    // Copia i nuovi dati nei canali
    stereoBuffer.copyToChannel(leftChannelData, 0);
    stereoBuffer.copyToChannel(rightChannelData, 1);

    return stereoBuffer;
}


export function createJamLoop(melodyAudioBuffer, bpm, loopLengthInBars, audioContext, sampleRate = 44100) {
  const samplesPerBeat = (60 / bpm) * sampleRate;
  const loopLengthInSamples = samplesPerBeat * 4 * loopLengthInBars;

  // Verifica se la lunghezza richiesta supera la lunghezza del buffer
  const loopBuffer = audioContext.createBuffer(
    melodyAudioBuffer.numberOfChannels,
    loopLengthInSamples,
    melodyAudioBuffer.sampleRate
  );

  for (let channel = 0; channel < melodyAudioBuffer.numberOfChannels; channel++) {
    const channelData = melodyAudioBuffer.getChannelData(channel);
    const loopData = loopBuffer.getChannelData(channel);

    // Copia i dati originali nel buffer di loop, fino alla lunghezza dell'audio originale
    loopData.set(channelData.subarray(0, Math.min(loopLengthInSamples, channelData.length)));

    // Se loopLengthInSamples è maggiore della lunghezza originale, riempi con silenzio
    if (loopLengthInSamples > channelData.length) {
      const silenceLength = loopLengthInSamples - channelData.length;
      loopData.set(new Float32Array(silenceLength), channelData.length);
    }
  }

  return loopBuffer;
}


export async function createDrumLoop(url, originalBpm, newBpm, audioContext,loopLengthInBars, targetSampleRate = 44100) {
  try {
    // 1. Carica il file audio dal URL
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // 2. Calcola il fattore di stretching
    const originalBpmInSeconds = 60 / originalBpm;   // Durata di un battito originale in secondi
    const newBpmInSeconds = 60 / newBpm;             // Durata di un battito nuovo in secondi
    const stretchFactor = originalBpmInSeconds / newBpmInSeconds;

    // 3. Crea un OfflineAudioContext per cambiare il BPM
    const offlineContext = new OfflineAudioContext(audioBuffer.numberOfChannels, 
    audioBuffer.length * stretchFactor, audioContext.sampleRate);
    
    // 4. Crea il buffer per lo stretching
    const bufferSource = offlineContext.createBufferSource();
    bufferSource.buffer = audioBuffer;
    
    // 5. Imposta il playback rate per cambiare il BPM senza alterare il pitch
    bufferSource.playbackRate.setValueAtTime(stretchFactor, 0);
    bufferSource.connect(offlineContext.destination);
    
    // 6. Avvia la riproduzione del buffer in un OfflineAudioContext (non produce audio, ma modifica il buffer)
    bufferSource.start(0);
    
    // 7. Esegui il rendering offline del buffer (modificando la durata)
    let newAudioBuffer = await offlineContext.startRendering();

    // 8. Se necessario, cambia il sample rate (se richiesto)
    if (audioContext.sampleRate !== targetSampleRate) {
      let newSampleRateBuffer = await changeSampleRate(newAudioBuffer, targetSampleRate);
      newSampleRateBuffer = createJamLoop(newSampleRateBuffer, newBpm, loopLengthInBars, audioContext);
      return newSampleRateBuffer;
    }

    // 9. Ritorna l'AudioBuffer modificato
    newAudioBuffer = createJamLoop(newAudioBuffer, newBpm, loopLengthInBars, audioContext);
    return newAudioBuffer;
  } catch (error) {
    console.error("Error processing the audio file:", error);
    throw error;
  }
}

export function trimBuffer(audioBuffer, startSample, audioContext) {
  if (startSample >= audioBuffer.length) {
    throw new Error("Start sample is beyond the length of the audio buffer");
  }

  const trimmedLength = audioBuffer.length - startSample;
  const trimmedBuffer = audioContext.createBuffer(
    audioBuffer.numberOfChannels,
    trimmedLength,
    audioBuffer.sampleRate
  );

  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    const trimmedChannelData = trimmedBuffer.getChannelData(channel);
    trimmedChannelData.set(channelData.subarray(startSample));
  }

  return trimmedBuffer;
}



export function syncWaveformWithAudio(loopDuration, intervalObj, wavesurfers) {
  if (intervalObj.id) {
      clearInterval(intervalObj.id); // Ferma l'intervallo precedente se esiste
  }

  intervalObj.id = setInterval(() => {
      wavesurfers.forEach(wavesurfer => {
          wavesurfer.seekTo(0); // Porta il cursore all'inizio della forma d'onda
          wavesurfer.play(); 
      });
  }, loopDuration * 1000); // Intervallo uguale alla durata del loop in millisecondi
}
