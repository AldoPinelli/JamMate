import * as BPM_detection from './BPM-detection.js';
import * as Utility from './utility.js';
import * as KEY_detection from './KEY-detection.js';
import * as buffer_to_wav from './buffer_to_wav.js';



const audioContext = new AudioContext({ sampleRate: 44100 });

// Recupera il bottone iniziale, i bottoni di azione e il contenitore principale
const startBtn = document.getElementById('startBtn');
const actionButtons = document.getElementById('actionButtons');
const container = document.querySelector('.container');
const container2 = document.querySelector('.container2');
let raw_wavesurfer = null;
let bpm;
let uploaded_file;
let melodyAudioBuffer;
const keyButtons = document.querySelectorAll('.key-btn');

startBtn.addEventListener('click', () => {
    // Sposta il contenitore verso l'alto
    container.style.transform = 'translateY(-20%)';
    // Fai comparire gradualmente i bottoni di azione
    actionButtons.style.opacity = '1';
});

//Caricamento file da locale
uploadBtn.addEventListener('click', () => {
    const validTypes = ['audio/wav', 'audio/x-wav', 'audio/mp3', 'audio/mpeg', 'audio/aiff', 'audio/x-aiff'];
    //creo un input di tipo file per accettare diversi formati audio
    const fileInput = document.createElement('input');
    fileInput.type = 'file';

    //aggiungo un event listener per caricare il file audio
    fileInput.onchange = () => {
        const file = fileInput.files[0];
        if (!validTypes.includes(file.type.toLowerCase())) {
            console.error('Tipo di file non supportato. Seleziona un file WAV, MP3 o AIFF.');
            return;
        }
        console.log("File caricato e pronto per essere lazzarato: ", file);
        uploaded_file = file;
        renderWaveform(URL.createObjectURL(file));
    };
    fileInput.click();

});

// 2. Registrazione audio
// stiamo usando l'API MediaCapture and Streams per registrare l'audio
// mediaRecorder è un oggetto che all'evento (ondataavailable) cattura i dati audio registrati e li salva in un array (recordingChunks)
// recordinInterval è un intervallo che aggiorna il timer ogni secondo per mostrare il tempo trascorso
let mediaRecorder = null;
let recordingChunks = [];
let recordingInterval = null;
let countdownInterval = null;
let countdown = 3;
let alreadyPressed = false;
let detectedKeys;

