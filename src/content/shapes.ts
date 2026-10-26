import type { Shape } from '../theory/types'

/**
 * Chord shape library. Data only.
 *
 * Each entry is written for one concrete root so it can be checked by the voicing
 * analyzer (src/content/__tests__/shapes.test.ts asserts every shape identifies as
 * its declared symbol). Movable shapes (no open strings) are transposed to other
 * roots in the UI; open shapes are shown only for their native root.
 *
 * frets: low string to high string, null = muted, 0 = open.
 * tags: open, barre-e, barre-a, shell, drop2, drop3, jazz, extended, altered, triad
 */
export interface ChordShape {
  id: string
  /** Chord symbol as the analyzer should read it, e.g. "Cm9". */
  symbol: string
  root: string
  /** Suffix part of the symbol, e.g. "m9", "" for major. Matches theory/chords.ts templates. */
  suffix: string
  frets: Shape
  /** 0-based string index (low to high) carrying the root, for shape families. */
  rootString?: number
  tags: string[]
  note?: string
}

const S = (s: string): Shape => s.split(' ').map((t) => (t === 'x' ? null : Number(t)))

export const CHORD_SHAPES: ChordShape[] = [
  // ---- Open chords ----
  { id: 'open-C', symbol: 'C', root: 'C', suffix: '', frets: S('x 3 2 0 1 0'), rootString: 1, tags: ['open', 'triad'] },
  { id: 'open-A', symbol: 'A', root: 'A', suffix: '', frets: S('x 0 2 2 2 0'), rootString: 1, tags: ['open', 'triad'] },
  { id: 'open-G', symbol: 'G', root: 'G', suffix: '', frets: S('3 2 0 0 0 3'), rootString: 0, tags: ['open', 'triad'] },
  { id: 'open-E', symbol: 'E', root: 'E', suffix: '', frets: S('0 2 2 1 0 0'), rootString: 0, tags: ['open', 'triad'] },
  { id: 'open-D', symbol: 'D', root: 'D', suffix: '', frets: S('x x 0 2 3 2'), rootString: 2, tags: ['open', 'triad'] },
  { id: 'open-Am', symbol: 'Am', root: 'A', suffix: 'm', frets: S('x 0 2 2 1 0'), rootString: 1, tags: ['open', 'triad'] },
  { id: 'open-Em', symbol: 'Em', root: 'E', suffix: 'm', frets: S('0 2 2 0 0 0'), rootString: 0, tags: ['open', 'triad'] },
  { id: 'open-Dm', symbol: 'Dm', root: 'D', suffix: 'm', frets: S('x x 0 2 3 1'), rootString: 2, tags: ['open', 'triad'] },
  { id: 'open-E7', symbol: 'E7', root: 'E', suffix: '7', frets: S('0 2 0 1 0 0'), rootString: 0, tags: ['open'] },
  { id: 'open-A7', symbol: 'A7', root: 'A', suffix: '7', frets: S('x 0 2 0 2 0'), rootString: 1, tags: ['open'] },
  { id: 'open-D7', symbol: 'D7', root: 'D', suffix: '7', frets: S('x x 0 2 1 2'), rootString: 2, tags: ['open'] },
  { id: 'open-G7', symbol: 'G7', root: 'G', suffix: '7', frets: S('3 2 0 0 0 1'), rootString: 0, tags: ['open'] },
  { id: 'open-C7', symbol: 'C7', root: 'C', suffix: '7', frets: S('x 3 2 3 1 0'), rootString: 1, tags: ['open'] },
  { id: 'open-B7', symbol: 'B7', root: 'B', suffix: '7', frets: S('x 2 1 2 0 2'), rootString: 1, tags: ['open'] },
  { id: 'open-Am7', symbol: 'Am7', root: 'A', suffix: 'm7', frets: S('x 0 2 0 1 0'), rootString: 1, tags: ['open'] },
  { id: 'open-Em7', symbol: 'Em7', root: 'E', suffix: 'm7', frets: S('0 2 0 0 0 0'), rootString: 0, tags: ['open'] },
  { id: 'open-Dm7', symbol: 'Dm7', root: 'D', suffix: 'm7', frets: S('x x 0 2 1 1'), rootString: 2, tags: ['open'] },
  { id: 'open-Cmaj7', symbol: 'Cmaj7', root: 'C', suffix: 'maj7', frets: S('x 3 2 0 0 0'), rootString: 1, tags: ['open'] },
  { id: 'open-Amaj7', symbol: 'Amaj7', root: 'A', suffix: 'maj7', frets: S('x 0 2 1 2 0'), rootString: 1, tags: ['open'] },
  { id: 'open-Dmaj7', symbol: 'Dmaj7', root: 'D', suffix: 'maj7', frets: S('x x 0 2 2 2'), rootString: 2, tags: ['open'] },
  { id: 'open-Fmaj7', symbol: 'Fmaj7', root: 'F', suffix: 'maj7', frets: S('x x 3 2 1 0'), rootString: 2, tags: ['open'] },
  { id: 'open-Asus2', symbol: 'Asus2', root: 'A', suffix: 'sus2', frets: S('x 0 2 2 0 0'), rootString: 1, tags: ['open'] },
  { id: 'open-Asus4', symbol: 'Asus4', root: 'A', suffix: 'sus4', frets: S('x 0 2 2 3 0'), rootString: 1, tags: ['open'] },
  { id: 'open-Dsus2', symbol: 'Dsus2', root: 'D', suffix: 'sus2', frets: S('x x 0 2 3 0'), rootString: 2, tags: ['open'] },
  { id: 'open-Dsus4', symbol: 'Dsus4', root: 'D', suffix: 'sus4', frets: S('x x 0 2 3 3'), rootString: 2, tags: ['open'] },
  { id: 'open-Esus4', symbol: 'Esus4', root: 'E', suffix: 'sus4', frets: S('0 2 2 2 0 0'), rootString: 0, tags: ['open'] },
  { id: 'open-Cadd9', symbol: 'Cadd9', root: 'C', suffix: 'add9', frets: S('x 3 2 0 3 0'), rootString: 1, tags: ['open'] },

  // ---- Barre, E shape (root on 6th string), written at fret 8 for C ----
  { id: 'barre-e-maj', symbol: 'C', root: 'C', suffix: '', frets: S('8 10 10 9 8 8'), rootString: 0, tags: ['barre-e', 'triad'] },
  { id: 'barre-e-min', symbol: 'Cm', root: 'C', suffix: 'm', frets: S('8 10 10 8 8 8'), rootString: 0, tags: ['barre-e', 'triad'] },
  { id: 'barre-e-7', symbol: 'C7', root: 'C', suffix: '7', frets: S('8 10 8 9 8 8'), rootString: 0, tags: ['barre-e'] },
  { id: 'barre-e-m7', symbol: 'Cm7', root: 'C', suffix: 'm7', frets: S('8 10 8 8 8 8'), rootString: 0, tags: ['barre-e'] },
  { id: 'barre-e-sus4', symbol: 'Csus4', root: 'C', suffix: 'sus4', frets: S('8 10 10 10 8 8'), rootString: 0, tags: ['barre-e'] },
  { id: 'barre-e-7sus4', symbol: 'C7sus4', root: 'C', suffix: '7sus4', frets: S('8 10 8 10 8 8'), rootString: 0, tags: ['barre-e'] },

  // ---- Barre, A shape (root on 5th string), written at fret 3 for C ----
  { id: 'barre-a-maj', symbol: 'C', root: 'C', suffix: '', frets: S('x 3 5 5 5 3'), rootString: 1, tags: ['barre-a', 'triad'] },
  { id: 'barre-a-min', symbol: 'Cm', root: 'C', suffix: 'm', frets: S('x 3 5 5 4 3'), rootString: 1, tags: ['barre-a', 'triad'] },
  { id: 'barre-a-7', symbol: 'C7', root: 'C', suffix: '7', frets: S('x 3 5 3 5 3'), rootString: 1, tags: ['barre-a'] },
  { id: 'barre-a-m7', symbol: 'Cm7', root: 'C', suffix: 'm7', frets: S('x 3 5 3 4 3'), rootString: 1, tags: ['barre-a'] },
  { id: 'barre-a-maj7', symbol: 'Cmaj7', root: 'C', suffix: 'maj7', frets: S('x 3 5 4 5 3'), rootString: 1, tags: ['barre-a'] },
  { id: 'barre-a-sus2', symbol: 'Csus2', root: 'C', suffix: 'sus2', frets: S('x 3 5 5 3 3'), rootString: 1, tags: ['barre-a'] },
  { id: 'barre-a-sus4', symbol: 'Csus4', root: 'C', suffix: 'sus4', frets: S('x 3 5 5 6 3'), rootString: 1, tags: ['barre-a'] },

  // ---- Shell voicings (root, 3rd, 7th). The jazz comping backbone. ----
  { id: 'shell6-maj7', symbol: 'Cmaj7', root: 'C', suffix: 'maj7', frets: S('8 x 9 9 x x'), rootString: 0, tags: ['shell', 'jazz'], note: 'R 7 3 from the 6th string' },
  { id: 'shell6-7', symbol: 'C7', root: 'C', suffix: '7', frets: S('8 x 8 9 x x'), rootString: 0, tags: ['shell', 'jazz'], note: 'R b7 3 from the 6th string' },
  { id: 'shell6-m7', symbol: 'Cm7', root: 'C', suffix: 'm7', frets: S('8 x 8 8 x x'), rootString: 0, tags: ['shell', 'jazz'], note: 'R b7 b3 from the 6th string' },
  { id: 'shell6-m7b5', symbol: 'Cm7b5', root: 'C', suffix: 'm7b5', frets: S('8 x 8 8 7 x'), rootString: 0, tags: ['shell', 'jazz'], note: 'R b7 b3 b5: the b5 is needed to tell it from m7' },
  { id: 'shell5-maj7', symbol: 'Cmaj7', root: 'C', suffix: 'maj7', frets: S('x 3 x 4 5 x'), rootString: 1, tags: ['shell', 'jazz'], note: 'R 7 3 from the 5th string' },
  { id: 'shell5-7', symbol: 'C7', root: 'C', suffix: '7', frets: S('x 3 x 3 5 x'), rootString: 1, tags: ['shell', 'jazz'], note: 'R b7 3 from the 5th string' },
  { id: 'shell5-m7', symbol: 'Cm7', root: 'C', suffix: 'm7', frets: S('x 3 x 3 4 x'), rootString: 1, tags: ['shell', 'jazz'], note: 'R b7 b3 from the 5th string' },

  // ---- Drop 3 (root on 6th string, skip the 5th string) ----
  { id: 'drop3-maj7', symbol: 'Cmaj7', root: 'C', suffix: 'maj7', frets: S('8 x 9 9 8 x'), rootString: 0, tags: ['drop3', 'jazz'] },
  { id: 'drop3-7', symbol: 'C7', root: 'C', suffix: '7', frets: S('8 x 8 9 8 x'), rootString: 0, tags: ['drop3', 'jazz'] },
  { id: 'drop3-m7', symbol: 'Cm7', root: 'C', suffix: 'm7', frets: S('8 x 8 8 8 x'), rootString: 0, tags: ['drop3', 'jazz'] },
  { id: 'drop3-m7b5', symbol: 'Cm7b5', root: 'C', suffix: 'm7b5', frets: S('8 x 8 8 7 x'), rootString: 0, tags: ['drop3', 'jazz'] },
  { id: 'drop3-dim7', symbol: 'Cdim7', root: 'C', suffix: 'dim7', frets: S('8 x 7 8 7 x'), rootString: 0, tags: ['drop3', 'jazz'] },
  { id: 'drop3-mMaj7', symbol: 'CmMaj7', root: 'C', suffix: 'mMaj7', frets: S('8 x 9 8 8 x'), rootString: 0, tags: ['drop3', 'jazz'] },
  { id: 'drop3-6', symbol: 'C6', root: 'C', suffix: '6', frets: S('8 x 7 9 8 x'), rootString: 0, tags: ['drop3', 'jazz'] },
  { id: 'drop3-m6', symbol: 'Cm6', root: 'C', suffix: 'm6', frets: S('8 x 7 8 8 x'), rootString: 0, tags: ['drop3', 'jazz'] },

  // ---- Drop 2, top four strings, root position (root on 4th string) ----
  { id: 'drop2-maj7', symbol: 'Cmaj7', root: 'C', suffix: 'maj7', frets: S('x x 10 9 8 7'), rootString: 2, tags: ['drop2', 'jazz'] },
  { id: 'drop2-7', symbol: 'C7', root: 'C', suffix: '7', frets: S('x x 10 9 8 6'), rootString: 2, tags: ['drop2', 'jazz'] },
  { id: 'drop2-m7', symbol: 'Cm7', root: 'C', suffix: 'm7', frets: S('x x 10 8 8 6'), rootString: 2, tags: ['drop2', 'jazz'] },
  { id: 'drop2-m7b5', symbol: 'Cm7b5', root: 'C', suffix: 'm7b5', frets: S('x x 10 8 7 6'), rootString: 2, tags: ['drop2', 'jazz'] },
  { id: 'drop2-dim7', symbol: 'Cdim7', root: 'C', suffix: 'dim7', frets: S('x x 10 8 7 5'), rootString: 2, tags: ['drop2', 'jazz'] },
  { id: 'drop2-6', symbol: 'C6', root: 'C', suffix: '6', frets: S('x x 10 9 8 5'), rootString: 2, tags: ['drop2', 'jazz'] },
  { id: 'drop2-m6', symbol: 'Cm6', root: 'C', suffix: 'm6', frets: S('x x 10 8 8 5'), rootString: 2, tags: ['drop2', 'jazz'] },

  // ---- Drop 2, middle four strings, root position (root on 5th string) ----
  { id: 'drop2m-maj7', symbol: 'Cmaj7', root: 'C', suffix: 'maj7', frets: S('x 3 5 4 5 x'), rootString: 1, tags: ['drop2', 'jazz'] },
  { id: 'drop2m-7', symbol: 'C7', root: 'C', suffix: '7', frets: S('x 3 5 3 5 x'), rootString: 1, tags: ['drop2', 'jazz'] },
  { id: 'drop2m-m7', symbol: 'Cm7', root: 'C', suffix: 'm7', frets: S('x 3 5 3 4 x'), rootString: 1, tags: ['drop2', 'jazz'] },
  { id: 'drop2m-m7b5', symbol: 'Cm7b5', root: 'C', suffix: 'm7b5', frets: S('x 3 4 3 4 x'), rootString: 1, tags: ['drop2', 'jazz'] },
  { id: 'drop2m-dim7', symbol: 'Cdim7', root: 'C', suffix: 'dim7', frets: S('x 3 4 2 4 x'), rootString: 1, tags: ['drop2', 'jazz'] },

  // ---- Extended and altered (fifth usually omitted) ----
  { id: 'ext-m9-a', symbol: 'Cm9', root: 'C', suffix: 'm9', frets: S('x 3 1 3 3 x'), rootString: 1, tags: ['extended', 'jazz'], note: 'R b3 b7 9, no fifth' },
  { id: 'ext-m9-e', symbol: 'Cm9', root: 'C', suffix: 'm9', frets: S('8 10 8 8 8 10'), rootString: 0, tags: ['extended', 'jazz'], note: 'Full m9 with the fifth doubled' },
  { id: 'ext-9', symbol: 'C9', root: 'C', suffix: '9', frets: S('x 3 2 3 3 x'), rootString: 1, tags: ['extended', 'jazz'], note: 'R 3 b7 9, no fifth' },
  { id: 'ext-maj9', symbol: 'Cmaj9', root: 'C', suffix: 'maj9', frets: S('x 3 2 4 3 x'), rootString: 1, tags: ['extended', 'jazz'], note: 'R 3 7 9, no fifth' },
  { id: 'ext-13', symbol: 'C13', root: 'C', suffix: '13', frets: S('x 3 x 3 5 5'), rootString: 1, tags: ['extended', 'jazz'], note: 'R b7 3 13, no fifth' },
  { id: 'ext-69', symbol: 'C6/9', root: 'C', suffix: '6/9', frets: S('x 3 2 2 3 x'), rootString: 1, tags: ['extended', 'jazz'], note: 'R 3 6 9, no fifth' },
  { id: 'ext-m11', symbol: 'Cm11', root: 'C', suffix: 'm11', frets: S('8 x 8 8 6 x'), rootString: 0, tags: ['extended', 'jazz'], note: 'R b7 b3 11, no fifth' },
  { id: 'ext-maj7s11', symbol: 'Cmaj7#11', root: 'C', suffix: 'maj7#11', frets: S('8 x 9 9 7 x'), rootString: 0, tags: ['extended', 'jazz'], note: 'R 7 3 #11, the Lydian colour' },
  { id: 'ext-mMaj9', symbol: 'CmMaj9', root: 'C', suffix: 'mMaj9', frets: S('x 3 1 4 3 x'), rootString: 1, tags: ['extended', 'jazz'] },
  { id: 'alt-7b9', symbol: 'C7b9', root: 'C', suffix: '7b9', frets: S('x 3 2 3 2 x'), rootString: 1, tags: ['altered', 'jazz'], note: 'R 3 b7 b9' },
  { id: 'alt-7s9', symbol: 'C7#9', root: 'C', suffix: '7#9', frets: S('x 3 2 3 4 x'), rootString: 1, tags: ['altered', 'jazz'], note: 'R 3 b7 #9, the "Hendrix" chord' },
  { id: 'alt-7s5', symbol: 'C7#5', root: 'C', suffix: '7#5', frets: S('x 3 x 3 5 4'), rootString: 1, tags: ['altered', 'jazz'], note: 'R b7 3 #5' },
  { id: 'alt-7s5-e', symbol: 'C7#5', root: 'C', suffix: '7#5', frets: S('8 x 8 9 9 x'), rootString: 0, tags: ['altered', 'jazz'], note: 'R b7 3 #5, also read as 7b13' },
  { id: 'alt-7b9b13', symbol: 'C7b9b13', root: 'C', suffix: '7b9b13', frets: S('8 x 8 9 9 9'), rootString: 0, tags: ['altered', 'jazz'] },
  { id: 'alt-13b9', symbol: 'C13b9', root: 'C', suffix: '13b9', frets: S('x 3 2 3 2 5'), rootString: 1, tags: ['altered', 'jazz'] },
]

export const SHAPE_TAGS: { id: string; name: string }[] = [
  { id: 'open', name: 'Open' },
  { id: 'triad', name: 'Triads' },
  { id: 'barre-e', name: 'Barre, E shape' },
  { id: 'barre-a', name: 'Barre, A shape' },
  { id: 'shell', name: 'Shells' },
  { id: 'drop2', name: 'Drop 2' },
  { id: 'drop3', name: 'Drop 3' },
  { id: 'extended', name: 'Extended' },
  { id: 'altered', name: 'Altered' },
  { id: 'jazz', name: 'Jazz' },
]
