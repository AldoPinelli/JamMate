import * as BPM_detection from './BPM-detection.js';
import * as Utility from './utility.js';
import * as KEY_detection from './KEY-detection.js';
import * as buffer_to_wav from './buffer_to_wav.js';
import { drumTracks, bassTracks, availableMelodies } from './track.js';




const audioContext = new AudioContext({ sampleRate: 44100 });

// Recupera il bottone iniziale, i bottoni di azione e il contenitore principale

const startRecordBtn = document.getElementById('startRecordBtn');
const stopBtn = document.getElementById('stopBtn');
const bpmToggleBox = document.getElementById('bpmToggleBox');
const randomMelodyBtn = document.getElementById('randomMelody');



const container = document.querySelector('.container');
const container2 = document.querySelector('.container2');
const bpmInfoContainer = document.getElementById('bpmInfoContainer');
const keyInfoContainer = document.getElementById('keyInfoContainer');
const onsetInfoContainer = document.getElementById('onsetInfoContainer');
const keyButtons = document.querySelectorAll('.key-btn');
const bpmInput = document.getElementById('select-bpm');
const toggleBpm = document.getElementById('toggle-bpm');
const backToMainBpm = document.getElementById('backToMainBpm');
const backToMainKey = document.getElementById('backToMainKey');
const backToMainOnset = document.getElementById('backToMainOnset');
const infoRecordBtn = document.getElementById('infoRecord');


let raw_wavesurfer = null;
let bpm;
let selectedBpm = 120;
let lastSelectedBpm = null;

bpmInput.addEventListener('input', () => {
    selectedBpm = parseInt(bpmInput.value);
    console.log('BPM selezionato:', selectedBpm);
});

const elementsToRemove = [
    'loadingContainer', 'loadingText', 'lol', 'resultContainer',
    'bpmContainer', 'bpmText', 'info-bpm', 'keysContainer', 'keysText',
    'info-keys', 'actionButton'
];

const metronomeURL = "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/metronome.mp3";
let metronome = new Tone.Player({
    url: metronomeURL, // URL del suono del metronomo
}).toDestination();

let useBpm = false;
toggleBpm.addEventListener('change', () => {
    useBpm = toggleBpm.checked;
    console.log('Use BPM:', useBpm);
});

let uploaded_file;
let melodyAudioBuffer;
let cutPointBpm;
let cutPointThreshold;
let useSelectedBpm = false;

function clearElementsToRemove() {
    elementsToRemove.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
        }
    });
}

//Caricamento file da locale
let fileInput = null;
uploadBtn.addEventListener('click', () => {
    clearElementsToRemove();
    startRecordBtn.style.display = 'none';
    stopBtn.style.display = 'none';
    bpmToggleBox.style.display = 'none';
    infoRecordBtn.style.display = 'none';
    const validTypes = ['audio/wav', 'audio/x-wav', 'audio/mp3', 'audio/mpeg', 'audio/aiff', 'audio/x-aiff'];
    //creo un input di tipo file per accettare diversi formati audio
    fileInput = document.createElement('input');
    fileInput.type = 'file';

    //aggiungo un event listener per caricare il file audio
    fileInput.onchange = () => {
        const file = fileInput.files[0];
        if (!validTypes.includes(file.type.toLowerCase())) {
            const errorMessage = 'Tipo di file non supportato. Seleziona un file WAV, MP3 o AIFF.';
            console.error(errorMessage);
            alert(errorMessage);  // Mostra l'errore tramite un pop-up
            return;
        }
        console.log("File caricato e pronto per essere lazzarato: ", file);
        useSelectedBpm = false;
        uploaded_file = file;
        renderWaveform(URL.createObjectURL(file));
    };
    fileInput.click();

});

randomMelodyBtn.addEventListener('click', () => {
    clearElementsToRemove();
    startRecordBtn.style.display = 'none';
    stopBtn.style.display = 'none';
    bpmToggleBox.style.display = 'none';
    infoRecordBtn.style.display = 'none';
    const randomIndex = Math.floor(Math.random() * availableMelodies.length);
    const randomMelodyUrl = availableMelodies[randomIndex];
    console.log('Random Melody URL:', randomMelodyUrl);
    fetch(randomMelodyUrl)
        .then(response => response.blob())
        .then(blob => {
            uploaded_file = new File([blob], "randomMelody.mp3", { type: blob.type });
        })
        .catch(error => console.error('Errore durante il fetch della melodia casuale:', error));
    useSelectedBpm = false;
    renderWaveform(randomMelodyUrl);
});



