export { bufferToWave, writeString, writeFloat32 };


// Funzione per convertire il buffer in un file WAV
async function bufferToWave(buffer) {
  const numOfChannels = buffer.numberOfChannels;
  const length = buffer.length * numOfChannels * 2 + 44; // Calcolo della lunghezza totale
  const result = new DataView(new ArrayBuffer(length));

  // Header RIFF
  writeString(result, 0, 'RIFF');
  result.setUint32(4, length - 8, true);
  writeString(result, 8, 'WAVE');
  
  // fmt chunk
  writeString(result, 12, 'fmt ');
  result.setUint32(16, 16, true); // Sub-chunk size
  result.setUint16(20, 1, true); // Audio format (1 = PCM)
  result.setUint16(22, numOfChannels, true);
  result.setUint32(24, buffer.sampleRate, true);
  result.setUint32(28, buffer.sampleRate * numOfChannels * 2, true); // Byte rate
  result.setUint16(32, numOfChannels * 2, true); // Block align
  result.setUint16(34, 16, true); // Bits per sample

  // data chunk
  writeString(result, 36, 'data');
  result.setUint32(40, buffer.length * numOfChannels * 2, true); // Lunghezza dei dati audio

  // Scrivere i dati audio interleaved
  let offset = 44; // Punto di inizio per i dati audio
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      const sample = Math.max(-1, Math.min(1, channelData[i])); // Normalizza i campioni tra -1 e 1
      result.setInt16(offset, sample * 0x7FFF, true); // Scrive il campione (16 bit)
      offset += 2;
    }
  }

  return result.buffer; // Restituisce il buffer WAV
}

// Funzione per scrivere una stringa nel DataView
function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Funzione per scrivere un array di float32
function writeFloat32(view, offset, array) {
  for (let i = 0; i < array.length; i++) {
    view.setFloat32(offset + i * 4, array[i], true);
  }
}