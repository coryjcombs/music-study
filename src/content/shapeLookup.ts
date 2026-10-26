import { Chord, Note } from 'tonal'
import { chordSymbol, transposeShape, usesOpenStrings, type Shape } from '../theory'
import { CHORD_SHAPES, type ChordShape } from './shapes'

/**
 * Find the library's first shape for a chord symbol: the "reference" shape shown on
 * hover. Matching is by interval structure, so aliases (C, CM, Cmaj) all resolve.
 * Open shapes win when the root matches; otherwise the first movable shape of that
 * quality is transposed. Library order (open, barre, shells, drop voicings) is the
 * preference order.
 */
export interface ShapeMatch {
  shape: ChordShape
  frets: Shape
  symbol: string
  root: string
}

const intervalKey = (symbol: string): string | null => {
  const c = Chord.get(symbol)
  if (c.empty) return null
  return [...c.intervals].sort().join(' ')
}

/** Interval signature per library suffix, computed once. */
const SUFFIX_KEYS = new Map<string, string>()
for (const s of CHORD_SHAPES) {
  if (!SUFFIX_KEYS.has(s.suffix)) {
    const k = intervalKey(chordSymbol('C', s.suffix))
    if (k) SUFFIX_KEYS.set(s.suffix, k)
  }
}

export function findLibraryShape(symbol: string): ShapeMatch | null {
  const c = Chord.get(symbol)
  if (c.empty || !c.tonic) return null
  const root = Note.pitchClass(c.tonic)
  const key = intervalKey(symbol)
  if (!key) return null
  const candidates = CHORD_SHAPES.filter((s) => SUFFIX_KEYS.get(s.suffix) === key)
  if (candidates.length === 0) return null
  const open = candidates.find((s) => usesOpenStrings(s.frets) && Note.get(s.root).chroma === Note.get(root).chroma)
  if (open) return { shape: open, frets: open.frets, symbol: open.symbol, root: open.root }
  const movable = candidates.find((s) => !usesOpenStrings(s.frets))
  if (!movable) return null
  return { shape: movable, frets: transposeShape(movable.frets, movable.root, root), symbol: chordSymbol(root, movable.suffix), root }
}
