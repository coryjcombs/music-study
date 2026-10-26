import { useEffect, useMemo, useState } from 'react'
import { player } from '../../audio/player'
import { readCollection, writeCollection } from '../../store/collection'
import { CIRCLE_MAJOR, closeVoicing, realizeBars } from '../../theory'

type Exercise = 'intervals' | 'qualities' | 'progressions'

interface Question {
  kind: Exercise
  answer: string
  choices: string[]
  /** How to play it again. */
  play: () => void
  description: string
}

interface ExerciseStat {
  id: string
  right: number
  wrong: number
}

const INTERVALS: { name: string; semis: number }[] = [
  { name: 'minor 2nd', semis: 1 }, { name: 'major 2nd', semis: 2 }, { name: 'minor 3rd', semis: 3 }, { name: 'major 3rd', semis: 4 },
  { name: 'perfect 4th', semis: 5 }, { name: 'tritone', semis: 6 }, { name: 'perfect 5th', semis: 7 }, { name: 'minor 6th', semis: 8 },
  { name: 'major 6th', semis: 9 }, { name: 'minor 7th', semis: 10 }, { name: 'major 7th', semis: 11 }, { name: 'octave', semis: 12 },
]

const QUALITIES: { name: string; suffix: string }[] = [
  { name: 'major', suffix: '' }, { name: 'minor', suffix: 'm' }, { name: 'diminished', suffix: 'dim' }, { name: 'augmented', suffix: 'aug' },
  { name: 'dominant 7', suffix: '7' }, { name: 'major 7', suffix: 'maj7' }, { name: 'minor 7', suffix: 'm7' }, { name: 'half-diminished', suffix: 'm7b5' },
]

const PROGRESSIONS: { name: string; bars: string[] }[] = [
  { name: 'I–IV–V–I', bars: ['I', 'IV', 'V', 'I'] },
  { name: 'I–V–vi–IV', bars: ['I', 'V', 'vi', 'IV'] },
  { name: 'vi–IV–I–V', bars: ['vi', 'IV', 'I', 'V'] },
  { name: 'ii–V–I', bars: ['ii7', 'V7', 'Imaj7', 'Imaj7'] },
  { name: 'I–vi–IV–V', bars: ['I', 'vi', 'IV', 'V'] },
  { name: 'i–bVII–bVI–V', bars: ['i', 'bVII', 'bVI', 'V'] },
  { name: 'I–IV–iv–I', bars: ['I', 'IV', 'iv', 'I'] },
  { name: 'I–bVII–IV–I', bars: ['I', 'bVII', 'IV', 'I'] },
  { name: 'I–bVI–bVII–I', bars: ['I', 'bVI', 'bVII', 'I'] },
]

const rand = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)]
const shuffle = <T,>(xs: T[]): T[] => [...xs].sort(() => Math.random() - 0.5)

function makeQuestion(kind: Exercise, enabled: Set<string>): Question {
  if (kind === 'intervals') {
    const pool = INTERVALS.filter((i) => enabled.has(i.name))
    const target = rand(pool.length ? pool : INTERVALS)
    const root = 48 + Math.floor(Math.random() * 12)
    const ascending = Math.random() < 0.7
    const notes = ascending ? [root, root + target.semis] : [root + target.semis, root]
    const play = () => void player.playSequence(notes, 0.6, 0.9)
    const distractors = shuffle((pool.length >= 4 ? pool : INTERVALS).filter((i) => i.name !== target.name)).slice(0, 3)
    return { kind, answer: target.name, choices: shuffle([target.name, ...distractors.map((d) => d.name)]), play, description: ascending ? 'two notes, ascending' : 'two notes, descending' }
  }
  if (kind === 'qualities') {
    const pool = QUALITIES.filter((q) => enabled.has(q.name))
    const target = rand(pool.length ? pool : QUALITIES)
    const root = rand(CIRCLE_MAJOR)
    const midis = closeVoicing(root + target.suffix, 3)
    const play = () => void player.strum(midis, 0.03, 1.8)
    const distractors = shuffle((pool.length >= 4 ? pool : QUALITIES).filter((q) => q.name !== target.name)).slice(0, 3)
    return { kind, answer: target.name, choices: shuffle([target.name, ...distractors.map((d) => d.name)]), play, description: 'one chord' }
  }
  const pool = PROGRESSIONS.filter((p) => enabled.has(p.name))
  const target = rand(pool.length ? pool : PROGRESSIONS)
  const tonic = rand(CIRCLE_MAJOR)
  const bars = realizeBars(target.bars, tonic)
  const steps = bars.map((bar) => ({ midis: closeVoicing(bar[0].symbol, 3), beats: 2 }))
  const play = () => void player.playSteps(steps, 110, false)
  const distractors = shuffle((pool.length >= 4 ? pool : PROGRESSIONS).filter((p) => p.name !== target.name)).slice(0, 3)
  return { kind, answer: target.name, choices: shuffle([target.name, ...distractors.map((d) => d.name)]), play, description: `four chords in ${tonic}` }
}

