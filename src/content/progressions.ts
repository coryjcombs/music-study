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
  // ---- jazz standards ----
  {
    id: 'autumn-leaves-a',
    name: 'Autumn Leaves, A section',
    bars: ['iv7', 'bVII7', 'bIIImaj7', 'bVImaj7', 'iiø7', 'V7', 'i7', 'i7'],
    mode: 'minor',
    devices: ['ii-v-i', 'circle-of-fifths-progression'],
    genres: ['jazz', 'standards'],
    feel: 'A long fall through the key: bright in the relative major, then settling into the minor.',
    why: [
      'Eight bars, every root a fifth below the last: C F Bb Eb A D G. The first four chords are ii–V–I–IV in Bb major, the relative major; the next four are iiø7–V7–i in G minor. The same seven notes serve both halves, so the shift from major to minor happens without a single foreign note until the D7 brings F#. Play the whole form on the Structure tab.',
    ],
    examples: [{ title: 'Autumn Leaves', by: 'Joseph Kosma', note: 'G minor on most charts, E minor in the original key' }],
    tonic: 'G',
    bpm: 130,
  },
  {
    id: 'blue-bossa-b',
    name: 'Blue Bossa, the half-step modulation',
    bars: ['i7', 'i7', 'biii7', 'bVI7', 'bIImaj7', 'bIImaj7', 'iiø7', 'V7'],
    mode: 'minor',
    devices: ['ii-v-i', 'modulation'],
    genres: ['jazz', 'bossa nova', 'standards'],
    feel: 'The floor moves: a ii–V–I lands a half step above home, then the minor ii–V pulls you back.',
    why: [
      'Ebm7 Ab7 Dbmaj7 is a plain ii–V–I in Db major. Heard from C minor it is biii7, bVI7, bIImaj7: a brief, complete modulation to the key a half step up. Nothing prepares it except that Ab7 is also bVI7 of C minor, a borrowed sound the ear already accepts. The return is the ordinary Dm7b5 G7.',
    ],
    examples: [{ title: 'Blue Bossa', by: 'Kenny Dorham', note: 'bars 9 to 16' }],
    tonic: 'C',
    bpm: 150,
  },
  // ---- film and game ----
  {
    id: 'aeolian-epic',
    name: 'i–bVI–bVII (Aeolian "epic" loop)',
    bars: ['i', 'bVI', 'bVII', 'i'],
    mode: 'minor',
    devices: ['diatonic-function', 'modes-as-colour'],
    genres: ['film', 'game music', 'trailer', 'rock'],
    feel: 'Solemn, vast, striding. Minor without sadness.',
    why: [
      'Natural minor with the two major chords on bVI and bVII stepping up into the tonic. There is no leading tone anywhere, so the loop feels modal and ancient rather than classical, and it can repeat under a long melody or an ostinato without resolving. It is the harmonic bed of a great deal of fantasy and trailer scoring; listen for it under chanted or drum-driven themes.',
    ],
    examples: [
      { title: 'Dragonborn (Skyrim main theme)', by: 'Jeremy Soule', note: 'listen for the minor tonic with bVI and bVII under the chant' },
      { title: 'Fantasy and trailer scores generally', by: 'various', note: 'the loop, often over a tonic pedal' },
    ],
    tonic: 'D',
    bpm: 84,
  },
  {
    id: 'exploration-pads',
    name: 'i7–bVImaj7–i7–IV (exploration pads)',
    bars: ['im7', 'bVImaj7', 'im7', 'IV'],
    mode: 'minor',
    devices: ['modes-as-colour', 'modal-interchange'],
    genres: ['game music', 'film', 'ambient'],
    feel: 'Open, drifting, unresolved; a landscape rather than a journey.',
    why: [
      'Two colours from neighbouring modes over one minor tonic. bVImaj7 is Aeolian (the b6 is in the chord); the major IV is Dorian (the natural 6 is its third). Alternating them moves one note, the 6th degree, back and forth, which is enough to make a still texture feel alive. Game exploration music leans on this because it must loop for minutes without a cadence.',
    ],
    examples: [
      { title: 'Open-world ambient cues', by: 'Jeremy Soule and others', note: 'listen for sustained maj7 and add9 pads over a minor tonic' },
      { title: 'Oye Como Va', by: 'Santana', note: 'the Dorian half, as a vamp' },
    ],
    tonic: 'E',
    bpm: 70,
  },
  {
    id: 'phrygian-vamp',
    name: 'i–bII (Phrygian vamp)',
    bars: ['i', 'bII', 'i', 'bII'],
    mode: 'minor',
    devices: ['modes-as-colour'],
    genres: ['film', 'flamenco', 'metal', 'game music'],
    feel: 'Tense, exotic, dangerous; the half step above the tonic never lets go.',
    why: [
      'Phrygian is natural minor with a flat 2nd. The bII chord puts that note on top of a major triad, so the tension sits right next to home. Flamenco lives here; so do villain cues and battle music. Stay on i and bII and the ear hears Spain or menace; add bIII and bVII and it becomes an Andalusian descent.',
    ],
    examples: [
      { title: 'Flamenco and Spanish-flavoured cues', by: 'traditional' },
      { title: 'Battle and villain themes in film and games', by: 'various', note: 'often with a low pedal and a bII stab' },
    ],
    tonic: 'E',
    bpm: 96,
  },
  {
    id: 'minor-plagal',
    name: 'i–iv–i (minor plagal)',
    bars: ['i', 'iv', 'i', 'iv'],
    mode: 'minor',
    devices: ['cadence'],
    genres: ['film', 'hymn', 'rock'],
    feel: 'Grave, resigned, heavy. The "Amen" cadence with all the light taken out.',
    why: [
      'IV–I in major is the plagal cadence. In minor both chords are minor and the 6th degree is flat, so the motion from iv to i sinks rather than lifts. Scoring uses it for grief and for anything monumental; it is also the sound of a minor-key hymn ending. Add a maj7 to the i and it turns noir.',
    ],
    examples: [
      { title: 'Funeral and lament cues', by: 'various' },
      { title: 'Hymn endings in minor', by: 'traditional' },
    ],
    tonic: 'A',
    bpm: 66,
  },
  {
    id: 'mixolydian-hero',
    name: 'I–V–bVII–IV (Mixolydian hero)',
    bars: ['I', 'V', 'bVII', 'IV'],
    mode: 'major',
    devices: ['bVII', 'modal-interchange'],
    genres: ['film', 'game music', 'rock'],
    feel: 'Big, bright, forward-leaning; triumphant without being classical.',
    why: [
      'A major tonic with the flat seventh available gives you two dominants: the real V and the Mixolydian bVII. Rock and adventure scoring alternate them for a sound that is heroic but loose. The bVII–IV pair (C–F in D) is the same move as the rock staple I–bVII–IV, and the whole loop is a close cousin of the Mario cadence.',
    ],
    examples: [
      { title: 'The Legend of Zelda overworld theme', by: 'Koji Kondo', note: 'listen for the bVII against the major tonic' },
      { title: 'Adventure and fanfare cues', by: 'various' },
    ],
    tonic: 'Bb',
    bpm: 120,
  },
  {
    id: 'mediant-wonder',
    name: 'I–bIII–bVI–I (chromatic mediant chain)',
    bars: ['I', 'bIII', 'bVI', 'I'],
    mode: 'major',
    devices: ['chromatic-mediant', 'modal-interchange'],
    genres: ['film', 'game music', 'orchestral'],
    feel: 'Doors opening one after another; wonder, discovery, scale.',
    why: [
      'Each chord is a third from its neighbour and shares one note with it: C–Eb share G, Eb–Ab share Eb, Ab–C share C. The chain can go on because major chords a third apart always share a note. Scoring uses two or three of these in a row for reveals and vistas. All three chords also happen to be borrowed from the parallel minor, which is why it still feels anchored to C.',
    ],
    examples: [
      { title: 'Reveal and vista cues', by: 'Williams, Horner, Giacchino', note: 'major chords moving by thirds under a held melody note' },
      { title: 'The Imperial March', by: 'John Williams', note: 'the minor-key relative, i–bVI–bvi' },
    ],
    tonic: 'C',
    bpm: 72,
  },
  // ---- J-pop and anime ----
  {
    id: 'royal-road',
    name: 'IV–V–iii–vi (the J-pop "royal road")',
    bars: ['IVmaj7', 'V7', 'iii7', 'vi7'],
    mode: 'major',
    devices: ['jpop-harmony', 'diatonic-function', 'cadence'],
    genres: ['j-pop', 'anime', 'pop'],
    feel: 'Yearning and bright at once; it never lands on I, so it keeps reaching.',
    why: [
      'Known in Japan as the ōdō shinkō, the royal road. It starts on IV, moves to V as if to cadence, then sidesteps to iii and vi instead of I: a deceptive cadence followed by another. The tonic never arrives, so the loop stays suspended and emotional, which suits choruses that want to soar. Every chord shares two notes with the next, so the voice leading is smooth even though the roots leap.',
      'Compare it with I–V–vi–IV, the Western pop loop: the same four chords, a different starting point and order. Starting on IV is the whole difference.',
    ],
    examples: [
      { title: 'A large share of J-pop and anime choruses', by: 'various', note: 'listen for a chorus that begins on IV and never quite lands' },
      { title: 'Pop ballads worldwide', by: 'various', note: 'the same loop appears in Western pop as IV–V–iii–vi' },
    ],
    tonic: 'C',
    bpm: 128,
  },
  {
    id: 'royal-road-dominant',
    name: 'IV–V–III7–vi (royal road with the secondary dominant)',
    bars: ['IVmaj7', 'V7', 'V7/vi', 'vi7'],
    mode: 'major',
    devices: ['jpop-harmony', 'secondary-dominant'],
    genres: ['j-pop', 'anime'],
    feel: 'The same reach, with a sharper pull into the minor chord.',
    why: [
      'Replacing iii with III7 (E7 in C) turns the third chord into the dominant of vi. The G# it adds is the leading tone of A minor, so the arrival on vi is a real cadence rather than a sidestep. J-pop writers use this constantly; it is one reason the style sounds more chromatic than Western pop built on the same four chords.',
    ],
    examples: [{ title: 'J-pop and anime choruses', by: 'various', note: 'the E7 in C major is the tell' }],
    tonic: 'C',
    bpm: 128,
  },
  {
    id: 'komuro',
    name: 'vi–IV–V–I (Komuro progression)',
    bars: ['vi', 'IV', 'V', 'I'],
    mode: 'major',
    devices: ['jpop-harmony', 'diatonic-function', 'cadence'],
    genres: ['j-pop', 'dance', 'anime'],
    feel: 'Driving and minor-leaning, resolving to a bright major at the end of every lap.',
    why: [
      'Named for producer Tetsuya Komuro, who built 1990s Japanese dance-pop on it. It is the vi–IV–I–V rotation with the last two chords swapped so that the loop ends with a real V–I cadence. Starting on vi gives the minor colour; ending on I gives the lift. The bass line A F G C is easy to play fast, which suited the tempo.',
    ],
    examples: [
      { title: '1990s J-pop and Eurobeat-influenced dance tracks', by: 'Tetsuya Komuro productions' },
      { title: 'Anime openings', by: 'various', note: 'often at high tempo with a four-on-the-floor kick' },
    ],
    tonic: 'C',
    bpm: 140,
  },
  {
    id: 'just-the-two-of-us',
    name: 'IVmaj7–III7–vi7–I7 ("Just the Two of Us" progression)',
    bars: ['IVmaj7', 'V7/vi', 'vi7', 'I7'],
    mode: 'major',
    devices: ['jpop-harmony', 'secondary-dominant', 'ii-v-i'],
    genres: ['j-pop', 'r&b', 'city pop', 'anime'],
    feel: 'Smooth, nocturnal, a little bittersweet; the city-pop and modern J-pop groove.',
    why: [
      'Four bars, two secondary dominants. IVmaj7 to III7 is a half-step bass drop into the dominant of vi; vi7 then gives way to I7, which is V7 of IV and sends the loop round again. Known in Japan as the marusa progression after the Bill Withers and Grover Washington song that popularised it, it is now the default loop of a whole generation of J-pop, Vocaloid and anime songs. The constant dominants keep it moving, but nothing is ever quite home.',
    ],
    examples: [
      { title: 'Just the Two of Us', by: 'Grover Washington Jr. with Bill Withers', note: 'the source' },
      { title: 'Modern J-pop, Vocaloid and anime songs', by: 'various', note: 'listen for the IVmaj7 III7 vi7 loop under a bright melody' },
    ],
    tonic: 'C',
    bpm: 96,
  },
  {
    id: 'anime-climb',
    name: 'ii–V–iii–vi, then IV–V–I (the lift into the chorus)',
    bars: ['ii7', 'V7', 'iii7', 'vi7', 'IV', 'V', 'I', 'I'],
    mode: 'major',
    devices: ['jpop-harmony', 'ii-v-i', 'cadence'],
    genres: ['j-pop', 'anime'],
    feel: 'Two false arrivals, then the real one: a build that pays off.',
    why: [
      'The first half is a ii–V that resolves deceptively to iii and vi; the second half is the plain IV–V–I that the first half withheld. Anime and J-pop pre-choruses are often built from exactly this delay-then-deliver shape, sometimes with a key change up a half step or whole step at the final I.',
    ],
    examples: [{ title: 'Anime opening and ending themes', by: 'various', note: 'pre-chorus into chorus' }],
    tonic: 'G',
    bpm: 132,
  },
]

export const GENRES = [...new Set(PROGRESSIONS.flatMap((p) => p.genres))].sort()
