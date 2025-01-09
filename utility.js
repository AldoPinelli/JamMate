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

  // creaBuffer per il loop
  const loopBuffer = audioContext.createBuffer(
    melodyAudioBuffer.numberOfChannels,
    loopLengthInSamples,
    melodyAudioBuffer.sampleRate
  );
  
  //copia i dati nel nuovo audioBuffer, se la lunghezza del loop è maggiore di quella dell'audio originale, riempi con silenzio
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


export async function createDrumLoop(url, originalBpm, newBpm, audioContext, loopLengthInBars, targetSampleRate = 44100) {
  let audioBuffer;
  try {
    // 1. Carica il file audio dal URL
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.error("Error fetching drum url:", error);
    throw error;
  }

  const bassLoopBuffer = await changeBpm(audioBuffer, originalBpm, newBpm, audioContext, loopLengthInBars);
  return bassLoopBuffer;
}

export async function changeBpm(audioBuffer, originalBpm, newBpm, audioContext, loopLengthInBars, targetSampleRate = 44100) {
  try {
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


export async function changeTonality1(
  url,
  originalKey,
  targetKey,
  audioContext,
) {
  // 1. Carica il file audio dal URL
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // 2. Mappa le tonalità a semitoni
  const noteToSemitone = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6,
    'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
  };

  const originalSemitone = noteToSemitone[originalKey];
  const targetSemitone = noteToSemitone[targetKey];
  let semitoneDifference = targetSemitone - originalSemitone;

  if (semitoneDifference > 6) {
    semitoneDifference -= 12;
  } else if (semitoneDifference < -6) {
    semitoneDifference += 12;
  }

  // 3. Calcola il pitch shift ratio
  const semitoneRatio = Math.pow(2, 1 / 12); // Rapporto tra semitoni
  const pitchShiftFactor = Math.pow(semitoneRatio, semitoneDifference);

  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;

  // Estrai i dati da ciascun canale
  const channelData = [];
  for (let i = 0; i < numberOfChannels; i++) {
    channelData.push(audioBuffer.getChannelData(i));
  }

  // Concatena i dati dei canali in un segnale stereo
  let stereoData = new Float32Array(channelData[0].length * 2);  // Doppia lunghezza per stereo
  for (let i = 0; i < channelData[0].length; i++) {
    stereoData[i * 2] = channelData[0][i];     // Canale sinistro
    stereoData[i * 2 + 1] = channelData[1][i]; // Canale destro
  }
  console.log("Stereo data dimensions: ", stereoData.length);
  // 4. Istanziare SoundTouch una sola volta per processare il segnale stereo
  const soundTouch = new SoundTouch();
  soundTouch.pitch = pitchShiftFactor;

  // Passa i dati stereo al buffer di ingresso di SoundTouch
  const inputBuffer = soundTouch.inputBuffer
  const outputBuffer = soundTouch.outputBuffer;
  console.log("Input buffer: ", inputBuffer);

  // Scrivi i campioni originali nel buffer di ingresso
  inputBuffer.putSamples(stereoData, stereoData.length);

  console.log("Frame count nell'inputBuffer: ", inputBuffer.frameCount);

  // Esegui il processamento
  soundTouch.process();

  // Estrai i dati modificati dal buffer di uscita
  const processedData = new Float32Array(outputBuffer.frameCount * 2);  // Stereo, quindi *2
  outputBuffer.receiveSamples(processedData, processedData.length);

  console.log("Processed data: ", processedData.slice(0, 10));

  // Separa i canali elaborati
  const leftChannel = new Float32Array(processedData.length / 2);
  const rightChannel = new Float32Array(processedData.length / 2);

  for (let i = 0; i < leftChannel.length; i++) {
    leftChannel[i] = processedData[i * 2];       // Canale sinistro
    rightChannel[i] = processedData[i * 2 + 1]; // Canale destro
  }

  // 5. Crea un nuovo AudioBuffer con i dati modificati
  const processedAudioBuffer = audioContext.createBuffer(
    2,                              // Due canali: sinistro e destro
    leftChannel.length,             // Lunghezza del buffer
    sampleRate                      // Frequenza di campionamento
  );

  // Popola i canali del nuovo AudioBuffer
  processedAudioBuffer.copyToChannel(leftChannel, 0);  // Canale sinistro
  processedAudioBuffer.copyToChannel(rightChannel, 1); // Canale destro

  // 6. Restituisce il nuovo AudioBuffer
  return processedAudioBuffer;
}


export async function calculateSemitoneDifference(originalKey, targetKey) {
  // 2. Mappa le tonalità a semitoni
  const noteToSemitone = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6,
    'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
  };

  const originalSemitone = noteToSemitone[originalKey];
  const targetSemitone = noteToSemitone[targetKey];
  let semitoneDifference = targetSemitone - originalSemitone;

  if (semitoneDifference > 6) {
    semitoneDifference -= 12;
  } else if (semitoneDifference < -6) {
    semitoneDifference += 12;
  }

  return semitoneDifference;
}