export function EarModule() {
  const [kind, setKind] = useState<Exercise>('intervals')
  const [enabled, setEnabled] = useState<Set<string>>(new Set(INTERVALS.map((i) => i.name)))
  const [q, setQ] = useState<Question | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [stats, setStats] = useState<Record<string, ExerciseStat>>(() => Object.fromEntries(readCollection<ExerciseStat>('ear-stats').map((s) => [s.id, s])))

  useEffect(() => writeCollection('ear-stats', Object.values(stats)), [stats])
  useEffect(() => () => player.cancelSequence(), [])

  const options = useMemo(() => kind === 'intervals' ? INTERVALS.map((i) => i.name) : kind === 'qualities' ? QUALITIES.map((x) => x.name) : PROGRESSIONS.map((p) => p.name), [kind])

  const switchKind = (k: Exercise) => {
    player.cancelSequence()
    setKind(k)
    setEnabled(new Set(k === 'intervals' ? INTERVALS.map((i) => i.name) : k === 'qualities' ? QUALITIES.map((x) => x.name) : PROGRESSIONS.map((p) => p.name)))
    setQ(null)
    setPicked(null)
  }

  const ask = () => {
    player.cancelSequence()
    const nq = makeQuestion(kind, enabled)
    setQ(nq)
    setPicked(null)
    nq.play()
  }

  const answer = (c: string) => {
    if (!q || picked) return
    setPicked(c)
    const ok = c === q.answer
    const id = `${q.kind}:${q.answer}`
    setStats((all) => {
      const prev = all[id] ?? { id, right: 0, wrong: 0 }
      return { ...all, [id]: { ...prev, right: prev.right + (ok ? 1 : 0), wrong: prev.wrong + (ok ? 0 : 1) } }
    })
  }

  const toggle = (name: string) => {
    const s = new Set(enabled)
    if (s.has(name)) s.delete(name)
    else s.add(name)
    if (s.size >= 2) setEnabled(s)
  }

  const kindStats = Object.values(stats).filter((s) => s.id.startsWith(kind + ':'))
  const right = kindStats.reduce((n, s) => n + s.right, 0)
  const wrong = kindStats.reduce((n, s) => n + s.wrong, 0)

  return (
    <div className="two-col">
      <div className="panel">
        <div className="controls">
          <label>
            Exercise
            <div className="seg-group">
              <button className={`seg ${kind === 'intervals' ? 'on' : ''}`} onClick={() => switchKind('intervals')}>Intervals</button>
              <button className={`seg ${kind === 'qualities' ? 'on' : ''}`} onClick={() => switchKind('qualities')}>Chord quality</button>
              <button className={`seg ${kind === 'progressions' ? 'on' : ''}`} onClick={() => switchKind('progressions')}>Progressions</button>
            </div>
          </label>
        </div>
        <p className="muted" style={{ marginTop: 0 }}>
          {kind === 'intervals' && 'Two notes are played. Name the interval between them.'}
          {kind === 'qualities' && 'One chord is played. Name its quality.'}
          {kind === 'progressions' && 'Four chords are played in a random key. Name the progression.'}
        </p>
        <div className="section-head">
          <button className="primary" onClick={ask}>{q ? 'Next' : 'Start'}</button>
          {q && <button onClick={() => q.play()}>Replay</button>}
          <span className="muted" style={{ marginLeft: 'auto' }}>All time: {right} right, {wrong} wrong</span>
        </div>
        {q && (
          <div className="drill">
            <p className="drill-prompt muted">{q.description}</p>
            <div className="drill-choices">
              {q.choices.map((c) => {
                const state = !picked ? '' : c === q.answer ? 'right' : c === picked ? 'wrong' : 'dim'
                return <button key={c} className={`drill-choice ${state}`} onClick={() => answer(c)}>{c}</button>
              })}
            </div>
          </div>
        )}
      </div>
      <div className="panel">
        <h3 className="section" style={{ marginTop: 0 }}>Include</h3>
        <p className="muted" style={{ marginTop: 0 }}>Narrow the set while learning, then widen it. At least two stay on.</p>
        <div className="notes-row" style={{ marginTop: 0 }}>
          {options.map((o) => {
            const s = stats[`${kind}:${o}`]
            return (
              <button key={o} className={`chip toggle-chip ${enabled.has(o) ? 'on' : ''}`} onClick={() => toggle(o)}>
                {o}{s && <span className="muted"> {s.right}/{s.right + s.wrong}</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
