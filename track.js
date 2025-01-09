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
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/funk/drum_funk_112.mp3", 112, "funk"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/funk/drum_funk_86.mp3", 86, "funk"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/funk/drum_funk_93.mp3", 93, "funk"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/funk/drum_funk_140.mp3", 140, "funk"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/funk/drum_funk_112.mp3", 112, "funk"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/jazz/drum_jazz_145.mp3", 145, "jazz"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/jazz/drum_jazz_195.mp3", 195, "jazz"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/jazz/drum_jazz_78.mp3", 78, "jazz"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/jazz/drum_jazz_90.mp3", 100, "jazz"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/latin/drum_latin_100.mp3", 100, "latin"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/latin/drum_latin_105.mp3", 105, "latin"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/latin/drum_latin_95.mp3", 95, "latin"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/latin/drum_latin_80.mp3", 80, "latin"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/latin/drum_latin_120.mp3", 120, "latin"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/latin/drum_latin_150.mp3", 150, "latin"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/pop/drum_pop_137.mp3", 137, "pop"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/pop/drum_pop_160.mp3", 160, "pop"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/pop/drum_pop_190.mp3", 190, "pop"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/pop/drum_pop_117.mp3", 117, "pop"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/pop/drum_pop_75.mp3", 75, "pop"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/rap/drum_rap_130.mp3", 130, "rap"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/rap/drum_rap_135.mp3", 135, "rap"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/rap/drum_rap_136.mp3", 136, "rap"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/rap/drum_rap_94.mp3", 94, "rap"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/rap/drum_rap_110.mp3", 110, "rap"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/rap/drum_rap_165.mp3", 165, "rap"),
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/rap/drum_rap_85.mp3", 85, "rap"),
];

export const bassTracks = [

    new BassTrack([
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass1/bass_funk_C_90.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass1/bass_funk_C%23_90.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass1/bass_funk_D_90.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass1/bass_funk_D%23_90.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass1/bass_funk_E_90.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass1/bass_funk_F_90.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass1/bass_funk_F%23_90.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass1/bass_funk_G_90.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass1/bass_funk_G%23_90.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass1/bass_funk_A_90.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass1/bass_funk_A%23_90.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass1/bass_funk_B_90.mp3"
    ], 90, "funk"),

    new BassTrack([
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass2_120/bass_funk_C_120.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass2_120/bass_funk_C%23_120.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass2_120/bass_funk_D_120.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass2_120/bass_funk_D%23_120.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass2_120/bass_funk_E_120.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass2_120/bass_funk_F_120.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass2_120/bass_funk_F%23_120.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass2_120/bass_funk_G_120.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass2_120/bass_funk_G%23_120.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass2_120/bass_funk_A_120.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass2_120/bass_funk_A%23_120.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass2_120/bass_funk_B_120.mp3"

    ], 120, "funk"),

    new BassTrack([
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass3_150/bass_funk_C_150.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass3_150/bass_funk_C%23_150.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass3_150/bass_funk_D_150.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass3_150/bass_funk_D%23_150.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass3_150/bass_funk_E_150.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass3_150/bass_funk_F_150.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass3_150/bass_funk_F%23_150.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass3_150/bass_funk_G_150.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass3_150/bass_funk_G%23_150.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass3_150/bass_funk_A_150.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass3_150/bass_funk_A%23_150.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass3_150/bass_funk_B_150.mp3"
    ], 150, "funk"),



    new BassTrack([
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass1/bass_rap_C.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass1/bass_rap_C%23.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass1/bass_rap_D.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass1/bass_rap_D%23.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass1/bass_rap_E.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass1/bass_rap_F.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass1/bass_rap_F%23.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass1/bass_rap_G.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass1/bass_rap_G%23.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass1/bass_rap_A.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass1/bass_rap_A%23.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass1/bass_rap_B.mp3"
    ], 140, "rap"),

];
