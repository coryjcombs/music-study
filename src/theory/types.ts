/** Shared theory types. Notes are spelled names like "Eb" or "F#4"; midi is an integer. */

export type NoteName = string
export type Midi = number

export type LabelMode = 'names' | 'chord' | 'degree'

export interface Tuning {
  id: string
  name: string
  /** Open-string notes from lowest (6th) to highest (1st), with octave, e.g. "E2". */
  strings: NoteName[]
}

/** A position on the fretboard. string is 0 = lowest (6th) string. */
export interface Position {
  string: number
  fret: number
}

export interface LabeledPosition extends Position {
  midi: Midi
  /** Spelled pitch class in context, e.g. "Eb". */
  name: NoteName
  /** Interval label relative to the current root, or null when no root is set. */
  label: string | null
  /** True when the note belongs to the active overlay (scale or chord). */
  inSet: boolean
  isRoot: boolean
}

/** Frets per string, low to high. null = muted, 0 = open. */
export type Shape = (number | null)[]
