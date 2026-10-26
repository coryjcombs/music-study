import { Key, Note } from 'tonal'
import type { NoteName } from './types'

export interface KeyInfo {
  tonic: NoteName
  mode: 'major' | 'minor'
  /** e.g. "bbb" or "##". Empty for C major / A minor. */
  signature: string
  accidentals: number
  scale: NoteName[]
  /** Diatonic seventh chords in scale order. */
  chords: string[]
  numerals: string[]
  relative: NoteName
  parallel: NoteName
}

const MAJOR_NUMERALS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
const MINOR_NUMERALS = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']

/** Circle of fifths order, major keys, clockwise from C. Enharmonic pairs share a slot. */
export const CIRCLE_MAJOR: NoteName[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F']
export const CIRCLE_MINOR: NoteName[] = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'Bb', 'F', 'C', 'G', 'D']

export function keyInfo(tonic: NoteName, mode: 'major' | 'minor'): KeyInfo {
  if (mode === 'major') {
    const k = Key.majorKey(tonic)
    return {
      tonic, mode, signature: k.keySignature, accidentals: k.keySignature.length,
      scale: [...k.scale], chords: [...k.chords], numerals: MAJOR_NUMERALS,
      relative: k.minorRelative, parallel: tonic,
    }
  }
  const k = Key.minorKey(tonic)
  return {
    tonic, mode, signature: k.keySignature, accidentals: k.keySignature.length,
    scale: [...k.natural.scale], chords: [...k.natural.chords], numerals: MINOR_NUMERALS,
    relative: k.relativeMajor, parallel: tonic,
  }
}

/** Root choices for selectors: a sensible single spelling per pitch class. */
export const ROOT_CHOICES: NoteName[] = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']

export function isValidPitchClass(n: string): boolean {
  return Note.get(n).chroma != null
}
