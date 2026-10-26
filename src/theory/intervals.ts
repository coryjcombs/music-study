import { Interval, Note } from 'tonal'
import type { NoteName } from './types'

/**
 * Interval labels relative to a root.
 * "chord" mode uses chord-function names (R, b3, 5, b7, 9, #11, 13).
 * "degree" mode uses scale-degree names (1, b3, 5, b7, 2, #4, 6).
 * Labels come from the spelled interval, so C to D# is #9 while C to Eb is b3.
 */
const CHORD_LABELS: Record<string, string> = {
  '1P': 'R', '1A': '#R',
  '2d': 'bb9', '2m': 'b9', '2M': '9', '2A': '#9',
  '3d': 'bb3', '3m': 'b3', '3M': '3', '3A': '#3',
  '4d': 'b11', '4P': '11', '4A': '#11',
  '5d': 'b5', '5P': '5', '5A': '#5',
  '6d': 'bb13', '6m': 'b13', '6M': '13', '6A': '#13',
  '7d': 'bb7', '7m': 'b7', '7M': '7', '7A': '#7',
}

const DEGREE_LABELS: Record<string, string> = {
  '1P': '1', '1A': '#1',
  '2d': 'bb2', '2m': 'b2', '2M': '2', '2A': '#2',
  '3d': 'bb3', '3m': 'b3', '3M': '3', '3A': '#3',
  '4d': 'b4', '4P': '4', '4A': '#4',
  '5d': 'b5', '5P': '5', '5A': '#5',
  '6d': 'bb6', '6m': 'b6', '6M': '6', '6A': '#6',
  '7d': 'bb7', '7m': 'b7', '7M': '7', '7A': '#7',
}

/** Fallback by semitone for exotic spellings (doubly augmented and the like). */
const SEMITONE_CHORD = ['R', 'b9', '9', 'b3', '3', '11', '#11', '5', 'b13', '13', 'b7', '7']
const SEMITONE_DEGREE = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7']

/** Simple (within-octave) spelled interval from root to note, ignoring octaves. */
export function intervalFromRoot(root: NoteName, note: NoteName): string {
  const ivl = Interval.distance(Note.pitchClass(root), Note.pitchClass(note))
  return Interval.simplify(ivl)
}

export function semitonesFromRoot(root: NoteName, note: NoteName): number {
  const r = Note.get(root).chroma!
  const n = Note.get(note).chroma!
  return (((n - r) % 12) + 12) % 12
}

export function functionLabel(
  root: NoteName,
  note: NoteName,
  mode: 'chord' | 'degree' = 'chord',
): string {
  const ivl = intervalFromRoot(root, note)
  const table = mode === 'chord' ? CHORD_LABELS : DEGREE_LABELS
  const direct = table[ivl]
  if (direct) return direct
  const semis = semitonesFromRoot(root, note)
  return (mode === 'chord' ? SEMITONE_CHORD : SEMITONE_DEGREE)[semis]
}

/** Human descriptions of chord-function labels, for tooltips and study notes. */
export const LABEL_DESCRIPTIONS: Record<string, string> = {
  R: 'root',
  b9: 'flat ninth (minor second)',
  '9': 'ninth (major second)',
  '#9': 'sharp ninth (augmented second)',
  b3: 'minor third',
  '3': 'major third',
  '11': 'eleventh (perfect fourth)',
  '#11': 'sharp eleventh (augmented fourth)',
  b5: 'flat fifth (diminished fifth)',
  '5': 'perfect fifth',
  '#5': 'sharp fifth (augmented fifth)',
  b13: 'flat thirteenth (minor sixth)',
  '13': 'thirteenth (major sixth)',
  bb7: 'diminished seventh',
  b7: 'minor seventh',
  '7': 'major seventh',
}
