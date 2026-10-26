import { Note, RomanNumeral } from 'tonal'
import type { NoteName } from './types'

/**
 * Roman numeral realization.
 *
 * Convention: numerals are always measured against the MAJOR scale of the tonic,
 * in both major and minor keys. So a minor-key progression is written
 * i, bVII, bVI, V (never VII or VI), and iiø7, V7, i. Case gives triad quality
 * (I major, i minor), an explicit suffix overrides it (ii7 -> m7, V7 -> 7,
 * iiø7 -> m7b5, vii°7 -> dim7, bIII+ -> aug). "X/Y" is X applied to the root of
 * Y: V7/ii is the dominant of ii; subV7/ii is its tritone substitute.
 */
export interface RealizedChord {
  numeral: string
  symbol: string
  root: NoteName
  suffix: string
  /** The target numeral for secondary chords, e.g. "ii" for "V7/ii". */
  secondaryOf?: string
}

function normalizeSuffix(raw: string, isMajorCase: boolean): string {
  const t = raw.replace('ø', 'ø').trim()
  if (t === 'ø7' || t === 'ø') return 'm7b5'
  if (t === '°7' || t === 'o7' || t === 'dim7') return 'dim7'
  if (t === '°' || t === 'o' || t === 'dim') return 'dim'
  if (t === '+' || t === 'aug') return 'aug'
  if (t === '') return isMajorCase ? '' : 'm'
  if (!isMajorCase) {
    if (t === '7') return 'm7'
    if (t === '9') return 'm9'
    if (t === '11') return 'm11'
    if (t === '6') return 'm6'
    if (t === 'maj7' || t === 'M7') return 'mMaj7'
    if (t === 'maj9') return 'mMaj9'
    if (t.startsWith('m')) return t
    return 'm' + t
  }
  if (t === 'M7') return 'maj7'
  return t
}

function parseOne(numeral: string): { interval: string; suffix: string; roman: string } {
  const rn = RomanNumeral.get(numeral)
  if (rn.empty) throw new Error(`Cannot read numeral "${numeral}"`)
  return { interval: rn.interval, suffix: normalizeSuffix(rn.chordType, rn.major), roman: rn.roman }
}

/** Root pitch class of a numeral in a key. */
export function numeralRoot(numeral: string, tonic: NoteName): NoteName {
  const { interval } = parseOne(numeral)
  return Note.transpose(Note.pitchClass(tonic), interval)
}

export function realizeNumeral(numeral: string, tonic: NoteName): RealizedChord {
  const slash = numeral.indexOf('/')
  if (slash > 0) {
    const left = numeral.slice(0, slash)
    const target = numeral.slice(slash + 1)
    const targetRoot = numeralRoot(target, tonic)
    if (left.startsWith('subV')) {
      const root = Note.transpose(targetRoot, '2m')
      const suffix = left.slice(4) || '7'
      return { numeral, symbol: root + suffix, root, suffix, secondaryOf: target }
    }
    const inner = realizeNumeral(left, targetRoot)
    return { ...inner, numeral, secondaryOf: target }
  }
  const { interval, suffix } = parseOne(numeral)
  const root = Note.transpose(Note.pitchClass(tonic), interval)
  return { numeral, symbol: root + suffix, root, suffix }
}

/** A bar is a space-separated string of numerals sharing the bar equally, e.g. "ii V". */
export function realizeBar(bar: string, tonic: NoteName): RealizedChord[] {
  return bar.trim().split(/\s+/).filter(Boolean).map((n) => realizeNumeral(n, tonic))
}

export function realizeBars(bars: string[], tonic: NoteName): RealizedChord[][] {
  return bars.map((b) => realizeBar(b, tonic))
}

/** Diatonic numerals of the natural major and natural minor sets, under our convention. */
export const DIATONIC_MAJOR = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
export const DIATONIC_MINOR = ['i', 'ii°', 'bIII', 'iv', 'v', 'bVI', 'bVII']

/** True when the numeral's root and case are in the diatonic set for the mode. */
export function isDiatonic(numeral: string, mode: 'major' | 'minor'): boolean {
  if (numeral.includes('/')) return false
  const rn = RomanNumeral.get(numeral)
  if (rn.empty) return false
  const set = mode === 'major' ? DIATONIC_MAJOR : DIATONIC_MINOR
  return set.some((d) => {
    const dr = RomanNumeral.get(d)
    return dr.interval === rn.interval && dr.major === rn.major
  })
}