export async function fetchAudioBuffer(audioUrl, audioContext) {
  try {
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  } catch (error) {
    console.error("Error fetching audio buffer:", error);
    throw error;
  }
}


export async function changeBufferTempo(audioBuffer, playbackRate) {
  // Creazione di un OfflineAudioContext per il rendering
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    Math.ceil(audioBuffer.length / playbackRate),
    audioBuffer.sampleRate
  );
  console.log("offlineContext creato ");

  // Creazione di un Tone.Player e impostazione del playbackRate
  const player = new Tone.Player({
    autostart: false, // Non partire automaticamente
  }).toDestination();
  player.buffer = audioBuffer;
  console.log("player creato ");


  // Collegare il Player al contesto offline
  player.connect(offlineContext.destination);
  console.log("player collegato a offlineContext ");

  // Inizializzare Tone.js con l'OfflineAudioContext
  Tone.setContext(new Tone.Context(offlineContext));
  console.log("Tone.js inizializzato ");

  // Avviare il player
  player.start();

  // Eseguire il rendering dell'audio processato
  const renderedBuffer = await offlineContext.startRendering();

  // Restituire il nuovo AudioBuffer
  return renderedBuffer;
}

//logica per timestratching senza cambiare pitch usando la dannata 
//libreria soundTouchjs che mi ha fatto piangere la giornata di natale
import SoundTouch from './libs/src/SoundTouch.js';
/*
export async function timeStretchingWithoutPitchChange(audioBuffer, originalBpm, targetBpm, audioContext) {
  if (audioBuffer) {
    console.log("Timestretching in corso...");
    // Converti l'AudioBuffer in array di campioni stereo
    const audioDataLeft = audioBuffer.getChannelData(0);
    const audioDataRight = audioBuffer.getChannelData(1);

    // Inizializza SoundTouch per entrambi i canali
    const soundTouchLeft = new SoundTouch();
    const soundTouchRight = new SoundTouch();

    const timeRatio = targetBpm / originalBpm;

    // Imposta il tempo (tempo) e il tasso di riproduzione (rate) per entrambi i canali
    soundTouchLeft.tempo = timeRatio;
    soundTouchRight.tempo = timeRatio;

    // Passiamo tutti i dati audio nei buffer di input
    soundTouchLeft.inputBuffer.putSamples(audioDataLeft, 0, audioBuffer.length);
    soundTouchRight.inputBuffer.putSamples(audioDataRight, 0, audioBuffer.length);

    // Esegui il processing del timestretching per entrambi i canali
    soundTouchLeft.process();
    soundTouchRight.process();

    console.log("Timestretching completato!");

    // Ottieni i dati elaborati
    const stretchedDataLeft = soundTouchLeft.outputBuffer.vector;
    const stretchedDataRight = soundTouchRight.outputBuffer.vector;

    // Crea un nuovo AudioBuffer per il risultato
    const processedBuffer = audioContext.createBuffer(
      2, // Stereo
      stretchedDataLeft.length / 2, // Numero di frame, diviso per 2 per ottenere il numero corretto di campioni
      audioContext.sampleRate
    );

    // Copia i dati elaborati nei canali del nuovo AudioBuffer
    processedBuffer.copyToChannel(stretchedDataLeft, 0);
    processedBuffer.copyToChannel(stretchedDataRight, 1);

    console.log("Audio elaborato con successo!");

    return processedBuffer;

  }

}*/

