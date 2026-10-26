import { Note } from 'tonal'
import { CHORD_TEMPLATES, chordNotes, chordSymbol, type ChordTemplate } from './chords'
import { midiAt } from './fretboard'
import { functionLabel, semitonesFromRoot } from './intervals'
import { spellNote, spellPitchClass } from './spelling'
import type { Midi, NoteName, Shape, Tuning } from './types'

export interface VoicedNote {
  string: number
  fret: number
  midi: Midi
  /** Spelled with octave, e.g. "Eb4". */
  note: NoteName
  pitchClass: NoteName
  /** Chord-function label relative to the identified root, e.g. "b7". */
  label: string
}

export interface ChordCandidate {
  root: NoteName
  symbol: string
  name: string
  template: ChordTemplate
  /** Semitone tones of the template that are not played (the fifth, usually). */
  omitted: number[]
  /** True when the root is asserted but not actually played. */
  rootImplied: boolean
  score: number
}

export interface VoicingAnalysis {
  shape: Shape
  notes: VoicedNote[]
  root: NoteName | null
  candidates: ChordCandidate[]
  best: ChordCandidate | null
  /** Pitch classes played more than once. */
  doubled: NoteName[]
  /** Chord-function labels missing from the best candidate, e.g. ["5"]. */
  missing: string[]
  bassNote: NoteName | null
  isInversion: boolean
}

const SEMITONE_LABEL = ['R', 'b9', '9', 'b3', '3', '11', '#11', '5', 'b13', '13', 'b7', '7']

function templateLabel(t: ChordTemplate, semis: number): string {
  // The template's own vocabulary decides how a tone is read (3 vs #9, 13 vs b7).
  if (t.suffix.includes('#9') && semis === 3) return '#9'
  if (t.suffix.includes('b5') && semis === 6) return 'b5'
  if (t.suffix.includes('#5') && semis === 8) return '#5'
  if (t.suffix.includes('dim') && semis === 9) return 'bb7'
  if ((t.suffix === '6' || t.suffix === 'm6' || t.suffix.includes('6/9')) && semis === 9) return '6'
  if (t.suffix.includes('sus4') && semis === 5) return '4'
  if (t.suffix.includes('sus2') && semis === 2) return '2'
  if (t.suffix.includes('add9') && semis === 2) return '9'
  return SEMITONE_LABEL[semis]
}

function scoreTemplate(
  t: ChordTemplate,
  played: Set<number>,
  rootPlayed: boolean,
  bassSemis: number,
): ChordCandidate['score'] | null {
  const allowed = new Set([...t.required, ...t.optional])
  for (const s of played) if (!allowed.has(s)) return null
  for (const r of t.required) if (r !== 0 && !played.has(r)) return null
  let score = 0
  score += played.size * 10 // reward explaining more of what is played
  score -= t.optional.filter((o) => !played.has(o)).length * 2 // penalize unplayed optional tones
  score -= t.required.length + t.optional.length // prefer simpler templates when tied
  if (!rootPlayed) score -= 15
  if (bassSemis !== 0) score -= 3 // root in the bass is the default reading
  return score
}