recordBtn.addEventListener('click', async () => {

    if (mediaRecorder && mediaRecorder.state === 'recording') {
        // Stop alla registrazione
        mediaRecorder.stop();
        clearInterval(countdownInterval);
        clearInterval(recordingInterval);
        timer.style.display = 'none';
        alreadyPressed = false;
        return;
    }
    if (alreadyPressed) {
        console.log("stai provadn a fare il lazzarone");
        return;
    }
    try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
        console.error("Errore durante l'accesso al microfono:", error);
        return;
    }
    alreadyPressed = true;
    resetWaveform();

    const countdownDisplay = document.createElement('div');
    countdownDisplay.id = 'countdownDisplay';
    container.appendChild(countdownDisplay);

    countdownDisplay.style.display = 'block';
    countdown = 3;

    countdownInterval = setInterval(() => {
        countdownDisplay.textContent = `La registrazione parte fra ${countdown}...`;
        countdown--;

        if (countdown < 0) {
            clearInterval(countdownInterval);
            countdownDisplay.style.display = 'none'; // Nascondi il countdown
            startRecording(); // Inizia la registrazione
        }
    }, 1000);

});

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        let mimeType = "";
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            mimeType = 'audio/webm;codecs=opus'; // Chrome, Edge
        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
            mimeType = 'audio/ogg;codecs=opus'; // Firefox
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4'; // Safari
        } else {
            alert("Il tuo browser non supporta la registrazione audio.");
            throw new Error("Formato audio non supportato.");
        }
        console.log("Usando il formato audio: ", mimeType);
        mediaRecorder = new MediaRecorder(stream, { mimeType });
        recordingChunks = [];

        // Crea e mostra dinamicamente il timer
        let timer = document.getElementById('timer');
        if (!timer) {
            timer = document.createElement('div');
            timer.id = 'timer';
            timer.style.marginTop = '10px';
            timer.style.color = 'yellow';
            timer.textContent = 'Recording... ';

            const timeElapsed = document.createElement('span');
            timeElapsed.id = 'timeElapsed';
            timeElapsed.textContent = '0';

            timer.appendChild(timeElapsed);
            container.appendChild(timer);
        }

        timer.style.display = 'block';

        // Mostra il timer
        let seconds = 0;
        timeElapsed.textContent = seconds;
        recordingInterval = setInterval(() => {
            seconds++;
            timeElapsed.textContent = seconds;
        }, 1000);

        // Eventi MediaRecorder
        mediaRecorder.ondataavailable = (e) => recordingChunks.push(e.data);

        mediaRecorder.onstop = () => {
            //new Blob (parts=ovvero array contenente dati binari o testuali, options=oggetti per sepcificare tipo di file)
            const audioBlob = new Blob(recordingChunks, { type: mimeType });
            console.log("Registrazione completata. File audio pronto per essere lazzarato: ", audioBlob);
            uploaded_file = audioBlob;
            renderWaveform(URL.createObjectURL(audioBlob));

        };

        mediaRecorder.start();
    } catch (error) {
        console.error("Errore durante l'accesso al microfono:", error);
    }
}

// Funzione per resettare la waveform
function resetWaveform() {
    if (raw_wavesurfer) {
        raw_wavesurfer.destroy();
        raw_wavesurfer = null;
    }
    const existingWaveContainer = document.getElementById('waveContainer');
    if (existingWaveContainer) {
        existingWaveContainer.remove();
    }
}