export async function timeStretchingWithoutPitchChange(audioBuffer, loopDurationSamples, audioContext) {
  if (audioBuffer) {
    console.log("Timestretching in corso...");
    // Converti l'AudioBuffer in array di campioni stereo
    const audioDataLeft = audioBuffer.getChannelData(0);
    const audioDataRight = audioBuffer.getChannelData(1);

    // Inizializza SoundTouch per entrambi i canali
    const soundTouchLeft = new SoundTouch();
    const soundTouchRight = new SoundTouch();

    const timeRatio = audioBuffer.length / loopDurationSamples;
    console.log("timeRatio: ", timeRatio.toFixed(3));

    // Imposta il tempo (tempo) e il tasso di riproduzione (rate) per entrambi i canali
    soundTouchLeft.tempo = timeRatio;
    soundTouchRight.tempo = timeRatio;

    // Passiamo tutti i dati audio nei buffer di input
    soundTouchLeft.inputBuffer.putSamples(audioDataLeft, 0, audioBuffer.length);
    soundTouchRight.inputBuffer.putSamples(audioDataRight, 0, audioBuffer.length);

    // Esegui il processing del timestretching per entrambi i canali
    soundTouchLeft.process();
    soundTouchRight.process();

    console.log("Timestretching completato!");

    // Ottieni i dati elaborati
    const stretchedDataLeft = soundTouchLeft.outputBuffer.vector;
    const stretchedDataRight = soundTouchRight.outputBuffer.vector;

    // Crea un nuovo AudioBuffer per il risultato
    const processedBuffer = audioContext.createBuffer(
      2, // Stereo
      stretchedDataLeft.length / 2, // Numero di frame, diviso per 2 per ottenere il numero corretto di campioni
      audioContext.sampleRate
    );

    // Copia i dati elaborati nei canali del nuovo AudioBuffer
    processedBuffer.copyToChannel(stretchedDataLeft, 0);
    processedBuffer.copyToChannel(stretchedDataRight, 1);

    console.log("lunghezza Buffer prima di troncamento o padding: ", processedBuffer.length);
    // Se la lunghezza del processedBuffer non è uguale a loopDurationSamples, tronca o aggiungi padding di zeri
    if (processedBuffer.length !== loopDurationSamples) {
      const adjustedBuffer = audioContext.createBuffer(
        2, // Stereo
        loopDurationSamples,
        audioContext.sampleRate
      );

      for (let channel = 0; channel < 2; channel++) {
        const channelData = processedBuffer.getChannelData(channel);
        const adjustedChannelData = adjustedBuffer.getChannelData(channel);

        if (channelData.length > loopDurationSamples) {
          // Truncate the data
          adjustedChannelData.set(channelData.subarray(0, loopDurationSamples));
        } else {
          // Copy the data and pad with zeros
          adjustedChannelData.set(channelData);
          adjustedChannelData.set(new Float32Array(loopDurationSamples - channelData.length), channelData.length);
        }
      }

      return adjustedBuffer;
    }

    console.log("Audio elaborato con successo!");

    return processedBuffer;

  }

}

export async function cutAudioBuffer(audioBuffer, loopLengthInBars, audioContext) {
  console.log("original bufferLenght: ", audioBuffer.length);

  if (loopLengthInBars === 16) {
    return audioBuffer;
  } else if (loopLengthInBars === 8) {
    const halfLength = Math.floor(audioBuffer.length / 2);
    const halfBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      halfLength,
      audioBuffer.sampleRate
    );
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      const halfChannelData = halfBuffer.getChannelData(channel);
      halfChannelData.set(channelData.subarray(0, halfLength));
    }
    console.log("half bufferLenght: ", halfBuffer.length);
    return halfBuffer;

  } else if (loopLengthInBars === 4) {
    const quarterLength = Math.floor(audioBuffer.length / 4);
    const quarterBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      quarterLength,
      audioBuffer.sampleRate
    );
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      const quarterChannelData = quarterBuffer.getChannelData(channel);
      quarterChannelData.set(channelData.subarray(0, quarterLength));
    }
    console.log("quarter bufferLenght: ", quarterBuffer.length);
    return quarterBuffer;
  } else {

    throw new Error("Unsupported loop length in bars");
  }
}

  const keyMap = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6,
    'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
  };