/** Analyze a shape. If `assertedRoot` is given, candidates are built on it only. */
export function analyzeVoicing(tuning: Tuning, shape: Shape, assertedRoot?: NoteName): VoicingAnalysis {
  const sounding: { string: number; fret: number; midi: Midi }[] = []
  shape.forEach((fret, string) => {
    if (fret != null && fret >= 0) sounding.push({ string, fret, midi: midiAt(tuning, { string, fret }) })
  })
  const empty: VoicingAnalysis = {
    shape, notes: [], root: null, candidates: [], best: null,
    doubled: [], missing: [], bassNote: null, isInversion: false,
  }
  if (sounding.length === 0) return empty

  const bassMidi = Math.min(...sounding.map((s) => s.midi))
  const chromas = new Set(sounding.map((s) => s.midi % 12))

  const rootChoices = assertedRoot ? [Note.get(assertedRoot).chroma!] : [...chromas]
  const candidates: ChordCandidate[] = []
  for (const rootChroma of rootChoices) {
    const played = new Set([...chromas].map((c) => (((c - rootChroma) % 12) + 12) % 12))
    const rootPlayed = played.has(0)
    const withRoot = new Set(played)
    withRoot.add(0)
    const bassSemis = (((bassMidi % 12) - rootChroma) % 12 + 12) % 12
    for (const t of CHORD_TEMPLATES) {
      const score = scoreTemplate(t, withRoot, rootPlayed, bassSemis)
      if (score == null) continue
      // Spell the root: asserted spelling wins, else sharps for sharp-ish keys, flats otherwise.
      const root = assertedRoot ? Note.pitchClass(assertedRoot) : pickRootSpelling(rootChroma, t)
      const symbol = chordSymbol(root, t.suffix)
      const omitted = t.optional.filter((o) => !withRoot.has(o))
      candidates.push({ root, symbol, name: `${root} ${t.name}`, template: t, omitted, rootImplied: !rootPlayed, score })
    }
  }
  candidates.sort((a, b) => b.score - a.score)
  const best = candidates[0] ?? null
  const root = best?.root ?? (assertedRoot ? Note.pitchClass(assertedRoot) : null)

  // Spell every sounding note against the chord's own notes when we have a chord, else the root.
  const ctxNotes = best ? safeChordNotes(best.symbol, root!) : root ? [root] : undefined
  const notes: VoicedNote[] = sounding.map((s) => {
    const pitchClass = spellPitchClass(s.midi, { notes: ctxNotes })
    const semis = root ? semitonesFromRoot(root, pitchClass) : 0
    const label = root ? (best ? templateLabel(best.template, semis) : functionLabel(root, pitchClass)) : ''
    return { ...s, note: spellNote(s.midi, { notes: ctxNotes }), pitchClass, label }
  })

  const counts = new Map<string, number>()
  for (const n of notes) counts.set(n.pitchClass, (counts.get(n.pitchClass) ?? 0) + 1)
  const doubled = [...counts.entries()].filter(([, c]) => c > 1).map(([pc]) => pc)

  const missing: string[] = []
  if (best) {
    if (best.rootImplied) missing.push('R')
    for (const o of best.omitted) missing.push(templateLabel(best.template, o))
  }
  const bassNote = spellPitchClass(bassMidi, { notes: ctxNotes })
  const isInversion = root != null && Note.get(bassNote).chroma !== Note.get(root).chroma

  return { shape, notes, root, candidates, best, doubled, missing, bassNote, isInversion }
}

function safeChordNotes(symbol: string, root: NoteName): NoteName[] {
  try {
    const n = chordNotes(symbol)
    return n.length ? n : [root]
  } catch {
    return [root]
  }
}

/** Without an asserted root, choose the spelling whose chord has the fewest accidentals. */
function pickRootSpelling(chroma: number, t: ChordTemplate): NoteName {
  const flat = Note.pitchClass(Note.fromMidi(60 + chroma))
  const sharp = Note.pitchClass(Note.fromMidiSharps(60 + chroma))
  if (flat === sharp) return flat
  const count = (root: NoteName) => {
    try {
      return chordNotes(chordSymbol(root, t.suffix)).reduce((n, x) => n + Note.get(x).acc.length, 0)
    } catch {
      return 99
    }
  }
  return count(flat) <= count(sharp) ? flat : sharp
}

/** Parse "x3133x" or "x 3 1 3 3 x" into a shape. */
export function parseShape(text: string): Shape {
  const tokens = text.trim().includes(' ') ? text.trim().split(/\s+/) : text.trim().split('')
  return tokens.map((t) => (t.toLowerCase() === 'x' ? null : Number(t)))
}

export function shapeToString(shape: Shape): string {
  return shape.map((f) => (f == null ? 'x' : String(f))).join(shape.some((f) => (f ?? 0) > 9) ? ' ' : '')
}
