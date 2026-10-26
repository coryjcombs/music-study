/**
 * Song forms for the structure view. Data only.
 * Each section lists bars in the catalog's numeral notation. `repeat` plays the
 * section that many times. Colours are by section name in the UI.
 */
export interface FormSection {
  name: string
  bars: string[]
  repeat?: number
  note?: string
}

export interface SongForm {
  id: string
  name: string
  description: string
  mode: 'major' | 'minor'
  tonic: string
  bpm: number
  sections: FormSection[]
}

export const SONG_FORMS: SongForm[] = [
  {
    id: 'blues-12',
    name: '12-bar blues',
    description: 'Three four-bar phrases: statement, restatement from IV, answer from V. The most shared form in popular music.',
    mode: 'major', tonic: 'A', bpm: 110,
    sections: [
      { name: 'Chorus', bars: ['I7', 'IV7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'], repeat: 2 },
    ],
  },
  {
    id: 'jazz-blues-12',
    name: '12-bar jazz blues',
    description: 'The same skeleton with ii–Vs, a #iv°7 passing chord and a VI7–ii–V turnaround.',
    mode: 'major', tonic: 'F', bpm: 130,
    sections: [
      { name: 'Chorus', bars: ['I7', 'IV7', 'I7', 'v7 I7', 'IV7', '#iv°7', 'I7', 'VI7', 'ii7', 'V7', 'I7 VI7', 'ii7 V7'], repeat: 2 },
    ],
  },
  {
    id: 'aaba-rhythm',
    name: 'AABA, 32 bars (rhythm changes)',
    description: 'The standard 32-bar song form: an 8-bar A played twice, an 8-bar bridge, and A again. Rhythm changes is the bebop version.',
    mode: 'major', tonic: 'Bb', bpm: 160,
    sections: [
      { name: 'A', bars: ['I vi', 'ii V7', 'I vi', 'ii V7', 'I I7', 'IV #iv°7', 'I V7', 'I'] },
      { name: 'A', bars: ['I vi', 'ii V7', 'I vi', 'ii V7', 'I I7', 'IV #iv°7', 'I V7', 'I'] },
      { name: 'B', bars: ['V7/vi', 'V7/vi', 'V7/ii', 'V7/ii', 'V7/V', 'V7/V', 'V7', 'V7'], note: 'bridge: dominants falling in fifths' },
      { name: 'A', bars: ['I vi', 'ii V7', 'I vi', 'ii V7', 'I I7', 'IV #iv°7', 'I V7', 'I'] },
    ],
  },
  {
    id: 'pop-verse-chorus',
    name: 'Verse–chorus pop',
    description: 'Verse on the darker rotation, pre-chorus building on IV and V, chorus on the bright rotation of the same four chords.',
    mode: 'major', tonic: 'G', bpm: 120,
    sections: [
      { name: 'Verse', bars: ['vi', 'IV', 'I', 'V', 'vi', 'IV', 'I', 'V'] },
      { name: 'Pre-chorus', bars: ['IV', 'V', 'IV', 'V'], note: 'half cadence: ends on V to launch the chorus' },
      { name: 'Chorus', bars: ['I', 'V', 'vi', 'IV', 'I', 'V', 'vi', 'IV'] },
      { name: 'Verse', bars: ['vi', 'IV', 'I', 'V', 'vi', 'IV', 'I', 'V'] },
      { name: 'Pre-chorus', bars: ['IV', 'V', 'IV', 'V'] },
      { name: 'Chorus', bars: ['I', 'V', 'vi', 'IV', 'I', 'V', 'vi', 'IV'] },
      { name: 'Bridge', bars: ['IV', 'iv', 'I', 'V7/vi', 'vi', 'IV', 'V', 'V'], note: 'borrowed iv and a secondary dominant for contrast' },
      { name: 'Chorus', bars: ['I', 'V', 'vi', 'IV', 'I', 'V', 'vi', 'IV'] },
    ],
  },
  {
    id: 'minor-ballad',
    name: 'Minor ballad with major chorus',
    description: 'Verse in the minor key, chorus lifting to the relative major: the same chords, re-centred.',
    mode: 'minor', tonic: 'A', bpm: 76,
    sections: [
      { name: 'Verse', bars: ['i', 'bVII', 'bVI', 'V', 'i', 'bVII', 'bVI', 'V'], note: 'Andalusian descent' },
      { name: 'Chorus', bars: ['bIII', 'bVII', 'i', 'bVI', 'bIII', 'bVII', 'i', 'V'], note: 'starts on the relative major (bIII = C in A minor)' },
      { name: 'Verse', bars: ['i', 'bVII', 'bVI', 'V', 'i', 'bVII', 'bVI', 'V'] },
      { name: 'Chorus', bars: ['bIII', 'bVII', 'i', 'bVI', 'bIII', 'bVII', 'i', 'V'] },
      { name: 'Outro', bars: ['i', 'bVI', 'i', 'I'], note: 'Picardy third at the end' },
    ],
  },
  {
    id: 'autumn-leaves',
    name: 'Autumn Leaves (32-bar AABC)',
    description: 'The standard everyone learns first: two ii–V–I pairs per phrase, major then relative minor, and a full circle-of-fifths run. Written here in G minor, as on most jazz charts.',
    mode: 'minor', tonic: 'G', bpm: 130,
    sections: [
      { name: 'A', bars: ['iv7', 'bVII7', 'bIIImaj7', 'bVImaj7', 'iiø7', 'V7', 'i7', 'i7'], note: 'ii–V–I in the relative major (Cm7 F7 Bbmaj7), then ii–V–i in the minor' },
      { name: 'A', bars: ['iv7', 'bVII7', 'bIIImaj7', 'bVImaj7', 'iiø7', 'V7', 'i7', 'i7'] },
      { name: 'B', bars: ['iiø7', 'V7', 'i7', 'i7', 'iv7', 'bVII7', 'bIIImaj7', 'bVImaj7'], note: 'the two halves of A swapped: minor first, then major' },
      { name: 'C', bars: ['iiø7', 'V7', 'i7 IV7', 'bvii7 bIII7', 'bVImaj7', 'iiø7 V7', 'i7', 'i7'], note: 'the tag: Gm7 C7 | Fm7 Bb7 | Ebmaj7 is a chain of ii–Vs through the flat side before the final ii–V–i' },
    ],
  },
  {
    id: 'blue-bossa',
    name: 'Blue Bossa (16 bars)',
    description: "Kenny Dorham's bossa in C minor: a minor ii–V–i twice, and in the middle a ii–V–I a half step up, to Db major. The modulation is the lesson.",
    mode: 'minor', tonic: 'C', bpm: 150,
    sections: [
      { name: 'A', bars: ['i7', 'i7', 'iv7', 'iv7', 'iiø7', 'V7', 'i7', 'i7'], note: 'home: i, iv, then the minor ii–V–i' },
      { name: 'B', bars: ['biii7', 'bVI7', 'bIImaj7', 'bIImaj7', 'iiø7', 'V7', 'i7', 'iiø7 V7'], note: 'Ebm7 Ab7 Dbmaj7 is a ii–V–I in Db, a half step above the tonic; then home via the minor ii–V' },
    ],
  },
]