// logica di estrazione databse
function selectTrackByGenreAndKey(genre, key, trackType, drumTracks, bassTracks, bpm) {
  let selectedTrack;
  console.log("Genre:", genre);
  console.log("Key:", key);
  console.log("Track Type:", trackType);
  console.log("Drum Tracks:", drumTracks);
  console.log("Bass Tracks:", bassTracks);
  console.log("BPM:", bpm);
  if (trackType === 'drum') {
    // Filtra le tracce di batteria con il genere specificato e il bpm <= quello passato
    const genreTracks = drumTracks.filter(track => track.getGenre().toLowerCase() === genre.toLowerCase() && track.getBpm() <= bpm);
    console.log("Genre Tracks:", genreTracks);
    // Ordina per bpm decrescente e seleziona la prima traccia
    selectedTrack = genreTracks.sort((a, b) => b.getBpm() - a.getBpm())[0].getUrl();
  } else if (trackType === 'bass') {
    // Filtra le tracce di basso con il genere specificato e il bpm <= quello passato
    const genreTracks = bassTracks.filter(track => track.getGenre().toLowerCase() === genre.toLowerCase() && track.getBpm() <= bpm);
    
    // Ordina per bpm decrescente e seleziona la prima traccia
    selectedTrack = genreTracks.sort((a, b) => b.getBpm() - a.getBpm())[0]; // Seleziona la traccia con bpm più alto

    // Mappa la tonalità all'indice
    const keyIndex = keyMap[key]; // Mappa la tonalità alla sua posizione (0 - 11)
    selectedTrack = selectedTrack.getUrls()[keyIndex]; // Prendi la traccia corrispondente alla tonalità
  }
  return selectedTrack;
}


export async function selectTracks(selectedGenres, selectedKey, drumTracks, bassTracks, bpm) {
  let drumUrl, bassUrl;

  if (selectedGenres.length === 1) {
    // Se c'è solo un genere, seleziona le tracce con lo stesso genere per batteria e basso
    const genre = selectedGenres[0].toLowerCase();
    drumUrl = selectTrackByGenreAndKey(genre, selectedKey, 'drum', drumTracks, bassTracks,bpm);
    bassUrl = selectTrackByGenreAndKey(genre, selectedKey, 'bass', drumTracks, bassTracks,bpm);
  } else if (selectedGenres.length === 2) {
    // Se ci sono due generi, seleziona casualmente quale applicare a batteria e basso
    const genre1 = selectedGenres[0].toLowerCase();
    const genre2 = selectedGenres[1].toLowerCase();

    // Pesca casualmente quale genere applicare alla batteria e quale al basso
    const isDrumGenreFirst = Math.random() > 0.5;
    if (isDrumGenreFirst) {
      drumUrl = selectTrackByGenreAndKey(genre1, selectedKey, 'drum', drumTracks, bassTracks,bpm);
      bassUrl = selectTrackByGenreAndKey(genre2, selectedKey, 'bass', drumTracks, bassTracks,bpm);
    } else {
      drumUrl = selectTrackByGenreAndKey(genre2, selectedKey, 'drum', drumTracks, bassTracks,bpm);
      bassUrl = selectTrackByGenreAndKey(genre1, selectedKey, 'bass', drumTracks, bassTracks,bpm);
    }
  }
  return [drumUrl, bassUrl];
}

export function findTheFirstEnergyPeak(audioBuffer, threshold) {
   // Soglia per considerare un picco significativo
  const channelData = audioBuffer.getChannelData(0); // Analizza solo il primo canale

  for (let i = 0; i < channelData.length; i++) {
    if (Math.abs(channelData[i]) > threshold) {
      return i; // Ritorna l'indice del primo picco significativo
    }
  }

  return -1; // Ritorna -1 se non viene trovato alcun picco significativo
}
