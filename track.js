// tracks.js

export class Track {
    constructor(bpm, genre) {
        this.bpm = bpm;
        this.genre = genre;
    }

    // Getter per bpm
    getBpm() {
        return this.bpm;
    }

    // Getter per genre
    getGenre() {
        return this.genre;
    }
}

export class DrumTrack extends Track {
    constructor(url, bpm, genre) {
        super(bpm, genre);
        this.url = url;
    }

    // Getter per url della batteria
    getUrl() {
        return this.url;
    }
}

export class BassTrack extends Track {
    constructor(urls, bpm, genre) {
        super(bpm, genre);
        this.urls = urls;
    }

    // Getter per gli URL del basso (array di URL)
    getUrls() {
        return this.urls;
    }
}

// Creazione delle tracce direttamente nel file tracks.js
export const drumTracks = [
    //new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/drum_162bpm_24.mp3", 120, "funk"),
    //new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/drum_162bpm_24.mp3", 110, "funk"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/funk/drum_funk_112.mp3", 112, "funk"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/funk/drum_funk_86.mp3", 86, "funk"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/funk/drum_funk_93.mp3", 93, "funk"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/jazz/drum_jazz_145.mp3", 145, "jazz"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/jazz/drum_jazz_195.mp3", 195, "jazz"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/jazz/drum_jazz_78.mp3", 78, "jazz"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/latin/drum_latin_100.mp3", 100, "latin"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/latin/drum_latin_105.mp3", 105, "latin"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/latin/drum_latin_95.mp3", 95, "latin"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/pop/drum_pop_137.mp3", 137, "pop"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/pop/drum_pop_160.mp3", 160, "pop"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/pop/drum_pop_190.mp3", 190, "pop"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/rap/drum_rap_130.mp3", 130, "rap"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/rap/drum_rap_135.mp3", 135, "rap"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/rap/drum_rap_136.mp3", 136, "rap"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/rap/drum_rap_94.mp3", 94, "rap"),
];

export const bassTracks = [
    new BassTrack([
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/theChicken-Bb.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/theChicken-Bb.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/theChicken-Bb.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/theChicken-Bb.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/theChicken-Bb.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/theChicken-Bb.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/theChicken-Bb.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/theChicken-Bb.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/theChicken-Bb.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/theChicken-Bb.mp3"
    ], 120, "funk")
];
