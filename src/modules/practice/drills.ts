import { CIRCLE_MAJOR, CIRCLE_MINOR, keyInfo } from '../../theory'

/**
 * Key-signature and diatonic-chord drill questions. Generated from the theory
 * engine, never hand-typed, so they are always right.
 */
export interface Drill {
  /** Stable id so stats persist: e.g. "sig:Eb". */
  id: string
  prompt: string
  answer: string
  choices: string[]
  category: 'signature' | 'key-from-signature' | 'relative' | 'diatonic'
}

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function sigText(sig: string): string {
  if (!sig) return 'no sharps or flats'
  const n = sig.length
  return `${n} ${sig[0] === 'b' ? 'flat' : 'sharp'}${n > 1 ? 's' : ''}`
}

function pick<T>(xs: T[], n: number, exclude: T): T[] {
  return shuffle(xs.filter((x) => x !== exclude)).slice(0, n)
}

const ALL_SIGS = ['no sharps or flats', '1 sharp', '2 sharps', '3 sharps', '4 sharps', '5 sharps', '6 sharps', '1 flat', '2 flats', '3 flats', '4 flats', '5 flats', '6 flats']

export function allDrills(): Drill[] {
  const out: Drill[] = []
  for (const t of CIRCLE_MAJOR) {
    const k = keyInfo(t, 'major')
    const answer = sigText(k.signature)
    out.push({ id: `sig:${t}`, category: 'signature', prompt: `How many sharps or flats are in ${t} major?`, answer, choices: shuffle([answer, ...pick(ALL_SIGS, 3, answer)]) })
    out.push({ id: `keyfrom:${t}`, category: 'key-from-signature', prompt: `Which major key has ${answer}?`, answer: t, choices: shuffle([t, ...pick(CIRCLE_MAJOR, 3, t)]) })
    out.push({ id: `rel:${t}`, category: 'relative', prompt: `What is the relative minor of ${t} major?`, answer: `${k.relative} minor`, choices: shuffle([`${k.relative} minor`, ...pick(CIRCLE_MINOR.map((m) => `${m} minor`), 3, `${k.relative} minor`)]) })
    for (const deg of [1, 3, 4, 5]) {
      const chord = k.chords[deg]
      const numeral = k.numerals[deg]
      out.push({ id: `dia:${t}:${deg}`, category: 'diatonic', prompt: `In ${t} major, what is the ${numeral} chord (as a seventh chord)?`, answer: chord, choices: shuffle([chord, ...pick(k.chords, 3, chord)]) })
    }
  }
  for (const t of CIRCLE_MINOR) {
    const k = keyInfo(t, 'minor')
    out.push({ id: `relmaj:${t}`, category: 'relative', prompt: `What is the relative major of ${t} minor?`, answer: `${k.relative} major`, choices: shuffle([`${k.relative} major`, ...pick(CIRCLE_MAJOR.map((m) => `${m} major`), 3, `${k.relative} major`)]) })
  }
  return out
}

export interface DrillStat {
  id: string
  /** Leitner box 0..4: higher means better known, asked less often. */
  box: number
  correct: number
  wrong: number
  lastSeen: string
}

/** Choose the next drill: unseen first, then lower boxes more often. */
export function nextDrill(drills: Drill[], stats: Record<string, DrillStat>, categories: Set<Drill['category']>): Drill | null {
  const pool = drills.filter((d) => categories.has(d.category))
  if (pool.length === 0) return null
  const weighted = pool.map((d) => {
    const s = stats[d.id]
    const w = s ? [8, 5, 3, 2, 1][Math.min(4, s.box)] : 10
    return { d, w }
  })
  const total = weighted.reduce((n, x) => n + x.w, 0)
  let r = Math.random() * total
  for (const x of weighted) {
    r -= x.w
    if (r <= 0) return x.d
  }
  return weighted[weighted.length - 1].d
}
