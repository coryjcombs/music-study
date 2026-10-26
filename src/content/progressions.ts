/**
 * Progression catalog. Data only.
 *
 * Numerals follow src/theory/progressions.ts: always relative to the tonic's major
 * scale, case gives quality, explicit suffixes override, "X/Y" is secondary.
 * `bars` is one string per bar; chords within a bar are space-separated and share
 * the bar equally. Examples name songs and composers to listen to, not to copy.
 */
export interface ProgressionEntry {
  id: string
  name: string
  bars: string[]
  mode: 'major' | 'minor'
  /** Device ids from src/content/devices.ts. */
  devices: string[]
  genres: string[]
  /** How it feels, in a line. */
  feel: string
  /** Why it works, in a paragraph or two. */
  why: string[]
  examples: { title: string; by: string; note?: string }[]
  /** Suggested tonic for listening, e.g. the key an example is in. */
  tonic?: string
  bpm?: number
}

export const PROGRESSIONS: ProgressionEntry[] = [
  {
    id: 'I-IV-V',
    name: 'I–IV–V',
    bars: ['I', 'IV', 'V', 'I'],
    mode: 'major',
    devices: ['diatonic-function', 'cadence'],
    genres: ['rock', 'folk', 'country', 'blues'],
    feel: 'Plain, sturdy, open. Home, away, tension, home.',
    why: [
      'The three major chords of the key cover every scale note between them, so a melody can go anywhere. IV moves away without tension; V brings the leading tone and pulls back to I. Everything else in this catalog is a decoration of this path.',
    ],
    examples: [
      { title: 'Twist and Shout', by: 'The Beatles' },
      { title: 'La Bamba', by: 'Ritchie Valens' },
      { title: 'Wild Thing', by: 'The Troggs' },
    ],
    tonic: 'A',
  },
  {
    id: 'I-V-vi-IV',
    name: 'I–V–vi–IV',
    bars: ['I', 'V', 'vi', 'IV'],
    mode: 'major',
    devices: ['diatonic-function', 'cadence'],
    genres: ['pop', 'rock'],
    feel: 'Hopeful, cyclical, a little wistful at the vi.',
    why: [
      'Tonic, dominant, then a deceptive move to vi instead of back to I, then IV to set up the loop again. Each chord shares two notes with the next (I–V share G; V–vi share none but step smoothly; vi–IV share A and C in C major), so it rolls. The four-chord loop never fully resolves, which is why it can repeat for a whole song.',
    ],
    examples: [
      { title: 'Let It Be', by: 'The Beatles', note: 'verse' },
      { title: 'With or Without You', by: 'U2' },
      { title: 'No Woman, No Cry', by: 'Bob Marley' },
    ],
    tonic: 'C',
  },
  {
    id: 'vi-IV-I-V',
    name: 'vi–IV–I–V',
    bars: ['vi', 'IV', 'I', 'V'],
    mode: 'major',
    devices: ['diatonic-function'],
    genres: ['pop', 'rock'],
    feel: 'Same chords as I–V–vi–IV, rotated to start on the minor: darker, more urgent.',
    why: [
      'Starting on vi makes the relative minor feel like the tonic for a moment, so the loop reads as minor even though every chord is diatonic to the major key. Rotation is a general trick: the same four chords sound different depending on which one sits on the downbeat of the phrase.',
    ],
    examples: [
      { title: 'Zombie', by: 'The Cranberries' },
      { title: 'Numb', by: 'Linkin Park' },
      { title: 'Africa', by: 'Toto', note: 'chorus' },
    ],
    tonic: 'G',
  },
  {
    id: 'I-vi-IV-V',
    name: 'I–vi–IV–V (the "50s progression")',
    bars: ['I', 'vi', 'IV', 'V'],
    mode: 'major',
    devices: ['diatonic-function', 'cadence'],
    genres: ['doo-wop', 'pop', 'rock'],
    feel: 'Warm, nostalgic, gentle rocking motion.',
    why: [
      'Tonic (I), tonic substitute (vi), subdominant (IV), dominant (V): one full lap of the functional cycle with a smooth bass line (C A F G). Replace IV with ii and you get the jazz version I–vi–ii–V.',
    ],
    examples: [
      { title: 'Stand by Me', by: 'Ben E. King' },
      { title: 'Every Breath You Take', by: 'The Police' },
      { title: 'Earth Angel', by: 'The Penguins' },
    ],
    tonic: 'A',
  },
  {
    id: 'I-vi-ii-V',
    name: 'I–vi–ii–V (turnaround)',
    bars: ['Imaj7', 'vi7', 'ii7', 'V7'],
    mode: 'major',
    devices: ['diatonic-function', 'ii-v-i', 'circle-of-fifths-progression'],
    genres: ['jazz', 'standards'],
    feel: 'Smooth, rolling, always arriving back where it started.',
    why: [
      'A turnaround is a short progression that leads back to the top of a section. I–vi–ii–V does it with roots falling in fifths from vi onward (A D G C), so each chord is the dominant of the next. The A section of rhythm changes is built from two of these. Jazz players then substitute freely: III7 for vi, bIII7 for ii, bII7 for V.',
    ],
    examples: [
      { title: 'I Got Rhythm', by: 'George Gershwin', note: 'A section' },
      { title: 'Blue Moon', by: 'Rodgers and Hart' },
      { title: 'Heart and Soul', by: 'Hoagy Carmichael' },
    ],
    tonic: 'Bb',
    bpm: 120,
  },
  {
    id: 'ii-V-I',
    name: 'ii–V–I',
    bars: ['ii7', 'V7', 'Imaj7', 'Imaj7'],
    mode: 'major',
    devices: ['ii-v-i', 'diatonic-function'],
    genres: ['jazz', 'bossa nova', 'standards'],
    feel: 'Prepared, inevitable, resolved.',
    why: [
      'See the ii–V–I device. The 7th of each chord falls by a half step into the 3rd of the next: C (7th of Dm7) to B (3rd of G7), F (7th of G7) to E (3rd of Cmaj7). That is the voice leading to practise.',
    ],
    examples: [
      { title: 'Tune Up', by: 'Miles Davis', note: 'three ii–V–Is in descending keys' },
      { title: 'Satin Doll', by: 'Duke Ellington' },
      { title: 'Autumn Leaves', by: 'Joseph Kosma', note: 'major ii–V–I then minor ii–V–i' },
    ],
    tonic: 'C',
    bpm: 120,
  },
  {
    id: 'ii-V-i-minor',
    name: 'iiø7–V7–i (minor ii–V–i)',
    bars: ['iiø7', 'V7b9', 'im7', 'im7'],
    mode: 'minor',
    devices: ['ii-v-i', 'modal-interchange'],
    genres: ['jazz', 'bossa nova'],
    feel: 'Darker and more tense than the major version; the b9 adds a sting.',
    why: [
      'In natural minor the ii chord is diminished (ii°), which as a 7th chord is half-diminished (iiø7). The v chord is minor in natural minor and has no leading tone, so the V7 is borrowed from harmonic minor to get the pull. The b9 on V7 (Ab over G7 in C minor) is simply the 6th degree of the minor scale, so it belongs.',
    ],
    examples: [
      { title: 'Blue Bossa', by: 'Kenny Dorham' },
      { title: 'Autumn Leaves', by: 'Joseph Kosma', note: 'second half of each phrase' },
      { title: 'Beautiful Love', by: 'Victor Young' },
    ],
    tonic: 'C',
    bpm: 120,
  },
  {
    id: '12-bar-blues',
    name: '12-bar blues',
    bars: ['I7', 'IV7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'],
    mode: 'major',
    devices: ['blues-harmony', 'diatonic-function'],
    genres: ['blues', 'rock', 'jazz'],
    feel: 'Grounded, conversational, built for repetition.',
    why: [
      'Three four-bar phrases: statement on I, restatement starting on IV, answer starting on V. All three chords are dominant 7ths, which is the blues sound. The final V7 (bar 12) is the turnaround that sends it round again. Jazz blues keeps the skeleton and adds ii–Vs, a IV7–#iv°7 in bars 5–6, and a VI7–ii7–V7 turnaround.',
    ],
    examples: [
      { title: 'Johnny B. Goode', by: 'Chuck Berry' },
      { title: 'Hound Dog', by: 'Big Mama Thornton / Elvis Presley' },
      { title: 'Billie\'s Bounce', by: 'Charlie Parker', note: 'jazz blues' },
    ],
    tonic: 'A',
    bpm: 110,
  },
  {
    id: 'andalusian',
    name: 'i–bVII–bVI–V (Andalusian cadence)',
    bars: ['i', 'bVII', 'bVI', 'V'],
    mode: 'minor',
    devices: ['modal-interchange', 'cadence'],
    genres: ['flamenco', 'rock', 'pop'],
    feel: 'Descending, dramatic, Spanish-tinged; the major V at the bottom is the hook.',
    why: [
      'The bass walks down the minor scale: A G F E in A minor. The first three chords are natural minor; the last is the major V (borrowed from harmonic minor, or heard as the Phrygian tonic), which gives the half-step pull from F to E and back up to A. Stop on the V and it is Phrygian; resolve to i and it is minor.',
    ],
    examples: [
      { title: 'Sultans of Swing', by: 'Dire Straits', note: 'Dm C Bb A' },
      { title: 'Hit the Road Jack', by: 'Ray Charles' },
      { title: 'Runaway', by: 'Del Shannon' },
    ],
    tonic: 'D',
  },
  {
    id: 'i-bVI-bIII-bVII',
    name: 'i–bVI–bIII–bVII',
    bars: ['i', 'bVI', 'bIII', 'bVII'],
    mode: 'minor',
    devices: ['diatonic-function'],
    genres: ['rock', 'pop', 'metal'],
    feel: 'Minor but bright; the three major chords lift it without leaving the key.',
    why: [
      'Every chord is diatonic to natural minor, and three of the four are major. The relative major\'s I–IV–V (bIII, bVI, bVII) is hiding inside it, so it feels like a minor song that keeps glancing at the major. It is the minor-key cousin of I–V–vi–IV: in fact vi–IV–I–V in the relative major is the same four chords.',
    ],
    examples: [
      { title: 'Smells Like Teen Spirit', by: 'Nirvana', note: 'i–IV–bIII–bVI, same family with a Dorian IV' },
      { title: 'Zombie', by: 'The Cranberries', note: 'heard from the minor side' },
    ],
    tonic: 'E',
  },
  {
    id: 'I-bVII-IV',
    name: 'I–bVII–IV',
    bars: ['I', 'bVII', 'IV', 'I'],
    mode: 'major',
    devices: ['bVII', 'modal-interchange', 'modes-as-colour'],
    genres: ['rock', 'country rock', 'folk'],
    feel: 'Loose, open, Mixolydian swagger.',
    why: [
      'bVII replaces the dominant with a chord that has no leading tone, so the return to I is relaxed rather than pulled. The roots fall by whole step then by fourth (D C G), a bass line guitarists find under their fingers. The famous ambiguity: D–C–G is I–bVII–IV in D or V–IV–I in G; Sweet Home Alabama can be heard both ways.',
    ],
    examples: [
      { title: 'Sweet Child o\' Mine', by: 'Guns N\' Roses', note: 'verse' },
      { title: 'Sweet Home Alabama', by: 'Lynyrd Skynyrd', note: 'or V–IV–I in G' },
      { title: 'Hey Jude', by: 'The Beatles', note: 'coda: I–bVII–IV–I' },
    ],
    tonic: 'D',
  },
  {
    id: 'bVI-bVII-I',
    name: 'bVI–bVII–I (Mario cadence)',
    bars: ['I', 'bVI', 'bVII', 'I'],
    mode: 'major',
    devices: ['bVI-bVII-I', 'modal-interchange', 'cadence'],
    genres: ['rock', 'film', 'game music'],
    feel: 'Triumphant arrival, stepping up into the light.',
    why: [
      'Two chords borrowed from the parallel minor walk up by whole steps into the tonic. Neither has the leading tone, so the arrival is a bright snap rather than a classical resolution. Used as an ending, a turnaround, or a chorus launch.',
    ],
    examples: [
      { title: 'Super Mario Bros. level clear', by: 'Koji Kondo' },
      { title: 'Lady Madonna', by: 'The Beatles', note: 'F–G–A in A' },
    ],
    tonic: 'C',
  },
  {
    id: 'I-IV-iv-I',
    name: 'I–IV–iv–I (minor plunge)',
    bars: ['I', 'IV', 'iv', 'I'],
    mode: 'major',
    devices: ['modal-interchange', 'cadence'],
    genres: ['pop', 'rock', 'standards'],
    feel: 'Sunny, then a cloud passes, then home.',
    why: [
      'IV to iv changes one note, the 6th degree of the key, from major to minor (A to Ab in C). That note then falls by half step to the 5th of the tonic chord: a chromatic descent that reads as sudden sadness or tenderness. It is the single most useful borrowed chord to learn first.',
    ],
    examples: [
      { title: 'Creep', by: 'Radiohead', note: 'I–III–IV–iv' },
      { title: 'In My Life', by: 'The Beatles' },
      { title: 'Nobody Home', by: 'Pink Floyd' },
    ],
    tonic: 'G',
  },
  {
    id: 'chromatic-mediant-major',
    name: 'I–bVI–I and I–bIII–I (chromatic mediants)',
    bars: ['I', 'bVI', 'I', 'bIII'],
    mode: 'major',
    devices: ['chromatic-mediant'],
    genres: ['film', 'orchestral', 'rock'],
    feel: 'Awe, scale, a sudden change of light with nothing resolving.',
    why: [
      'C to Ab shares one note (C) and moves the other two by half steps; C to Eb shares G. There is no functional preparation and no leading tone, so the ear registers a shift of place rather than a journey. This is the vocabulary of film scoring: a theme restated a third away sounds bigger or stranger without changing a note of the melody.',
    ],
    examples: [
      { title: 'The Imperial March', by: 'John Williams', note: 'minor version: i–bVI–bvi' },
      { title: 'Film scores generally', by: 'Williams, Zimmer, Elfman', note: 'listen for major chords a third apart' },
    ],
    tonic: 'C',
    bpm: 72,
  },
  {
    id: 'i-bVI-bvi',
    name: 'i–bVI–bvi (minor chromatic mediants)',
    bars: ['i', 'bVI', 'i', 'bvi'],
    mode: 'minor',
    devices: ['chromatic-mediant', 'modal-interchange'],
    genres: ['film', 'orchestral'],
    feel: 'Menace; the second move from bVI to bvi darkens an already dark colour.',
    why: [
      'bVI is diatonic to minor and sounds grand; turning it minor (bvi) keeps the root and lowers the 3rd by a half step, which is the Imperial March move. Gm, Eb, Ebm: three chords, two shared notes each, and no cadence anywhere.',
    ],
    examples: [{ title: 'The Imperial March', by: 'John Williams' }],
    tonic: 'G',
    bpm: 72,
  },
  {
    id: 'secondary-dominants-chain',
    name: 'I–V7/vi–V7/ii–V7/V–V7 (ragtime / Charleston)',
    bars: ['I', 'V7/vi', 'V7/ii', 'V7/V', 'V7', 'I'],
    mode: 'major',
    devices: ['secondary-dominant', 'circle-of-fifths-progression'],
    genres: ['ragtime', 'jazz', 'swing'],
    feel: 'Bouncy, bright, each chord winking at the next.',
    why: [
      'A chain of dominants falling in fifths: in C, E7 A7 D7 G7 C. Each dominant resolves to the next dominant rather than to its tonic, so the whole line is one long pull toward home. Writing them as V7/vi, V7/ii, V7/V shows the logic that III7, VI7, II7 hides.',
    ],
    examples: [
      { title: 'Five Foot Two, Eyes of Blue', by: 'Ray Henderson' },
      { title: 'Charleston', by: 'James P. Johnson' },
      { title: 'Salty Dog', by: 'traditional' },
    ],
    tonic: 'C',
    bpm: 130,
  },
  {
    id: 'ii-subV-I',
    name: 'ii–subV7–I (tritone substitution)',
    bars: ['ii7', 'subV7/I', 'Imaj7', 'Imaj7'],
    mode: 'major',
    devices: ['tritone-substitution', 'ii-v-i'],
    genres: ['jazz', 'bossa nova'],
    feel: 'A ii–V–I with the bass sliding down by half steps instead of leaping.',
    why: [
      'Db7 replaces G7 because they share the tritone B/F (spelled Cb/F in Db7). The resolution is the same; the bass line becomes D Db C. Compare it with the plain ii–V–I at the same tempo.',
    ],
    examples: [
      { title: 'The Girl from Ipanema', by: 'Antônio Carlos Jobim', note: 'Gb7 in bar 4 of the A section' },
      { title: 'Bebop heads generally', by: 'Charlie Parker and others' },
    ],
    tonic: 'C',
    bpm: 120,
  },
  {
    id: 'backdoor',
    name: 'iv–bVII7–I (backdoor)',
    bars: ['Imaj7', 'iv7', 'bVII7', 'Imaj7'],
    mode: 'major',
    devices: ['backdoor', 'modal-interchange'],
    genres: ['jazz', 'standards'],
    feel: 'Coming home from the shadow side; softer than V–I.',
    why: [
      'Fm7 and Bb7 are the ii–V of Eb, the relative major of C minor. Dropping them into C major and resolving Bb7 up a step to Cmaj7 gives a cadence with no leading tone and a borrowed, bittersweet colour.',
    ],
    examples: [
      { title: 'Lady Bird', by: 'Tadd Dameron' },
      { title: 'Stella by Starlight', by: 'Victor Young', note: 'approaching the final tonic' },
    ],
    tonic: 'C',
    bpm: 120,
  },
  {
    id: 'circle-full',
    name: 'vi–ii–V–I–IV–vii°–iii–vi (full circle)',
    bars: ['vi7', 'ii7', 'V7', 'Imaj7', 'IVmaj7', 'viiø7', 'iii7', 'vi7'],
    mode: 'major',
    devices: ['circle-of-fifths-progression', 'ii-v-i'],
    genres: ['jazz', 'standards', 'baroque'],
    feel: 'Perpetual falling motion; each chord resolves into the next.',
    why: [
      'Roots descend by fifths through the whole key. The only "imperfect" fifth is IV to vii° (a tritone), which keeps the cycle inside the key. Fly Me to the Moon is this progression almost exactly; Autumn Leaves is the minor version.',
    ],
    examples: [
      { title: 'Fly Me to the Moon', by: 'Bart Howard' },
      { title: 'Autumn Leaves', by: 'Joseph Kosma', note: 'from the minor side' },
      { title: 'I Will Survive', by: 'Gloria Gaynor' },
    ],
    tonic: 'C',
    bpm: 130,
  },
  {
    id: 'pachelbel',
    name: 'I–V–vi–iii–IV–I–IV–V (Pachelbel)',
    bars: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'],
    mode: 'major',
    devices: ['diatonic-function', 'cadence'],
    genres: ['baroque', 'pop'],
    feel: 'Stately, descending, endlessly loopable.',
    why: [
      'The bass descends stepwise through the scale (D A B F# G D G A in D) while the chords alternate root position and first inversion. The descending bass is the real engine; the chords are what happens to fit over it.',
    ],
    examples: [
      { title: 'Canon in D', by: 'Johann Pachelbel' },
      { title: 'Basket Case', by: 'Green Day' },
      { title: 'Don\'t Look Back in Anger', by: 'Oasis' },
    ],
    tonic: 'D',
  },
  {
    id: 'dorian-vamp',
    name: 'i7–IV7 (Dorian vamp)',
    bars: ['i7', 'IV7', 'i7', 'IV7'],
    mode: 'minor',
    devices: ['modes-as-colour'],
    genres: ['latin', 'jazz', 'funk'],
    feel: 'Minor but cool and unbothered; the major 6th keeps it from sounding sad.',
    why: [
      'Dorian is natural minor with a raised 6th. That 6th is the 3rd of the IV chord, so a minor tonic alternating with a major IV (Am7–D9) spells the mode in two chords. It goes nowhere, which lets a soloist or melody carry the motion.',
    ],
    examples: [
      { title: 'Oye Como Va', by: 'Tito Puente / Santana' },
      { title: 'So What', by: 'Miles Davis' },
      { title: 'Eleanor Rigby', by: 'The Beatles', note: 'Em–C, Dorian flavour from the C# in the melody' },
    ],
    tonic: 'A',
    bpm: 110,
  },
  {
    id: 'lydian-vamp',
    name: 'I–II (Lydian vamp)',
    bars: ['Imaj7', 'II', 'Imaj7', 'II'],
    mode: 'major',
    devices: ['modes-as-colour'],
    genres: ['rock', 'film', 'fusion'],
    feel: 'Floating, bright, slightly unreal.',
    why: [
      'Lydian is major with a raised 4th. The major II chord contains that #4 (F# over C), which the ear hears as brightness beyond major. The vamp has no dominant and no subdominant, so it hovers.',
    ],
    examples: [
      { title: 'Flying in a Blue Dream', by: 'Joe Satriani' },
      { title: 'The Simpsons theme', by: 'Danny Elfman', note: 'melody is Lydian' },
    ],
    tonic: 'C',
    bpm: 100,
  },
  {
    id: 'line-cliche-minor',
    name: 'i – i(maj7) – i7 – i6 (line cliché)',
    bars: ['i', 'imaj7', 'i7', 'i6'],
    mode: 'minor',
    devices: ['line-cliche'],
    genres: ['pop', 'standards', 'rock'],
    feel: 'A held chord with a sinking inner line; melancholy, cinematic.',
    why: [
      'The chord is minor throughout. One voice descends chromatically from the root: A, G#, G, F#. The 7th becomes major, then minor, then a 6th. Nothing resolves because nothing really changed; the line is the story.',
    ],
    examples: [
      { title: 'Stairway to Heaven', by: 'Led Zeppelin', note: 'intro' },
      { title: 'Michelle', by: 'The Beatles' },
      { title: 'My Funny Valentine', by: 'Rodgers and Hart' },
    ],
    tonic: 'A',
    bpm: 80,
  },
  {
    id: 'deceptive',
    name: 'I–IV–V–vi (deceptive cadence)',
    bars: ['I', 'IV', 'V', 'vi'],
    mode: 'major',
    devices: ['cadence', 'diatonic-function'],
    genres: ['pop', 'classical', 'rock'],
    feel: 'Set up to land, then sidestep: the phrase keeps going.',
    why: [
      'V wants to go to I. Going to vi instead shares two notes with I (C and E in C major) so it is close enough to satisfy and different enough to surprise. It extends a phrase and is the standard way to delay a final cadence.',
    ],
    examples: [
      { title: 'Common in classical phrase endings', by: 'Mozart, Beethoven' },
      { title: 'Many pop pre-choruses', by: 'various', note: 'V–vi before the real chorus lands on I' },
    ],
    tonic: 'G',
  },
  {
    id: 'rhythm-changes-A',
    name: 'Rhythm changes, A section',
    bars: ['I vi', 'ii V7', 'I vi', 'ii V7', 'I I7', 'IV #iv°7', 'I V7', 'I'],
    mode: 'major',
    devices: ['ii-v-i', 'secondary-dominant', 'circle-of-fifths-progression', 'blues-harmony'],
    genres: ['jazz', 'bebop'],
    feel: 'Busy, cheerful, two chords a bar; the bebop workout.',
    why: [
      'Two I–vi–ii–V turnarounds, then a move to IV via the tonic\'s own dominant (I7 = V7/IV), a chromatic passing #iv°7, and a turnaround home. Hundreds of bebop tunes are written on these changes. The B section is a chain of secondary dominants: III7, VI7, II7, V7, two bars each.',
    ],
    examples: [
      { title: 'I Got Rhythm', by: 'George Gershwin' },
      { title: 'Oleo', by: 'Sonny Rollins' },
      { title: 'Anthropology', by: 'Charlie Parker' },
    ],
    tonic: 'Bb',
    bpm: 160,
  },
]

export const GENRES = [...new Set(PROGRESSIONS.flatMap((p) => p.genres))].sort()
