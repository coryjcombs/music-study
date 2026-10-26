import { Chord, Interval, Note, RomanNumeral } from 'tonal'
import { chordNotes } from './chords'
import { CIRCLE_MAJOR, CIRCLE_MINOR, keyInfo, type Mode } from './keys'
import type { NoteName } from './types'

/**
 * Analysis of chord symbols against a key: the reverse of progressions.ts.
 * Given "C G Am F" and a key, produce numerals, mark what is diatonic, and
 * name the device a non-diatonic chord is most likely performing.
 */

export interface ParsedChord {
  symbol: string
  root: NoteName
  /** tonal's alias, e.g. "m7", "maj7", "" for major. */
  suffix: string
  quality: 'major' | 'minor' | 'diminished' | 'augmented' | 'other'
  isDominant7: boolean
  notes: NoteName[]
}

export function parseChord(symbol: string): ParsedChord | null {
  const c = Chord.get(symbol.trim())
  if (c.empty || !c.tonic) return null
  const alias = c.aliases[0] ?? ''
  const quality =
    c.quality === 'Major' ? 'major' : c.quality === 'Minor' ? 'minor' :
    c.quality === 'Diminished' ? 'diminished' : c.quality === 'Augmented' ? 'augmented' : 'other'
  const isDominant7 = quality === 'major' && c.intervals.includes('7m')
  return { symbol: c.symbol, root: c.tonic, suffix: alias, quality, isDominant7, notes: c.notes }
}

/** Suffix as written in a numeral: Dm7 -> "7" under lowercase ii, Cmaj7 -> "maj7". */
function numeralSuffix(p: ParsedChord): string {
  const s = p.suffix
  if (p.quality === 'minor') {
    if (s === 'm') return ''
    if (s === 'm7') return '7'
    if (s === 'm9') return '9'
    if (s === 'm6') return '6'
    if (s === 'm/ma7') return 'maj7'
    return s.replace(/^m/, '')
  }
  if (p.quality === 'diminished') {
    if (s === 'dim') return '°'
    if (s === 'dim7') return '°7'
    if (s === 'm7b5') return 'ø7'
    return s
  }
  if (p.quality === 'augmented') return s === 'aug' ? '+' : s
  if (s === 'M') return ''
  if (s === 'Madd9') return 'add9'
  return s
}