// Funzione per creare e caricare la waveform
function renderWaveform(audioURL) {
    resetWaveform(); // Resetta la waveform precedente

    // Crea il contenitore per la waveform
    const waveContainer = document.createElement('div');
    waveContainer.id = "waveContainer";

    // Crea il div per la waveform
    const waveform = document.createElement('div');
    waveform.id = "waveform";

    // Aggiungi tutto al DOM
    waveContainer.appendChild(waveform);
    container.appendChild(waveContainer);

    // Inizializza raw_wavesurfer con wavesurfer.js
    raw_wavesurfer = configureWaveSurfer('#waveform', 'violet', 'purple');
    raw_wavesurfer.load(audioURL);

    // Aggiungi il pulsante Play/Pause
    const playbackBtn = document.createElement('button');
    playbackBtn.id = "playbackBtn";
    playbackBtn.textContent = "Play/Pause";
    playbackBtn.classList.add('styled-button');
    waveContainer.appendChild(playbackBtn);

    playbackBtn.addEventListener('click', () => {
        raw_wavesurfer.playPause();
    });

    const analyzeBtn = document.createElement('button');
    analyzeBtn.id = "AnalyzeBtn";
    analyzeBtn.textContent = "Analizza la traccia e partiamo!";
    analyzeBtn.classList.add('styled-button');
    waveContainer.appendChild(analyzeBtn);

    analyzeBtn.addEventListener('click', async () => {
        //container.style.display = 'none';  // Nascondi il primo contenitore
        //container2.style.display = 'flex'; // Mostra il secondo contenitore
        //const dynamicElements = document.querySelectorAll('#waveContainer, #countdownDisplay, #timer');
        //dynamicElements.forEach(element => element.remove());


        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'div';

        const loadingText = document.createElement('p');
        loadingText.id = 'h2';
        loadingText.textContent = 'Detecting bpm and keys....';

        const spanElement = document.createElement('span');
        spanElement.id = 'lol';
        loadingText.appendChild(spanElement);

        loadingContainer.appendChild(loadingText);
        container.appendChild(loadingContainer);

        //cambio sample rate della melodia caricata dall'utente
        melodyAudioBuffer = await Utility.loadBuffer(uploaded_file, audioContext);
        melodyAudioBuffer = await Utility.changeSampleRate(melodyAudioBuffer, 44100);
        //se l'audio è registrato da mic converto a stereo
        if (melodyAudioBuffer.numberOfChannels === 1) {
            melodyAudioBuffer = Utility.convertMonoToStereo(melodyAudioBuffer, audioContext);
        }

        //console.log("Numero di canali: ", melodyAudioBuffer.numberOfChannels);
        const peaks = BPM_detection.getPeaks([melodyAudioBuffer.getChannelData(0), melodyAudioBuffer.getChannelData(1)]);
        const groups = BPM_detection.getIntervals(peaks);
        var top = groups.sort(function (intA, intB) {
            return intB.count - intA.count;
        }).splice(0, 5); //prendo i primi 5 gruppi con tempo piu frequente e li metto in array top
        bpm = Math.round(top[0].tempo);
        console.log("BPM trovato: ", bpm);


        //key detection
        const fftSize = 4096;
        const fft = new FFT(fftSize, audioContext.sampleRate);
        const chromaData = KEY_detection.chroma(melodyAudioBuffer, fft, fftSize);
        var notes = KEY_detection.extractNotesFromChroma(chromaData);
        detectedKeys = KEY_detection.detectKey(notes);
        console.log("Tonalità trovate: ", detectedKeys);

        //troviamo il punto di taglio per la melodia
        const cutPoint = BPM_detection.getClosestPeakToZero(groups);
        console.log("Punto di taglio: ", cutPoint);

        // Elimina la parte prima del cutPoint in melodyAudioBuffer
        melodyAudioBuffer = Utility.trimBuffer(melodyAudioBuffer, cutPoint, audioContext);
        console.log("Buffer tagliato: ", melodyAudioBuffer);


        setTimeout(() => {

            const resultContainer = document.createElement('div');
            resultContainer.className = 'result-container';

            const bpmText = document.createElement('p');
            bpmText.textContent = `Detected Bpm: ${bpm}`;
            resultContainer.appendChild(bpmText);

            const keysText = document.createElement('p');
            keysText.textContent = `Detected possible Keys: ${detectedKeys.join(', ')}`;
            resultContainer.appendChild(keysText);

            const actionButton = document.createElement('button');
            actionButton.className = 'styled-button action-button';
            actionButton.textContent = 'Partiamo!';


            resultContainer.appendChild(actionButton);


            actionButton.addEventListener('click', () => {
                container.style.display = 'none';
                container2.style.display = 'flex';
                keyButtons[0].textContent = detectedKeys[0];
                keyButtons[1].textContent = detectedKeys[1];
                keyButtons.forEach(btn => btn.classList.remove('selected'));
                selectedKey = null;
            });

            container.appendChild(resultContainer);

        }, 100);

    });
}


function configureWaveSurfer(containerId, waveColor, progressColor) {
    try {
        return WaveSurfer.create({
            container: containerId,
            waveColor: waveColor,
            progressColor: progressColor,
            height: 100,
            responsive: true,
            barWidth: 2,
            barGap: 1,
            barRadius: 2,
            backend: 'mediaelement',
        });
    } catch (error) {
        console.error("Errore durante la configurazione di WaveSurfer:", error);
        return null;
    }
}




//GESTIONE DEL CONTAINER 2
const backBtn = document.getElementById('backBtn');
const jamButton = document.getElementById('jam-button');
const genreButtons = document.querySelectorAll('.genre-btn');
const loopButtons = document.querySelectorAll('.loop-btn');
const algorithmButtons = document.querySelectorAll('.algorithm-btn');

