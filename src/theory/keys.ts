import { Chord, Key, Note } from 'tonal'
import type { NoteName } from './types'

export type Mode = 'major' | 'minor'

export interface KeyInfo {
  tonic: NoteName
  mode: Mode
  /** e.g. "bbb" or "##". Empty for C major / A minor. */
  signature: string
  accidentals: number
  /** Accidental names in signature order, e.g. ["Bb", "Eb", "Ab"]. */
  accidentalNames: NoteName[]
  scale: NoteName[]
  triads: string[]
  /** Diatonic seventh chords in scale order. */
  chords: string[]
  numerals: string[]
  /** Minor keys only: chords from harmonic minor, which supply the V7 and vii°7. */
  harmonicChords?: string[]
  harmonicNumerals?: string[]
  relative: NoteName
  relativeMode: Mode
  parallel: NoteName
}

export const MAJOR_NUMERALS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
export const MINOR_NUMERALS = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']
const HARMONIC_MINOR_NUMERALS = ['i', 'ii°', 'III+', 'iv', 'V', 'VI', 'vii°']

const FLATS = ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb']
const SHARPS = ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#']

/** Circle of fifths, clockwise from C. Index i has i sharps (or 12 - i flats). */
export const CIRCLE_MAJOR: NoteName[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F']
export const CIRCLE_MINOR: NoteName[] = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'Eb', 'Bb', 'F', 'C', 'G', 'D']
/** Enharmonic alternates shown at the bottom of the circle. */
export const CIRCLE_ALT: Partial<Record<NoteName, NoteName>> = { 'F#': 'Gb', Db: 'C#', 'G#': 'Ab', Eb: 'D#' }

export function keyInfo(tonic: NoteName, mode: Mode): KeyInfo {
  if (mode === 'major') {
    const k = Key.majorKey(tonic)
    const sig = k.keySignature
    return {
      tonic, mode, signature: sig, accidentals: sig.length,
      accidentalNames: (sig.startsWith('b') ? FLATS : SHARPS).slice(0, sig.length),
      scale: [...k.scale], triads: [...k.triads], chords: [...k.chords], numerals: MAJOR_NUMERALS,
      relative: k.minorRelative, relativeMode: 'minor', parallel: tonic,
    }
  }
  const k = Key.minorKey(tonic)
  const sig = k.keySignature
  return {
    tonic, mode, signature: sig, accidentals: sig.length,
    accidentalNames: (sig.startsWith('b') ? FLATS : SHARPS).slice(0, sig.length),
    scale: [...k.natural.scale], triads: [...k.natural.triads], chords: [...k.natural.chords], numerals: MINOR_NUMERALS,
    harmonicChords: [...k.harmonic.chords], harmonicNumerals: HARMONIC_MINOR_NUMERALS,
    relative: k.relativeMajor, relativeMode: 'major', parallel: tonic,
  }
}

export interface DiatonicHit {
  tonic: NoteName
  mode: Mode
  degree: number
  numeral: string
}

/**
 * Every key (natural major and natural minor) in which a chord is diatonic:
 * all of its pitch classes lie in the key's scale. The numeral comes from the
 * degree of the chord's root. Cm7 is vi in Eb major, ii in Bb major, iii in Ab
 * major, and i / iv / v in the corresponding minors.
 */
export function keysContaining(symbol: string): DiatonicHit[] {
  const c = Chord.get(symbol)
  if (c.empty || !c.tonic) return []
  const chromas = c.notes.map((n) => Note.get(n).chroma!)
  const rootChroma = Note.get(c.tonic).chroma!
  const hits: DiatonicHit[] = []
  const scan = (tonics: NoteName[], mode: Mode) => {
    for (const tonic of tonics) {
      const k = keyInfo(tonic, mode)
      const scaleChromas = k.scale.map((n) => Note.get(n).chroma!)
      if (!chromas.every((x) => scaleChromas.includes(x))) continue
      const degree = scaleChromas.indexOf(rootChroma)
      hits.push({ tonic, mode, degree, numeral: k.numerals[degree] })
    }
  }
  scan(CIRCLE_MAJOR, 'major')
  scan(CIRCLE_MINOR, 'minor')
  return hits
}

/** Root choices for selectors: a sensible set of spellings per pitch class. */
export const ROOT_CHOICES: NoteName[] = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']

export function isValidPitchClass(n: string): boolean {
  return Note.get(n).chroma != null
}
