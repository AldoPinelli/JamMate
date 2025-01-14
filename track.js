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
    new DrumTrack("https://storage.googleapis.com/audio-actam-bucket/Drum-Folder/rap/drum_rap_120.mp3", 120, "rap"),
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
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass_89/bass_funk_C_89.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass_89/bass_funk_C%23_89.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass_89/bass_funk_D_89.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass_89/bass_funk_D%23_89.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass_89/bass_funk_E_89.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass_89/bass_funk_F_89.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass_89/bass_funk_F%23_89.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass_89/bass_funk_G_89.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass_89/bass_funk_G%23_89.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass_89/bass_funk_A_89.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass_89/bass_funk_A%23_89.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/funk/bass_89/bass_funk_B_89.mp3"
    ], 89, "funk"),



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

    new BassTrack([
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass100/bass_rap_C_100.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass100/bass_rap_C%23_100.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass100/bass_rap_D_100.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass100/bass_rap_D%23_100.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass100/bass_rap_E_100.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass100/bass_rap_F_100.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass100/bass_rap_F%23_100.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass100/bass_rap_G_100.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass100/bass_rap_G%23_100.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass100/bass_rap_A_100.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass100/bass_rap_A%23_100.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass100/bass_rap_B_100.mp3",
    ], 100, "rap"),

    new BassTrack([
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass160/bass_rap_C_160.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass160/bass_rap_C%23_160.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass160/bass_rap_D_160.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass160/bass_rap_D%23_160.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass160/bass_rap_E_160.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass160/bass_rap_F_160.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass160/bass_rap_F%23_160.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass160/bass_rap_G_160.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass160/bass_rap_G%23_160.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass160/bass_rap_A_160.mp3", 
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass160/bass_rap_A%23_160.mp3",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/rap/bass160/bass_rap_B_160.mp3"
    ], 160, "rap"),

    new BassTrack([
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_90/jazz_90_C_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_90/jazz_90_C%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_90/jazz_90_D_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_90/jazz_90_D%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_90/jazz_90_E_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_90/jazz_90_F_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_90/jazz_90_F%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_90/jazz_90_G_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_90/jazz_90_G%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_90/jazz_90_A_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_90/jazz_90_A%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_90/jazz_90_B_1.wav"
    ], 90, "jazz"),

    new BassTrack([
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_110/jazz_110_C_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_110/jazz_110_C%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_110/jazz_110_D_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_110/jazz_110_D%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_110/jazz_110_E_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_110/jazz_110_F_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_110/jazz_110_F%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_110/jazz_110_G_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_110/jazz_110_G%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_110/jazz_110_A_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_110/jazz_110_A%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_110/jazz_110_B_1.wav"
    ], 110, "jazz"),

    new BassTrack([
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_130/jazz_130_C_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_130/jazz_130_C%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_130/jazz_130_D_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_130/jazz_130_D%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_130/jazz_130_E_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_130/jazz_130_F_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_130/jazz_130_F%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_130/jazz_130_G_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_130/jazz_130_G%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_130/jazz_130_A_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_130/jazz_130_A%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_130/jazz_130_B_1.wav"                           
    ], 130, "jazz"),

    new BassTrack([
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_150/jazz_150_C_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_150/jazz_150_C%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_150/jazz_150_D_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_150/jazz_150_D%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_150/jazz_150_E_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_150/jazz_150_F_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_150/jazz_150_F%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_150/jazz_150_G_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_150/jazz_150_G%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_150/jazz_150_A_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_150/jazz_150_A%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/jazz/bass_150/jazz_150_B_1.wav"
    ], 150, "jazz"),

    new BassTrack([
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_90/latin_90_C_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_90/latin_90_C%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_90/latin_90_D_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_90/latin_90_D%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_90/latin_90_E_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_90/latin_90_F_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_90/latin_90_F%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_90/latin_90_G_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_90/latin_90_G%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_90/latin_90_A_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_90/latin_90_A%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_90/latin_90_B_1.wav"
    ], 90, "latin"),

    new BassTrack([
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_110/latin_110_C_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_110/latin_110_C%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_110/latin_110_D_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_110/latin_110_D%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_110/latin_110_E_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_110/latin_110_F_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_110/latin_110_F%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_110/latin_110_G_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_110/latin_110_G%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_110/latin_110_A_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_110/latin_110_A%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_110/latin_110_B_1.wav"
    ], 110, "latin"),

    new BassTrack([
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_130/latin_130_C_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_130/latin_130_C%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_130/latin_130_D_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_130/latin_130_D%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_130/latin_130_E_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_130/latin_130_F_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_130/latin_130_F%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_130/latin_130_G_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_130/latin_130_G%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_130/latin_130_A_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_130/latin_130_A%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_130/latin_130_B_1.wav"
    ], 130, "latin"),

    new BassTrack([
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_150/latin_150_C_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_150/latin_150_C%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_150/latin_150_D_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_150/latin_150_D%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_150/latin_150_E_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_150/latin_150_F_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_150/latin_150_F%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_150/latin_150_G_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_150/latin_150_G%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_150/latin_150_A_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_150/latin_150_A%23_1.wav",
        "https://storage.googleapis.com/audio-actam-bucket/Bass-Folder/latin/bass_150/latin_150_B_1.wav"
    ], 150, "latin")
];


export const availableMelodies = [
    "https://storage.googleapis.com/audio-actam-bucket/availableMelodies/piano_121_Am.mp3",
    "https://storage.googleapis.com/audio-actam-bucket/availableMelodies/trap_130_Em.mp3"
]