let loopDuration;
let loopDurationSamples;
let selectedKey;
let selectedGenres = [];
let selectedLoopLength;
let selectedAlgorithm;
start_Btn = document.getElementById('start_Btn');
stop_Btn = document.getElementById('stop_Btn');
let melodyLoopBuffer;
let drumLoopBuffer;
let bassLoopBuffer;
const audioURL = "https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/drum_162bpm_24.mp3";
const bassURL = "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/theChicken-Bb.mp3";
const metronomeURL = "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/metronome.mp3";
const container3 = document.querySelector('.container3');

let melodyWave = configureWaveSurfer('#melodyWaveform', 'violet', 'purple');
let drumWave = configureWaveSurfer('#drumWaveform', 'yellow', 'orange');
let bassWave = configureWaveSurfer('#bassWaveform', 'blue', 'lightblue');




//Bottoni
backBtn.addEventListener('click', () => {
    container2.style.display = 'none';  // Nascondi il secondo contenitore
    container.style.display = 'block'; // Mostra il primo contenitore
    container3.style.display = 'none'; // Nascondi il terzo contenitore
    container.style.display = 'flex'; // Mostra il primo contenitore

    const resultContainer = document.querySelector('.result-container');
    const loadingContainer = document.querySelector('.div');
    if (resultContainer && loadingContainer) {
        resultContainer.remove();
        loadingContainer.remove();
    }
});

genreButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.classList.contains('selected')) {
            button.classList.remove('selected');
            selectedGenres = selectedGenres.filter(genre => genre !== button.textContent);
        } else {
            if (selectedGenres.length < 2) {
                button.classList.add('selected');
                selectedGenres.push(button.textContent);
            }
        }
    });
});

loopButtons.forEach(button => {
    button.addEventListener('click', () => {
        loopButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedLoopLength = parseInt(button.textContent.split(' ')[0], 10);
    });
});

keyButtons.forEach(button => {
    button.addEventListener('click', () => {
        keyButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedKey = button.textContent.charAt(0);
        console.log('Chiave selezionata:', selectedKey);
    });
});

algorithmButtons.forEach(button => {
    button.addEventListener('click', () => {
        algorithmButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedAlgorithm = button.textContent.split(' ')[1];
        console.log('Algoritmo selezionato:', selectedAlgorithm);
    });
});

//inizializzazione effetti
//Reverb
let melodyReverb = new Tone.Reverb({ decay: 1, wet: 0 }).toDestination();
let drumReverb = new Tone.Reverb({ decay: 1, wet: 0 }).toDestination();
let bassReverb = new Tone.Reverb({ decay: 1, wet: 0 }).toDestination();

//Delay
let melodyDelay = new Tone.FeedbackDelay("8n", 0.3).connect(melodyReverb);
melodyDelay.wet.value = 0;
let drumDelay = new Tone.FeedbackDelay("8n", 0.3).connect(drumReverb);
drumDelay.wet.value = 0;
let bassDelay = new Tone.FeedbackDelay("8n", 0.3).connect(bassReverb);
bassDelay.wet.value = 0;



//Iizializzazione Tone Players
let melodyTonePlayer = new Tone.Player({
    loop: true,
}).connect(melodyDelay);
melodyTonePlayer.volume.value = Tone.gainToDb(1 / 2);


let drumTonePlayer = new Tone.Player({
    playbackRate: 1,
    loop: true,
}).connect(drumDelay);
drumTonePlayer.volume.value = Tone.gainToDb(1 / 2);


let bassPitchShift = new Tone.PitchShift({
    pitch: 0, // Default pitch shift value
}).connect(bassDelay); // Connect to bass delay

let bassTonePlayer = new Tone.Player({
    loop: true,
}).connect(bassPitchShift);
bassTonePlayer.volume.value = Tone.gainToDb(1 / 2);



