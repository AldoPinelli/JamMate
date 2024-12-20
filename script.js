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
    
    analyzeBtn.addEventListener('click', async() => {
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
        bpm = BPM_detection.getBpm(melodyAudioBuffer, audioContext); 
        console.log("BPM trovato: ", bpm);

        //key detection
        const fftSize = 4096;
        const fft = new FFT(fftSize, audioContext.sampleRate);
        const chromaData = KEY_detection.chroma(melodyAudioBuffer, fft, fftSize);
        var notes = KEY_detection.extractNotesFromChroma(chromaData);
        var detectedKeys = KEY_detection.detectKey(notes);
        console.log("Tonalità trovate: ", detectedKeys);

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
            });
           
            container.appendChild(resultContainer);
            
        }, 2500);
    
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
let melodyLoopBuffer;
let loopDuration;

backBtn.addEventListener('click', () => {
    container2.style.display = 'none';  // Nascondi il secondo contenitore
    container.style.display = 'flex'; // Mostra il primo contenitore

    const resultContainer = document.querySelector('.result-container');
    const loadingContainer = document.querySelector('.div');
    if (resultContainer && loadingContainer) {
        resultContainer.remove();
        loadingContainer.remove();
    }
});

const genreButtons = document.querySelectorAll('.genre-btn');
const loopButtons = document.querySelectorAll('.loop-btn');
let selectedGenres = [];
let selectedLoopLength;

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



start_Btn = document.getElementById('start_Btn');
stop_Btn = document.getElementById('stop_Btn');
let drumLoopBuffer;
const audioURL = "https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/drum_162bpm_24.mp3";
let already_jammed = false;

let melodyTonePlayer = new Tone.Player({
    loop: true,
}).toDestination();

let drumTonePlayer = new Tone.Player({
    loop: true,
}).toDestination();

let bassTonePlayer = new Tone.Player({
    loop: true,
}).toDestination();


jamButton.addEventListener('click', async () => {
    if (already_jammed) {

    }
    if (selectedGenres.length === 0 || !selectedLoopLength) {
        alert('Seleziona almeno un genere e una lunghezza del loop.');
        return;
    }
    console.log('Generi selezionati:', selectedGenres);
    console.log('Lunghezza del loop selezionata:', selectedLoopLength);
    

    melodyLoopBuffer = await Utility.createJamLoop(melodyAudioBuffer, bpm, selectedLoopLength, audioContext);
    console.log("Loop creato: ", melodyLoopBuffer);
    melodyTonePlayer.buffer = melodyLoopBuffer;
    console.log("Melody Tone Player: ", melodyLoopBuffer.length);


    drumLoopBuffer = await Utility.createDrumLoop(audioURL,162, bpm, audioContext, selectedLoopLength);
    drumTonePlayer.buffer = drumLoopBuffer;
    console.log("Drum Tone Player: ", drumLoopBuffer.length);




    // Controllo con i pulsanti
    start_Btn.addEventListener('click', () => {
        melodyTonePlayer.start();
        drumTonePlayer.start();
    });
    stop_Btn.addEventListener('click', () => {
        melodyTonePlayer.stop();
        drumTonePlayer.stop();
    });

    
});




