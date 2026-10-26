import { Chord, Note } from 'tonal'
import type { NoteName } from './types'

/**
 * Chord templates for voicing identification. Semitones from the root.
 * `required` tones must be present; `optional` tones may be present or omitted.
 * This is deliberately our own table rather than tonal's detector, because jazz
 * voicings routinely drop the fifth (and sometimes the root) and still have a name.
 */
export interface ChordTemplate {
  /** Suffix appended to the root, e.g. "m9". Empty string for a major triad. */
  suffix: string
  name: string
  required: number[]
  optional: number[]
}

export const CHORD_TEMPLATES: ChordTemplate[] = [
  { suffix: '5', name: 'power chord', required: [0, 7], optional: [] },
  { suffix: '', name: 'major', required: [0, 4, 7], optional: [] },
  { suffix: 'm', name: 'minor', required: [0, 3, 7], optional: [] },
  { suffix: 'dim', name: 'diminished', required: [0, 3, 6], optional: [] },
  { suffix: 'aug', name: 'augmented', required: [0, 4, 8], optional: [] },
  { suffix: 'sus2', name: 'suspended 2nd', required: [0, 2, 7], optional: [] },
  { suffix: 'sus4', name: 'suspended 4th', required: [0, 5, 7], optional: [] },
  { suffix: '6', name: 'major sixth', required: [0, 4, 9], optional: [7] },
  { suffix: 'm6', name: 'minor sixth', required: [0, 3, 9], optional: [7] },
  { suffix: 'maj7', name: 'major seventh', required: [0, 4, 11], optional: [7] },
  { suffix: '7', name: 'dominant seventh', required: [0, 4, 10], optional: [7] },
  { suffix: 'm7', name: 'minor seventh', required: [0, 3, 10], optional: [7] },
  { suffix: 'm7b5', name: 'half-diminished', required: [0, 3, 6, 10], optional: [] },
  { suffix: 'dim7', name: 'diminished seventh', required: [0, 3, 6, 9], optional: [] },
  { suffix: 'mMaj7', name: 'minor-major seventh', required: [0, 3, 11], optional: [7] },
  { suffix: '7sus4', name: 'dominant seventh sus4', required: [0, 5, 10], optional: [7] },
  { suffix: 'add9', name: 'add nine', required: [0, 4, 7, 2], optional: [] },
  { suffix: 'madd9', name: 'minor add nine', required: [0, 3, 7, 2], optional: [] },
  { suffix: '6/9', name: 'six-nine', required: [0, 4, 9, 2], optional: [7] },
  { suffix: 'm69', name: 'minor six-nine', required: [0, 3, 9, 2], optional: [7] },
  { suffix: 'maj9', name: 'major ninth', required: [0, 4, 11, 2], optional: [7] },
  { suffix: '9', name: 'dominant ninth', required: [0, 4, 10, 2], optional: [7] },
  { suffix: 'm9', name: 'minor ninth', required: [0, 3, 10, 2], optional: [7] },
  { suffix: 'mMaj9', name: 'minor-major ninth', required: [0, 3, 11, 2], optional: [7] },
  { suffix: '9sus4', name: 'dominant ninth sus4', required: [0, 5, 10, 2], optional: [7] },
  { suffix: '7b9', name: 'dominant flat nine', required: [0, 4, 10, 1], optional: [7] },
  { suffix: '7#9', name: 'dominant sharp nine', required: [0, 4, 10, 3], optional: [7] },
  { suffix: '7#11', name: 'dominant sharp eleven', required: [0, 4, 10, 6], optional: [7, 2] },
  { suffix: '7b13', name: 'dominant flat thirteen', required: [0, 4, 10, 8], optional: [2] },
  { suffix: '7#5', name: 'dominant sharp five', required: [0, 4, 8, 10], optional: [] },
  { suffix: '7b5', name: 'dominant flat five', required: [0, 4, 6, 10], optional: [] },
  { suffix: 'maj7#11', name: 'major seventh sharp eleven', required: [0, 4, 11, 6], optional: [7, 2] },
  { suffix: 'maj7#5', name: 'major seventh sharp five', required: [0, 4, 8, 11], optional: [] },
  { suffix: 'm11', name: 'minor eleventh', required: [0, 3, 10, 5], optional: [7, 2] },
  { suffix: '11', name: 'dominant eleventh', required: [0, 10, 5, 2], optional: [7, 4] },
  { suffix: '13', name: 'dominant thirteenth', required: [0, 4, 10, 9], optional: [7, 2, 5] },
  { suffix: 'maj13', name: 'major thirteenth', required: [0, 4, 11, 9], optional: [7, 2] },
  { suffix: 'm13', name: 'minor thirteenth', required: [0, 3, 10, 9], optional: [7, 2, 5] },
  { suffix: '7b9b13', name: 'dominant flat nine flat thirteen', required: [0, 4, 10, 1, 8], optional: [] },
  { suffix: '7#9b13', name: 'dominant sharp nine flat thirteen', required: [0, 4, 10, 3, 8], optional: [] },
  { suffix: '13b9', name: 'dominant thirteen flat nine', required: [0, 4, 10, 1, 9], optional: [7] },
  { suffix: '7alt', name: 'altered dominant', required: [0, 4, 10], optional: [1, 3, 6, 8] },
]

/** Spelled chord tones from a symbol, e.g. chordNotes("Cm9") -> C Eb G Bb D. */
export function chordNotes(symbol: NoteName): NoteName[] {
  const c = Chord.get(symbol)
  if (c.empty) throw new Error(`Unknown chord "${symbol}"`)
  return c.notes
}

export function chordIntervals(symbol: string): string[] {
  return Chord.get(symbol).intervals
}

/** Our template's suffix spelled as a tonal-parsable symbol for the given root. */
export function chordSymbol(root: NoteName, suffix: string): string {
  return Note.pitchClass(root) + suffix
}