let metronome = new Tone.Player({
    url: metronomeURL, // URL del suono del metronomo
}).toDestination();

//  JAM BUTTON
jamButton.addEventListener('click', async () => {
    if (selectedGenres.length === 0 || !selectedLoopLength || !selectedKey) {
        alert('Seleziona almeno un genere, una lunghezza del loop e una chiave.');
        return;
    }

    container3.style.display = 'flex';
    document.querySelector('.controls').style.display = 'block';
    console.log('Generi selezionati:', selectedGenres);
    console.log('Lunghezza del loop selezionata:', selectedLoopLength);

    //CREAZIONE MELODIA LOOP
    melodyLoopBuffer = await Utility.createJamLoop(melodyAudioBuffer, bpm, selectedLoopLength, audioContext);
    console.log("Loop creato: ", melodyLoopBuffer);
    melodyTonePlayer.buffer = melodyLoopBuffer;
    console.log("Melody Tone Player: ", melodyLoopBuffer.length);
    loopDuration = melodyLoopBuffer.duration;
    loopDurationSamples = melodyLoopBuffer.length;

    //CREAZIONE DRUM LOOP
    /*drumLoopBuffer = await Utility.createDrumLoop(audioURL, 78, bpm, audioContext, selectedLoopLength);
    drumTonePlayer.buffer = drumLoopBuffer;
    console.log("Drum Tone Player: ", drumLoopBuffer.length);*/
    drumLoopBuffer = await Utility.fetchAudioBuffer(audioURL, audioContext);
    drumLoopBuffer = await Utility.cutAudioBuffer(drumLoopBuffer, selectedLoopLength, audioContext);
    drumLoopBuffer = await Utility.timeStretchingWithoutPitchChange(drumLoopBuffer, loopDurationSamples, audioContext);
    drumTonePlayer.buffer = drumLoopBuffer;
    console.log("Drum Tone Player: ", drumLoopBuffer.length);


    //CREAZIONE BASS LOOP
    bassLoopBuffer = await Utility.fetchAudioBuffer(bassURL, audioContext);
    bassLoopBuffer = await Utility.cutAudioBuffer(bassLoopBuffer,selectedLoopLength, audioContext);
    bassLoopBuffer = await Utility.timeStretchingWithoutPitchChange(bassLoopBuffer, loopDurationSamples, audioContext);
    bassTonePlayer.buffer = bassLoopBuffer;
    console.log("Bass Tone Player: ", bassLoopBuffer.length);

    



    //TARARE EFFETTI
    melodyDelay.delayTime.value = (60 / bpm) * 0.5; // Imposta il tempo di delay per la melodia
    drumDelay.delayTime.value = (60 / bpm) * 0.5; // Imposta il tempo di delay per la batteria
    bassDelay.delayTime.value = (60 / bpm) * 0.5; // Imposta il tempo di delay per il basso



    //CREAZIONE DELLA PARTE GRAFICA
    //Melodia
    const melodyData = await buffer_to_wav.bufferToWave(melodyLoopBuffer);
    const melodyBlob = new Blob([melodyData], { type: 'audio/wav' });
    const melodyUrl = URL.createObjectURL(melodyBlob);
    melodyWave.load(melodyUrl);
    melodyWave.setVolume(0);

    //Drum
    const drumData = await buffer_to_wav.bufferToWave(drumLoopBuffer);
    const drumBlob = new Blob([drumData], { type: 'audio/wav' });
    const drumUrl = URL.createObjectURL(drumBlob);
    drumWave.load(drumUrl);
    drumWave.setVolume(0);

    //Bass
    const bassData = await buffer_to_wav.bufferToWave(bassLoopBuffer);
    const bassBlob = new Blob([bassData], { type: 'audio/wav' });
    const bassUrl = URL.createObjectURL(bassBlob);
    bassWave.load(bassUrl);
    bassWave.setVolume(0);


});