// 2. Registrazione audio
// stiamo usando l'API MediaCapture and Streams per registrare l'audio
// mediaRecorder è un oggetto che all'evento (ondataavailable) cattura i dati audio registrati e li salva in un array (recordingChunks)
// recordinInterval è un intervallo che aggiorna il timer ogni secondo per mostrare il tempo trascorso
let mediaRecorder = null;
let recordingChunks = [];
let recordingInterval = null;
let countdownInterval = null;
let countdown = 7;
let alreadyPressed = false;
let detectedKeys;

let metronomeStarted = false;
let metronomeEventId = null; // ID per l'evento del metronomo
function startMetronome(bpm) {
    if (metronomeStarted) return; // Evita di avviare il metronomo se già avviato
    metronomeStarted = true;

    // Cancella eventuali eventi schedulati precedenti (se presenti)
    if (metronomeEventId !== null) {
        Tone.Transport.clear(metronomeEventId);
    }

    // Pianifica il metronomo e salva l'ID dell'evento
    metronomeEventId = Tone.Transport.scheduleRepeat((time) => {
        // Suona il click del metronomo
        metronome.start(time);
    }, 60 / bpm); // Intervallo basato sul BPM

    // Avvia il trasporto (se non è già avviato)
    if (!Tone.Transport.state || Tone.Transport.state === 'stopped') {
        Tone.Transport.start();
    }
}

function stopMetronome() {
    if (!metronomeStarted) return; // Se il metronomo non è mai stato avviato, non fare nulla
    metronomeStarted = false;

    // Ferma il click del metronomo
    if (metronome) {
        metronome.stop();
    }

    // Ferma il trasporto solo se non ci sono altri eventi attivi
    if (Tone.Transport.state === 'started') {
        Tone.Transport.stop();
    }

    // Cancella l'evento del metronomo
    if (metronomeEventId !== null) {
        Tone.Transport.clear(metronomeEventId);
        metronomeEventId = null; // Resetta l'ID
    }
}

recordBtn.addEventListener('click', async () => {

    clearElementsToRemove();
    startRecordBtn.style.display = 'inline-block';
    bpmToggleBox.style.display = 'inline-block';
    infoRecordBtn.style.display = 'inline-block';

});

startRecordBtn.addEventListener('click', async () => {
    clearElementsToRemove();
    uploadBtn.style.display = 'none';
    randomMelodyBtn.style.display = 'none';
    if (alreadyPressed) {
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
    countdown = 7;
    let firstTimeInterval = true;
    countdownInterval = setInterval(() => {
        if (countdown >= 0) {
            // Aggiorna il display
            countdownDisplay.textContent = `La registrazione parte fra ${countdown}...`;
            countdown--; // Decrementa il countdown
            if (firstTimeInterval === true) {
                if (useBpm === true) {
                    console.log("entrato useBpm: ", useBpm);
                    startMetronome(selectedBpm);
                }
                console.log("entered");
                firstTimeInterval = false;
            }

        } else {
            // Quando il countdown finisce, ferma la ripetizione
            clearInterval(countdownInterval); // Ferma il countdown
            countdownDisplay.style.display = 'none'; // Nascondi il countdown
            if (useBpm === true) {
                console.log("entrato: ", useBpm);
                useSelectedBpm = true;
                lastSelectedBpm = selectedBpm;
            } else {
                useSelectedBpm = false;
            }
            startRecording(); // Inizia la registrazione
            startRecordBtn.style.display = 'none';
        }
    }, (60 / selectedBpm) * 1000); // Ogni 60/bpm secondi

    // Avvia il trasporto
    Tone.Transport.start();

});

stopBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop(); // Ferma la registrazione
        clearInterval(countdownInterval);
        clearInterval(recordingInterval);
        timer.style.display = 'none';
        alreadyPressed = false;
        stopMetronome();
        stopBtn.style.display = 'none';
        startRecordBtn.style.display = 'none';
        bpmToggleBox.style.display = 'none';
        infoRecordBtn.style.display = 'none';
        uploadBtn.style.display = 'block';
        randomMelodyBtn.style.display = 'block';
    }
});

