import { useEffect, useMemo, useState } from 'react'
import { readCollection, useCollection, writeCollection, type Entity } from '../../store/collection'
import { allDrills, nextDrill, type Drill, type DrillStat } from './drills'

interface PracticeEntry extends Entity {
  date: string
  minutes: number
  focus: string
  notes: string
}

const FOCUS_SUGGESTIONS = ['technique', 'scales', 'arpeggios', 'voicings', 'ii–V–I', 'repertoire', 'ear training', 'theory', 'writing', 'rhythm']

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function startOfWeek(d: Date): Date {
  const x = new Date(d)
  const day = (x.getDay() + 6) % 7 // Monday = 0
  x.setDate(x.getDate() - day)
  x.setHours(0, 0, 0, 0)
  return x
}

function minutesSince(items: PracticeEntry[], start: Date): number {
  return items.filter((e) => new Date(e.date) >= start).reduce((n, e) => n + e.minutes, 0)
}

/** Consecutive logged days ending today or yesterday. */
function streakDays(items: PracticeEntry[], now: Date): number {
  const days = new Set(items.map((e) => e.date))
  const d = new Date(now)
  if (!days.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1)
  let n = 0
  while (days.has(d.toISOString().slice(0, 10))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export function PracticeModule() {
  const log = useCollection<PracticeEntry>('practice')
  const [date, setDate] = useState(today())
  const [minutes, setMinutes] = useState(30)
  const [focus, setFocus] = useState('')
  const [notes, setNotes] = useState('')

  const [now] = useState(() => new Date())
  const weekTotal = useMemo(() => minutesSince(log.items, startOfWeek(now)), [log.items, now])
  const streak = useMemo(() => streakDays(log.items, now), [log.items, now])

  const addEntry = () => {
    log.add({ date, minutes, focus: focus.trim(), notes: notes.trim() })
    setNotes('')
  }

  return (
    <div className="two-col">
      <div className="panel">
        <h3 className="section" style={{ marginTop: 0 }}>Practice log</h3>
        <div className="stat-row">
          <div className="stat"><b>{weekTotal}</b><span>min this week</span></div>
          <div className="stat"><b>{streak}</b><span>day streak</span></div>
          <div className="stat"><b>{log.items.length}</b><span>sessions</span></div>
        </div>
        <div className="controls">
          <label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <label>Minutes<input type="number" min={1} max={600} value={minutes} onChange={(e) => setMinutes(Number(e.target.value) || 0)} style={{ width: 70 }} /></label>
          <label style={{ flex: 1, minWidth: 180 }}>
            Focus
            <input type="text" list="focus-list" value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="voicings, ii–V–I in Bb…" />
            <datalist id="focus-list">{FOCUS_SUGGESTIONS.map((f) => <option key={f} value={f} />)}</datalist>
          </label>
        </div>
        <label className="block-label">
          Notes
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="What worked, what did not, what to do next time." />
        </label>
        <button className="primary" onClick={addEntry} disabled={!minutes}>Add session</button>

        <ul className="log-list">
          {log.items.map((e) => (
            <li key={e.id}>
              <div className="log-head">
                <b>{e.date}</b> <span className="muted">{e.minutes} min</span> {e.focus && <span className="chip">{e.focus}</span>}
                <button className="small" style={{ marginLeft: 'auto' }} onClick={() => log.remove(e.id)}>delete</button>
              </div>
              {e.notes && <div className="log-notes">{e.notes}</div>}
            </li>
          ))}
          {log.items.length === 0 && <li className="muted">No sessions yet.</li>}
        </ul>
      </div>

      <DrillPanel />
    </div>
  )
}

function DrillPanel() {
  const drills = useMemo(() => allDrills(), [])
  const [stats, setStats] = useState<Record<string, DrillStat>>(() => {
    const list = readCollection<DrillStat>('drill-stats')
    return Object.fromEntries(list.map((s) => [s.id, s]))
  })
  const [cats, setCats] = useState<Set<Drill['category']>>(new Set(['signature', 'key-from-signature', 'relative', 'diatonic']))
  const [current, setCurrent] = useState<Drill | null>(() => nextDrill(drills, {}, new Set(['signature', 'key-from-signature', 'relative', 'diatonic'])))
  const [picked, setPicked] = useState<string | null>(null)
  const [session, setSession] = useState({ right: 0, wrong: 0 })

  useEffect(() => writeCollection('drill-stats', Object.values(stats)), [stats])

  const answer = (choice: string) => {
    if (!current || picked) return
    setPicked(choice)
    const ok = choice === current.answer
    setSession((s) => ({ right: s.right + (ok ? 1 : 0), wrong: s.wrong + (ok ? 0 : 1) }))
    setStats((all) => {
      const prev = all[current.id] ?? { id: current.id, box: 0, correct: 0, wrong: 0, lastSeen: '' }
      const box = ok ? Math.min(4, prev.box + 1) : 0
      return { ...all, [current.id]: { ...prev, box, correct: prev.correct + (ok ? 1 : 0), wrong: prev.wrong + (ok ? 0 : 1), lastSeen: new Date().toISOString() } }
    })
  }

  const next = () => {
    setPicked(null)
    setCurrent(nextDrill(drills, stats, cats))
  }

  const toggle = (c: Drill['category']) => {
    const s = new Set(cats)
    if (s.has(c)) s.delete(c)
    else s.add(c)
    if (s.size) setCats(s)
  }

  const known = Object.values(stats).filter((s) => s.box >= 3).length
  const labels: Record<Drill['category'], string> = { signature: 'Signatures', 'key-from-signature': 'Key from signature', relative: 'Relative keys', diatonic: 'Diatonic chords' }

  return (
    <div className="panel">
      <h3 className="section" style={{ marginTop: 0 }}>Key drills</h3>
      <p className="muted" style={{ marginTop: 0 }}>Quick recall of signatures, relative keys and diatonic chords. Questions you miss come back sooner. {known} of {drills.length} well known.</p>
      <div className="controls">
        <label>
          Ask about
          <div className="seg-group">
            {(Object.keys(labels) as Drill['category'][]).map((c) => (
              <button key={c} className={`seg ${cats.has(c) ? 'on' : ''}`} onClick={() => toggle(c)}>{labels[c]}</button>
            ))}
          </div>
        </label>
      </div>
      {current && (
        <div className="drill">
          <p className="drill-prompt">{current.prompt}</p>
          <div className="drill-choices">
            {current.choices.map((c) => {
              const state = !picked ? '' : c === current.answer ? 'right' : c === picked ? 'wrong' : 'dim'
              return <button key={c} className={`drill-choice ${state}`} onClick={() => answer(c)}>{c}</button>
            })}
          </div>
          <div className="section-head">
            <span className="muted">This session: {session.right} right, {session.wrong} wrong</span>
            <button className={picked ? 'primary' : ''} onClick={next}>{picked ? 'Next' : 'Skip'}</button>
          </div>
        </div>
      )}
    </div>
  )
}