//START AND STOP BUTTONS
let startTime;
let loopStatus = false;
const loopInterval = { id: null };
let intervalId
start_Btn.addEventListener('click', () => {
    if (loopStatus) {
        return;
    }
    startTime = audioContext.currentTime + 0.1;

    // Gestione tone player
    melodyTonePlayer.start(startTime);
    drumTonePlayer.start(startTime);
    bassTonePlayer.start(startTime);
    /*intervalId = setInterval(() => {
        metronome.start();
    }, 60 / bpm * 1000);*/

    // Gestione wavesurfer
    melodyWave.play(startTime);
    drumWave.play(startTime);
    bassWave.play(startTime);

    Utility.syncWaveformWithAudio(loopDuration, loopInterval, [melodyWave, drumWave, bassWave]);
    loopStatus = true;
});

stop_Btn.addEventListener('click', () => {
    if (!loopStatus) {
        return;
    }
    // Gestione tone player
    melodyTonePlayer.stop();
    drumTonePlayer.stop();
    bassTonePlayer.stop();
    //clearInterval(intervalId);



    // Gestione wavesurfer
    melodyWave.stop();
    drumWave.stop();
    bassWave.stop();

    clearInterval(loopInterval.id); // Ferma l'intervallo
    loopStatus = false;
});




//GESTIONE EFFETTI
document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('input', event => {
        const slider = event.target;
        const value = slider.value; // Valore corrente dello slider
        const numberDisplay = slider.parentNode.querySelector('.number');
        numberDisplay.textContent = value; // Aggiorna il numero visualizzato

        const type = slider.dataset.type; // melody, drum o bass
        const param = slider.dataset.param; // volume, reverb o delay

        if (param === 'volume') {
            // Seleziona il player corretto in base a data-type
            switch (type) {
                case 'melody':
                    melodyTonePlayer.volume.value = Tone.gainToDb(value / 100); // Volume del player melody
                    break;
                case 'drum':
                    drumTonePlayer.volume.value = Tone.gainToDb(value / 100); // Volume del player drum
                    break;
                case 'bass':
                    bassTonePlayer.volume.value = Tone.gainToDb(value / 100); // Volume del player bass
                    break;
            }
        } else if (param === 'reverb') {
            // Modifica il riverbero per il player selezionato
            switch (type) {
                case 'melody':
                    //melodyReverb.decay = value / 100 * 10; // Imposta il decay del riverbero
                    melodyReverb.wet.value = value / 100; // Imposta il mix del riverbero
                    break;
                case 'drum':
                    //drumReverb.decay = value / 100 * 10; // Imposta il decay del riverbero
                    drumReverb.wet.value = value / 100; // Imposta il mix del riverbero
                    break;
                case 'bass':
                    //bassReverb.decay = value / 100 * 10; // Imposta il decay del riverbero
                    bassReverb.wet.value = value / 100; // Imposta il mix del riverbero
                    break;
            }
        } else if (param === 'delay') {
            // Modifica il delay per il player selezionato
            switch (type) {
                case 'melody':
                    //melodyDelay.delayTime.value = value / 100 * 1; // Imposta il delay time (max 1 secondo)
                    //melodyDelay.feedback.value = value / 100; // Imposta il feedback del delay
                    melodyDelay.wet.value = value / 100; // Imposta il mix del delay
                    break;
                case 'drum':
                    //drumDelay.delayTime.value = value / 100 * 1; // Imposta il delay time
                    //drumDelay.feedback.value = value / 100; // Imposta il feedback del delay
                    drumDelay.wet.value = value / 100; // Imposta il mix del delay
                    break;
                case 'bass':
                    //bassDelay.delayTime.value = value / 100 * 1; // Imposta il delay time
                    //bassDelay.feedback.value = value / 100; // Imposta il feedback del delay
                    bassDelay.wet.value = value / 100; // Imposta il mix del delay
                    break;
            }
        }
    });
});