async function startRecording() {
    Tone.start();
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
        stopBtn.style.display = 'inline-block';

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
            if (audioBlob.size > 44000) {
                console.log("Registrazione completata. File audio pronto per essere lazzarato: ", audioBlob);
                uploaded_file = audioBlob;
                if (useSelectedBpm === false) {
                    useSelectedBpm = false;
                }
                renderWaveform(URL.createObjectURL(audioBlob));
            } else {
                alert("Registrazione troppo corta, riprova");
            }

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
    analyzeBtn.textContent = "Analyze the melody";
    analyzeBtn.classList.add('styled-button');
    waveContainer.appendChild(analyzeBtn);

    analyzeBtn.addEventListener('click', async () => {
        clearElementsToRemove();
        console.log("useSelectedbpm & lastSelectedBpm ", useSelectedBpm, lastSelectedBpm);

        const loadingContainer = document.createElement('div');
        loadingContainer.id = 'loadingContainer';
        loadingContainer.className = 'div';

        const loadingText = document.createElement('p');
        loadingText.className = 'loading-text';
        loadingText.textContent = 'Detecting bpm and keys....';

        loadingContainer.appendChild(loadingText);
        container.appendChild(loadingContainer);
        loadingContainer.classList.add('animated');


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
        console.log("fft : ", fft);
        const chromaData = KEY_detection.chroma(melodyAudioBuffer, fft, fftSize);
        var notes = KEY_detection.extractNotesFromChroma(chromaData);
        detectedKeys = KEY_detection.detectKey(notes);
        console.log("Tonalità trovate: ", detectedKeys);

        //troviamo il punto di taglio per la melodia
        cutPointBpm = BPM_detection.getClosestPeakToZero(groups);
        console.log("Punto di taglio: ", cutPointBpm);


        setTimeout(() => {
            loadingContainer.style.display = 'none';
            const resultContainer = document.createElement('div');
            resultContainer.id = 'resultContainer';
            resultContainer.className = 'result-container';
            //BPM
            const bpmContainer = document.createElement('div');
            bpmContainer.id = 'bpmContainer';
            bpmContainer.style.display = 'flex';
            bpmContainer.style.alignItems = 'center';
            bpmContainer.style.justifyContent = 'center';
            const bpmText = document.createElement('p');
            bpmText.id = 'bpmText';
            bpmText.textContent = `Detected Bpm: ${bpm}`;
            bpmText.style.marginRight = '10px'; // Aggiungi un po' di spazio tra il testo e il bottone
            const infoBpmBtn = document.createElement('button');
            infoBpmBtn.id = "info-bpm";
            infoBpmBtn.textContent = "i";
            infoBpmBtn.classList.add('info-btn');
            bpmContainer.appendChild(bpmText);
            bpmContainer.appendChild(infoBpmBtn);
            resultContainer.appendChild(bpmContainer);
            //KEY
            const keysContainer = document.createElement('div');
            keysContainer.id = 'keysContainer';
            keysContainer.style.display = 'flex';
            keysContainer.style.alignItems = 'center';
            keysContainer.style.justifyContent = 'center';
            const keysText = document.createElement('p');
            keysText.id = 'keysText';
            keysText.textContent = `Detected possible Keys: ${detectedKeys.join(', ')}`;
            keysText.style.marginRight = '10px'; // Aggiungi un po' di spazio tra il testo e il bottone
            const infoKeysBtn = document.createElement('button');
            infoKeysBtn.id = "info-keys";
            infoKeysBtn.textContent = "i";
            infoKeysBtn.classList.add('info-btn');
            keysContainer.appendChild(keysText);
            keysContainer.appendChild(infoKeysBtn);
            resultContainer.appendChild(keysContainer);

            const actionButton = document.createElement('button');
            actionButton.id = 'actionButton';
            actionButton.className = 'styled-button action-button';
            actionButton.textContent = 'Next';

            resultContainer.appendChild(actionButton);

            infoBpmBtn.addEventListener('click', () => {
                container.style.display = 'none';
                bpmInfoContainer.style.display = 'grid';
            });
            infoKeysBtn.addEventListener('click', () => {
                container.style.display = 'none';
                keyInfoContainer.style.display = 'grid';
            });


            actionButton.addEventListener('click', () => {
                raw_wavesurfer.stop();
                container.style.display = 'none' // Nasconde l'intero contenitore
                container2.style.display = 'flex';
                keyButtons[0].textContent = detectedKeys[0];
                keyButtons[1].textContent = detectedKeys[1];
                keyButtons.forEach(btn => btn.classList.remove('selected'));
                selectedKey = null;
            });

            container.appendChild(resultContainer);

        }, 1500);

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

backToMainBpm.addEventListener('click', () => {
    container.style.display = 'flex';
    bpmInfoContainer.style.display = 'none';
});

backToMainKey.addEventListener('click', () => {
    container.style.display = 'flex';
    keyInfoContainer.style.display = 'none';
});

backToMainOnset.addEventListener('click', () => {
    container2.style.display = 'flex';
    onsetInfoContainer.style.display = 'none';
});

infoRecordBtn.addEventListener('click', () => {
    alert("If you choose to record with BPM activated, the jam session will be based on the BPM you selected.")
});




//GESTIONE DEL CONTAINER 2
const backBtn = document.getElementById('backBtn');
const jamButton = document.getElementById('jam-button');
const genreButtons = document.querySelectorAll('.genre-btn');
const loopButtons = document.querySelectorAll('.loop-btn');
const algorithmButtons = document.querySelectorAll('.algorithm-btn');
const thresholdInput = document.getElementById('threshold');
const infoOnsetBtn = document.getElementById('info-onset');
const controls = document.querySelector('.controls');
const infoGenresBtn = document.getElementById('infoGenres');
const start_Btn = document.getElementById('start_Btn');
const stop_Btn = document.getElementById('stop_Btn');
const container3 = document.querySelector('.container3');

let loopDuration;
let loopDurationSamples;
let melodyLoopBuffer;
let drumLoopBuffer;
let bassLoopBuffer;
let threshold = 0.5;
thresholdInput.addEventListener('input', () => {
    threshold = parseFloat(thresholdInput.value);
    console.log('Threshold value:', threshold);
});

let jamMelodyBuffer;

let melodyWave = configureWaveSurfer('#melodyWaveform', 'violet', 'purple');
let drumWave = configureWaveSurfer('#drumWaveform', 'yellow', 'orange');
let bassWave = configureWaveSurfer('#bassWaveform', 'blue', 'lightblue');

let selectedKey;
let selectedGenres = [];
let selectedLoopLength;
let selectedAlgorithm;

let selectedUrls;
let drumUrlCloud;
let bassUrlCloud;



//Bottoni
backBtn.addEventListener('click', () => {
    if (melodyTonePlayer.state === 'started') {
        melodyTonePlayer.stop();
        drumTonePlayer.stop();
        bassTonePlayer.stop();
    }
    const existingLoadingContainer2 = document.getElementById('loadingContainer2');
    if (existingLoadingContainer2) {
        existingLoadingContainer2.remove();
    }
    container2.style.display = 'none';  // Nascondi il secondo contenitore
    container.style.display = 'block'; // Mostra il primo contenitore
    container3.style.display = 'none'; // Nascondi il terzo contenitore
    container.style.display = 'flex'; // Mostra il primo contenitore
    controls.style.display = 'none';

});

infoGenresBtn.addEventListener('click', () => {
    alert("An accompaniment of the selected genre will accompany your melody. If you choose two genres, your melody will be accompanied by a mix of the two genres.");
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
    });
});


algorithmButtons.forEach(button => {
    button.addEventListener('click', () => {
        algorithmButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedAlgorithm = button.textContent.split(' ')[1];
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


infoOnsetBtn.addEventListener('click', () => {
    container2.style.display = 'none';
    onsetInfoContainer.style.display = 'grid';
});


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



//  JAM BUTTON
jamButton.addEventListener('click', async () => {
    if (selectedGenres.length === 0 || !selectedLoopLength || !selectedKey || !selectedAlgorithm) {
        alert('Seleziona almeno un genere, una lunghezza del loop e una chiave.');
        return;
    }
    if (useSelectedBpm) {
        bpm = lastSelectedBpm;
    }
    console.log("bpm used for jam: ", bpm);

    const existingLoadingContainer2 = document.getElementById('loadingContainer2');
    if (existingLoadingContainer2) {
        existingLoadingContainer2.remove();
    }
    controls.style.display = 'none';

    container3.style.display = 'none';
    const loadingContainer2 = document.createElement('div');
    loadingContainer2.id = 'loadingContainer2';
    loadingContainer2.className = 'div';

    // Creazione del testo di caricamento
    const loadingText = document.createElement('p');
    loadingText.className = 'loading-text';
    loadingText.textContent = 'Generating drums and bass...';
    loadingContainer2.classList.add('animated');
    // Aggiunta del testo al contenitore di caricamento
    loadingContainer2.appendChild(loadingText);
    container2.appendChild(loadingContainer2);

    setTimeout(() => {
        container3.style.display = "flex";
        controls.style.display = 'block';
    }, 2000);


    //logica di estrazione dei dati dal database
    selectedUrls = await Utility.selectTracks(selectedGenres, selectedKey, drumTracks, bassTracks, bpm);
    drumUrlCloud = selectedUrls[0];
    bassUrlCloud = selectedUrls[1];

    switch (selectedAlgorithm) {
        case 'A':
            // Implementazione dell'algoritmo 1
            jamMelodyBuffer = melodyAudioBuffer;
            break;
        case 'B':
            // Implementazione dell'algoritmo 2
            cutPointThreshold = Utility.findTheFirstEnergyPeak(melodyAudioBuffer, threshold);
            jamMelodyBuffer = Utility.trimBuffer(melodyAudioBuffer, cutPointThreshold, audioContext);
            break;
        case 'C':
            jamMelodyBuffer = Utility.trimBuffer(melodyAudioBuffer, cutPointBpm, audioContext);
            console.log("Buffer tagliato: ", melodyAudioBuffer);
            break;
        default:
            console.error('Algoritmo non riconosciuto');
            break;
    }

    //CREAZIONE MELODIA LOOP
    melodyLoopBuffer = await Utility.createJamLoop(jamMelodyBuffer, bpm, selectedLoopLength, audioContext);
    console.log("Melody Loop creato: ", melodyLoopBuffer);
    melodyTonePlayer.buffer = melodyLoopBuffer;
    console.log("Melody Tone Player: ", melodyLoopBuffer.length);
    loopDuration = melodyLoopBuffer.duration;
    loopDurationSamples = melodyLoopBuffer.length;

    //CREAZIONE DRUM LOOP
    /*drumLoopBuffer = await Utility.createDrumLoop(audioURL, 78, bpm, audioContext, selectedLoopLength);
    drumTonePlayer.buffer = drumLoopBuffer;
    console.log("Drum Tone Player: ", drumLoopBuffer.length);*/

    drumLoopBuffer = await Utility.fetchAudioBuffer(drumUrlCloud, audioContext);
    drumLoopBuffer = await Utility.cutAudioBuffer(drumLoopBuffer, selectedLoopLength, audioContext);
    drumLoopBuffer = await Utility.timeStretchingWithoutPitchChange(drumLoopBuffer, loopDurationSamples, audioContext);
    drumTonePlayer.buffer = drumLoopBuffer;
    console.log("Drum Tone Player: ", drumLoopBuffer.length);


    //CREAZIONE BASS LOOP
    bassLoopBuffer = await Utility.fetchAudioBuffer(bassUrlCloud, audioContext);
    bassLoopBuffer = await Utility.cutAudioBuffer(bassLoopBuffer, selectedLoopLength, audioContext);
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
start_Btn.addEventListener('click', () => {
    if (loopStatus) {
        return;
    }
    startTime = audioContext.currentTime + 0.5;

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
