
export function getPeaks(data) {
  var partSize = 22050; // 0.5 secondi
  var parts = data[0].length / partSize;
  var peaks = [];

  for (var i = 0; i < parts; i++) {
    var max = 0;
    for (var j = i * partSize; j < (i + 1) * partSize; j++) { //confronto tutti i sample di una parte
      var volume = Math.max(Math.abs(data[0][j]), Math.abs(data[1][j])); // prendo il massimo tra il canale sinistro e destro
      if (!max || (volume > max.volume)) { //!max per la prima iterazione (il primo sample sara impostato come quello massimo)
        max = {
          position: j, //si da un numero a ogni sample 
          volume: volume
        };
      }
    }
    peaks.push(max); //aggiungo il picco massimo di una parte
  }

  peaks.sort(function (a, b) {
    return b.volume - a.volume; //ordino i picchi in ordine decrescente
  });

  peaks = peaks.splice(0, peaks.length * 0.5); //prendo solo la prima meta dei picchi (quelli piu alti)
  peaks.sort(function (a, b) {
    return a.position - b.position;
  });

  return peaks; //picchi piu alti ordinati per posizione
}

export function getIntervals(peaks) { //calcolo la distanza tra i picchi
  var groups = [];

  peaks.forEach(function (peak, index) {
    for (var i = 1; (index + i) < peaks.length && i < 10; i++) { //confronto un picco con i 10 successivi
      var group = {
        tempo: (60 * 44100) / (peaks[index + i].position - peak.position), //battiti che ci sono in un secondo * 60
        count: 1,
        occurrences: [peak.position, peaks[index + i].position]
      };

      while (group.tempo < 70) { //normalizzazione
        group.tempo *= 2;
      }

      while (group.tempo > 180) { //normalizzazione
        group.tempo /= 2;
      }

      group.tempo = Math.round(group.tempo); //arrotondo all intero piu vicino

      let found = false;

      for (let j = 0; j < groups.length; j++) {
        if (groups[j].tempo === group.tempo) {
          groups[j].count++;
          groups[j].occurrences.push(peak.position, peaks[index + i].position);
          found = true;
          break; // Interrompe l'iterazione appena trova una corrispondenza
        }
      }

      if (!found) {
        groups.push(group); // Aggiunge il gruppo se non è stato trovato
      }
    }
  });
  return groups;

}
  


export function getBpm(buffer) {
  const peaks = getPeaks([buffer.getChannelData(0), buffer.getChannelData(1)]);
  const groups = getIntervals(peaks);

  var top = groups.sort(function (intA, intB) {
    return intB.count - intA.count;
  }).splice(0, 5); //prendo i primi 5 gruppi con tempo piu frequente e li metto in array top

  return Math.round(top[0].tempo);
}


export function getClosestPeakToZero(groups) {
  if (!groups || groups.length === 0) {
    alert("No groups provided.");
    return -1;
  }

  // Trova il gruppo con il BPM più ricorrente
  const mostFrequentGroup = groups.reduce((prev, curr) =>
    (curr.count > prev.count ? curr : prev), groups[0]
  );

  // Trova il picco più vicino allo zero nel gruppo selezionato
  const closestPeak = mostFrequentGroup.occurrences.reduce((prev, curr) =>
    (Math.abs(curr) < Math.abs(prev) ? curr : prev)
  );

  return closestPeak; // Restituisce la posizione del picco più vicino allo zero
}