/** Roman numeral for a chord in a key, under the catalog convention (major-scale reference). */
export function chordToNumeral(symbol: string, tonic: NoteName): string | null {
  const p = parseChord(symbol)
  if (!p) return null
  const ivl = Interval.simplify(Interval.distance(Note.pitchClass(tonic), p.root))
  let roman = RomanNumeral.get(Interval.get(ivl)).name
  if (!roman) return null
  // Prefer flat spellings for the dark side (bVII over #VI) when the chord is major, matching usage.
  if (roman.startsWith('#') && p.quality !== 'diminished') {
    const alt = RomanNumeral.get(Interval.get(Interval.simplify(Interval.distance(Note.pitchClass(tonic), Note.enharmonic(p.root))))).name
    if (alt && alt.startsWith('b')) roman = alt
  }
  const lower = p.quality === 'minor' || p.quality === 'diminished'
  const acc = roman.match(/^[#b]*/)![0]
  const letters = roman.slice(acc.length)
  const body = acc + (lower ? letters.toLowerCase() : letters.toUpperCase())
  return body + numeralSuffix(p)
}

export interface KeyGuess {
  tonic: NoteName
  mode: Mode
  score: number
  diatonic: number
  total: number
}

/** Rank keys by how many of the chords are diatonic, with bonuses for tonic at the ends and a V. */
export function suggestKeys(symbols: string[]): KeyGuess[] {
  const parsed = symbols.map(parseChord).filter((p): p is ParsedChord => p != null)
  if (parsed.length === 0) return []
  const guesses: KeyGuess[] = []
  const scan = (tonics: NoteName[], mode: Mode) => {
    for (const tonic of tonics) {
      const k = keyInfo(tonic, mode)
      const scaleChromas = new Set(k.scale.map((n) => Note.get(n).chroma!))
      const tonicChroma = Note.get(tonic).chroma!
      let diatonic = 0
      let score = 0
      parsed.forEach((p, i) => {
        const chromas = p.notes.map((n) => Note.get(n).chroma!)
        const inKey = chromas.every((c) => scaleChromas.has(c))
        // In minor, allow the harmonic-minor V and vii° as diatonic.
        const harmonicV = mode === 'minor' && p.isDominant7 !== undefined && p.quality === 'major' && Note.get(p.root).chroma === (tonicChroma + 7) % 12
        if (inKey || harmonicV) {
          diatonic++
          score += 2
        }
        const isTonic = Note.get(p.root).chroma === tonicChroma && (mode === 'major' ? p.quality === 'major' : p.quality === 'minor')
        if (isTonic) {
          score += 1
          if (i === 0) score += 2
          if (i === parsed.length - 1) score += 2
        }
        if ((inKey || harmonicV) && Note.get(p.root).chroma === (tonicChroma + 7) % 12 && p.quality === 'major') score += 1
      })
      guesses.push({ tonic, mode, score, diatonic, total: parsed.length })
    }
  }
  scan(CIRCLE_MAJOR, 'major')
  scan(CIRCLE_MINOR, 'minor')
  return guesses.sort((a, b) => b.score - a.score || b.diatonic - a.diatonic).slice(0, 6)
}

export interface ChordAnalysis {
  symbol: string
  numeral: string | null
  diatonic: boolean
  /** Device label for a non-diatonic chord, e.g. "secondary dominant (V7/ii)". */
  device?: string
  /** Device id from the content library, when one applies. */
  deviceId?: string
}

/** Analyze a sequence of chord symbols in a key. `next` chords drive secondary-dominant detection. */
export function analyzeProgression(symbols: string[], tonic: NoteName, mode: Mode): ChordAnalysis[] {
  const k = keyInfo(tonic, mode)
  const scaleChromas = new Set(k.scale.map((n) => Note.get(n).chroma!))
  const tonicChroma = Note.get(tonic).chroma!
  const parallel = keyInfo(tonic, mode === 'major' ? 'minor' : 'major')
  const parallelChromas = new Set(parallel.scale.map((n) => Note.get(n).chroma!))
  const parsed = symbols.map(parseChord)

  return parsed.map((p, i) => {
    if (!p) return { symbol: symbols[i], numeral: null, diatonic: false, device: 'unreadable chord symbol' }
    const numeral = chordToNumeral(p.symbol, tonic)
    const chromas = p.notes.map((n) => Note.get(n).chroma!)
    const rootChroma = Note.get(p.root).chroma!
    const inKey = chromas.every((c) => scaleChromas.has(c))
    const isHarmonicV = mode === 'minor' && p.quality === 'major' && rootChroma === (tonicChroma + 7) % 12
    if (inKey || isHarmonicV) {
      return { symbol: p.symbol, numeral, diatonic: true, device: isHarmonicV ? 'V from harmonic minor' : undefined }
    }
    const next = parsed[i + 1] ?? null
    // Secondary dominant: a dominant-quality (or plain major) chord a fifth above the next chord's root.
    if (next && (p.isDominant7 || p.quality === 'major') && (rootChroma + 5) % 12 === Note.get(next.root).chroma! % 12) {
      const target = chordToNumeral(next.symbol, tonic)?.replace(/[^iIvV°]+$/, '')
      const nextDiatonic = next.notes.every((n) => scaleChromas.has(Note.get(n).chroma!))
      if (target && nextDiatonic) {
        const label = p.isDominant7 ? 'V7' : 'V'
        return { symbol: p.symbol, numeral: `${label}/${target}`, diatonic: false, device: `secondary dominant of ${target}`, deviceId: 'secondary-dominant' }
      }
    }
    // Tritone substitute: a dominant 7th a half step above the next chord's root.
    if (next && p.isDominant7 && (rootChroma + 11) % 12 === Note.get(next.root).chroma!) {
      const target = chordToNumeral(next.symbol, tonic)?.replace(/[^iIvV°]+$/, '')
      if (target) return { symbol: p.symbol, numeral: `subV7/${target}`, diatonic: false, device: `tritone substitute for the dominant of ${target}`, deviceId: 'tritone-substitution' }
    }
    // Secondary leading-tone chord: dim7 a half step below the next root.
    if (next && p.quality === 'diminished' && (rootChroma + 1) % 12 === Note.get(next.root).chroma!) {
      const target = chordToNumeral(next.symbol, tonic)?.replace(/[^iIvV°]+$/, '')
      if (target) return { symbol: p.symbol, numeral: `vii°7/${target}`, diatonic: false, device: `leading-tone chord of ${target}`, deviceId: 'secondary-dominant' }
    }
    // Borrowed from the parallel key.
    if (chromas.every((c) => parallelChromas.has(c))) {
      const from = mode === 'major' ? 'parallel minor' : 'parallel major'
      let deviceId = 'modal-interchange'
      if (numeral === 'bVII') deviceId = 'bVII'
      return { symbol: p.symbol, numeral, diatonic: false, device: `borrowed from the ${from} (modal interchange)`, deviceId }
    }
    // Chromatic mediant: same quality as tonic chord, root a third away, exactly one shared note.
    const tonicNotes = chordNotes(mode === 'major' ? tonic : tonic + 'm').map((n) => Note.get(n).chroma!)
    const shared = chromas.filter((c) => tonicNotes.includes(c)).length
    const thirdAway = [3, 4, 8, 9].includes(((rootChroma - tonicChroma) % 12 + 12) % 12)
    if (thirdAway && shared === 1 && p.quality === (mode === 'major' ? 'major' : 'minor')) {
      return { symbol: p.symbol, numeral, diatonic: false, device: 'chromatic mediant of the tonic', deviceId: 'chromatic-mediant' }
    }
    if (p.isDominant7) return { symbol: p.symbol, numeral, diatonic: false, device: 'non-diatonic dominant (check what it resolves to)' }
    return { symbol: p.symbol, numeral, diatonic: false, device: 'chromatic chord' }
  })
}

/** Split free text like "C G Am F | Dm7 G7" into symbols. Bars and commas are separators. */
export function splitSymbols(text: string): string[] {
  return text.split(/[\s|,]+/).map((s) => s.trim()).filter(Boolean)
}
