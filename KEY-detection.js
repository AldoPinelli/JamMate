export function chroma(audioBuffer, fft, fftSize) {
  const sampleRate = audioBuffer.sampleRate;
  const channelData = audioBuffer.getChannelData(0); 
  const chromaData = [];
  const hopSize = fftSize / 2;

  for (let i = 0; i < channelData.length; i += hopSize) { 
    let segment = channelData.slice(i, i + fftSize); 
    if (segment.length < fftSize) {
        // Se il segmento è più piccolo di fftSize, riempio con zeri
        const paddedSegment = new Float32Array(fftSize);
        paddedSegment.set(segment);
        segment = paddedSegment;
      }
    fft.forward(segment); // Calcola la FFT del segmento
    const spectrum = fft.spectrum; // Ottieni lo spettro di magnitudine
    const chromaVector = calculateChromaVector(spectrum, sampleRate);
    chromaData.push(chromaVector); 
  }

  return chromaData;
}

export function calculateChromaVector(spectrum, sampleRate) {
  const chromaVector = new Array(12).fill(0);
  const binSize = sampleRate / spectrum.length; 

  for (let i = 0; i < spectrum.length / 2; i++) {
    const frequency = i * binSize;
    const magnitude = spectrum[i];
    const pitchClass = (Math.round(12 * Math.log2(frequency / 440)) + 12 + 9) % 12; // Math.log2 calcola la distanza dal LA in ottave; *12 ritorna distanza in semitoni
    chromaVector[pitchClass] += magnitude;
  }
  return chromaVector;
}

export function extractNotesFromChroma(chromaData) {
  const notes = [];
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  chromaData.forEach((chromaVector) => {
    const maxIndex = chromaVector.indexOf(Math.max(...chromaVector)); // Trova l'indice del massimo valore nel vettore cromatico
    notes.push(noteNames[maxIndex]); // Aggiungi il nome della nota corrispondente all'indice
  });

  return notes;
}

export function calculateDotProduct(noteCounts, profile) {
  let dotProduct = 0;
  for (let i = 0; i < 12; i++) {
    dotProduct += noteCounts[i] * profile[i];
  }
  return dotProduct;
}

function rotateArrayRight(arr, positions) {
  return arr.slice(-positions).concat(arr.slice(0, -positions));
}

export function detectKey(notes) {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const majorProfile = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]; //profili tonali risultanti da esperimenti 
  const minorProfile = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

  // Conta le occorrenze delle note
  const noteCounts = new Array(12).fill(0);
  notes.forEach(note => {
    const index = noteNames.indexOf(note);
    if (index !== -1) {
      noteCounts[index]++;
    }
  });


  // Trova la tonalità maggiore e minore con la migliore corrispondenza
  let bestMajorKey = null;
  let bestMinorKey = null;
  let bestMajorCorrelation = -Infinity;
  let bestMinorCorrelation = -Infinity;

  for (let i = 0; i < 12; i++) {
    const rotatedMajorProfile = rotateArrayRight(majorProfile, i);
    const rotatedMinorProfile = rotateArrayRight(minorProfile, i); 

    const majorCorrelation = calculateDotProduct(noteCounts, rotatedMajorProfile);
    const minorCorrelation = calculateDotProduct(noteCounts, rotatedMinorProfile);

    if (majorCorrelation > bestMajorCorrelation) {
      bestMajorCorrelation = majorCorrelation;
      bestMajorKey = noteNames[i] + ' Major';
    }

    if (minorCorrelation > bestMinorCorrelation) {
      bestMinorCorrelation = minorCorrelation;
      bestMinorKey = noteNames[i] + ' Minor';
    }
  }

   var detectedKeys = [];
   detectedKeys.push(bestMajorKey, bestMinorKey);
  return detectedKeys;
}

