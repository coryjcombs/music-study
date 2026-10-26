/**
 * Device library: harmonic techniques, each explained once and linked from the
 * progressions that use them. Data only. Add a device by adding an entry; the
 * progression catalog references devices by id and a test checks every reference.
 */
export interface Device {
  id: string
  name: string
  /** One line, shown in lists. */
  summary: string
  /** Paragraphs. Plain prose; keep it the way you would explain it to yourself. */
  body: string[]
  /** Practical hints for hearing or using it. */
  tips?: string[]
}

export const DEVICES: Device[] = [
  {
    id: 'diatonic-function',
    name: 'Tonic, subdominant, dominant',
    summary: 'The three jobs a diatonic chord can do: rest, move away, pull home.',
    body: [
      'Every chord in a key leans toward one of three functions. Tonic chords (I, iii, vi) feel at rest. Subdominant chords (IV, ii) move away from home and prepare the dominant. Dominant chords (V, vii°) create tension that wants to resolve to the tonic, mostly because they contain the leading tone (the 7th degree) and, in V7, the tritone between the 3rd and 7th of the chord.',
      'Most progressions are some path through tonic → subdominant → dominant → tonic. Substituting a chord with the same function (vi for I, ii for IV) keeps the path and changes the colour.',
    ],
    tips: ['Play I, IV, V7, I slowly and listen for where the tension sits. Then swap IV for ii and I for vi and notice what stays the same.'],
  },
  {
    id: 'cadence',
    name: 'Cadences',
    summary: 'Standard ways to end a phrase: authentic (V–I), plagal (IV–I), half (…–V), deceptive (V–vi).',
    body: [
      'A cadence is the punctuation of a phrase. The authentic cadence V–I is the full stop. The plagal cadence IV–I (the "Amen" ending) is softer, with no leading tone. A half cadence stops on V, a comma that asks for more. A deceptive cadence goes V–vi instead of V–I: the ear expects home and gets the relative minor, which extends the phrase.',
    ],
    tips: ['Deceptive cadences are a cheap way to make a repeated section feel like it has somewhere still to go.'],
  },
  {
    id: 'ii-v-i',
    name: 'ii–V–I',
    summary: 'The jazz unit of motion: subdominant, dominant, tonic in three chords, with roots falling in fifths.',
    body: [
      'ii–V–I compresses the whole functional cycle into three chords whose roots fall by a fifth each time (D → G → C). The voice leading is tight: the 7th of each chord falls by a half step to the 3rd of the next (C → B, F → E). That falling line is what makes it sound inevitable.',
      'In minor the same shape becomes iiø7–V7–i, usually with a b9 on the V7 to match the minor scale.',
      'Jazz standards are largely chains of ii–V–I in different keys. Recognising them is the first step to reading a chart as sentences instead of letters.',
    ],
    tips: ['Practise shells only: Dm7 (x5x56x), G7 (3x34xx), Cmaj7 (x3x45x). Watch the 7ths fall.'],
  },
  {
    id: 'circle-of-fifths-progression',
    name: 'Circle progressions',
    summary: 'Roots falling by fifths through the key: vi–ii–V–I, or the full vi–ii–V–I–IV–vii°–iii.',
    body: [
      'Because the dominant of each diatonic chord is also diatonic, you can chain fifths through the whole key: vi → ii → V → I → IV → vii° → iii → vi. Each step is a small V–I, so the motion feels constantly resolving. Fly Me to the Moon and Autumn Leaves both run most of this cycle.',
    ],
  },
  {
    id: 'secondary-dominant',
    name: 'Secondary dominants',
    summary: 'Borrow the V7 of a chord other than the tonic to point at it: V7/ii, V7/V, V7/vi.',
    body: [
      'Any major or minor chord can be preceded by its own dominant. V7/ii in C is A7, the dominant of Dm. That A7 contains C#, which is not in C major, and that one foreign note is what makes the ear lean toward Dm. Writing it as V7/ii rather than VI7 names what it is doing rather than where it sits.',
      'The most common are V7/V (D7 in C, before G7), V7/ii (A7) and V7/vi (E7). Chaining them gives the ragtime and "Charleston" progression I–V7/vi–V7/ii–V7/V–V7–I: III7–VI7–II7–V7, each dominant resolving to the next.',
    ],
    tips: ['Take any diatonic progression and insert the dominant of the next chord before it. Hear how it tightens the pull.'],
  },
  {
    id: 'tritone-substitution',
    name: 'Tritone substitution',
    summary: 'Replace a V7 with the dominant a tritone away (Db7 for G7); the two chords share the same tritone.',
    body: [
      'G7 and Db7 share their tritone: B and F are the 3rd and 7th of G7, and the 7th and 3rd (Cb) of Db7. Since the tritone carries the dominant tension, either chord resolves to C. The substitute gives a chromatic bass line, D → Db → C, instead of the leap D → G → C.',
      'The Girl from Ipanema uses one in its first phrase; bebop uses them constantly. Written subV7/I, or subV7/ii when it points at ii.',
    ],
  },
  {
    id: 'modal-interchange',
    name: 'Modal interchange (borrowed chords)',
    summary: 'Borrow a chord from the parallel key: iv, bVI, bVII, bIII, bII in major; IV or V in minor.',
    body: [
      'C major and C minor share a tonic, so chords from C minor can be dropped into C major without losing the sense of home. The borrowed chord brings its scale with it for a moment: iv (Fm) brings Ab, which gives the "minor plunge" at the end of Creep. bVII (Bb) brings the flat 7th, a bluesy or Mixolydian looseness. bVI (Ab) is dramatic and cinematic.',
      'The reverse is common too: minor-key songs borrow the major IV or the major V (the harmonic-minor dominant) from the parallel major.',
      'The usual list for a major key: ii° (rare), bIII, iv, v (rare), bVI, bVII, and bII (from Phrygian, or as a Neapolitan).',
    ],
    tips: ['Play I–IV–I, then I–IV–iv–I. The single changed note (A to Ab in C) is the whole effect.'],
  },
  {
    id: 'bVII',
    name: 'The bVII chord',
    summary: 'Flat seven in a major key: rock, folk and Mixolydian flavour, a dominant without the leading tone.',
    body: [
      'bVII is borrowed from the parallel minor or heard as the Mixolydian mode. It contains the b7 of the key instead of the leading tone, so it moves to I without the classical "pull": a looser, more open resolution. I–bVII–IV is a rock staple (Sweet Child o\' Mine verse), and bVII–I alone ends countless songs.',
      'A subtlety worth noticing: D–C–G can be heard as I–bVII–IV in D or as V–IV–I in G. Sweet Home Alabama is the famous argument. Which one you hear depends on the melody and where the phrase rests.',
    ],
  },
  {
    id: 'bVI-bVII-I',
    name: 'bVI–bVII–I (the "Mario" cadence)',
    summary: 'Two borrowed chords stepping up by whole tones into the tonic: triumphant, cinematic.',
    body: [
      'Ab–Bb–C in C major: both chords are borrowed from C minor, and the bass walks up by whole steps into the tonic. It lands with a bright, heroic snap that classical cadences do not have, which is why it closes the Super Mario level theme and shows up all over rock and film scores. Lady Madonna uses it as a turnaround.',
    ],
  },
  {
    id: 'chromatic-mediant',
    name: 'Chromatic mediants',
    summary: 'Chords a third away that share one note but not a key: I–bVI, I–bIII, i–bvi. The film-score sound.',
    body: [
      'Two chords are chromatic mediants when their roots are a third apart, they have the same quality (both major or both minor), and they share exactly one note. C major to Ab major shares C; C major to E major shares E. The shared note keeps the move smooth while the other two notes shift by a half step each, which produces a sudden change of light with no functional preparation.',
      'This is the sound of wonder, dread, or scale in film music. The Imperial March moves between G minor and Eb major, then to Eb minor (i–bVI–bvi). The device works because it refuses the usual tonic–dominant logic: nothing resolves, the ground simply shifts.',
    ],
    tips: ['Hold the shared note on one string and move the other voices. Try I–bVI–I, then I–III–I, then I–bIII–I, and notice how each colours the tonic differently.'],
  },
  {
    id: 'modes-as-colour',
    name: 'Modal vamps',
    summary: 'Two chords that define a mode by its characteristic note: Dorian i–IV, Lydian I–II, Mixolydian I–bVII.',
    body: [
      'A mode is a scale, but a mode is also a feeling, and the fastest way to establish one is a two-chord vamp that exposes its characteristic note. Dorian\'s major 6th shows up in the IV chord over a minor tonic (Am7–D9: Oye Como Va, So What). Lydian\'s #4 lives in the major II chord over a major tonic (C–D). Mixolydian\'s b7 is in bVII (D–C). Phrygian\'s b2 is in bII (Em–F).',
      'These vamps do not go anywhere, and that is the point: they hold a colour so a melody can move over it.',
    ],
  },
  {
    id: 'line-cliche',
    name: 'Line cliché',
    summary: 'Hold a chord and move one inner voice by half steps: i – i(maj7) – i7 – i6.',
    body: [
      'A line cliché is a chromatic line inside a held chord. The classic descends from the root of a minor chord: Am, Am(maj7), Am7, Am6 — the top note going A, G#, G, F#. Stairway to Heaven, Michelle and My Funny Valentine all open this way. The harmony barely changes; the line does the storytelling.',
      'The major version rises from the 5th: C, Caug, C6, C7 (G, G#, A, Bb).',
    ],
    tips: ['Find the moving line on one string and keep the rest of the chord shape still.'],
  },
  {
    id: 'backdoor',
    name: 'Backdoor progression',
    summary: 'iv–bVII7–I: approaching the tonic from the flat side instead of from V.',
    body: [
      'Fm7–Bb7–Cmaj7 in C. The bVII7 resolves up a whole step to I instead of down a fifth, so it feels like coming in through the back door. Both chords are borrowed from C minor, and the Bb7 shares two notes with the regular dominant G7 (F and, enharmonically, the Ab that G7b9 would carry). Lady Bird and many standards use it to soften the return home.',
    ],
  },
  {
    id: 'blues-harmony',
    name: 'Blues harmony',
    summary: 'Dominant 7ths on I, IV and V at once; the rules of resolution are suspended.',
    body: [
      'In the blues, I7, IV7 and V7 are all dominant-quality chords, yet none of them "resolves" in the classical sense. The b7 on the tonic chord is the sound of the blues, and the 12-bar form, with its move to IV in bar 5 and V in bar 9, is the most widely shared harmonic template in popular music. Jazz adds ii–V turnarounds and substitutions on top of it without changing the skeleton.',
    ],
  },
  {
    id: 'picardy-third',
    name: 'Picardy third',
    summary: 'End a minor piece on the major tonic.',
    body: [
      'Raising the 3rd of the final tonic chord turns a minor ending into a major one. It is an old device (Baroque composers used it routinely) and it still works as a small surprise of light at the end of something dark.',
    ],
  },
  {
    id: 'pedal-point',
    name: 'Pedal point',
    summary: 'Hold one bass note under changing chords.',
    body: [
      'A pedal is a note, usually the tonic or dominant, held in the bass while the chords above it change. The held note makes even distant chords feel tethered, and the moment the pedal releases is a strong structural event. On guitar, open-string drones (an open D under moving shapes) are the easiest way to hear it.',
    ],
  },
]

export function deviceById(id: string): Device | undefined {
  return DEVICES.find((d) => d.id === id)
}
