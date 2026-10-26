import { useEffect, useMemo, useState } from 'react'
import { player } from '../../audio/player'
import { useTransport } from '../../audio/useStep'
import { BarGrid } from '../../app/components/BarGrid'
import { navigate } from '../../app/hashState'
import { deviceById } from '../../content/devices'
import { useCollection, type Entity } from '../../store/collection'
import {
  CIRCLE_MAJOR, CIRCLE_MINOR, analyzeProgression, closeVoicing, parseChord, suggestKeys,
  type Mode, type RealizedChord,
} from '../../theory'

interface Sketch extends Entity {
  name: string
  text: string
  tonic: string
  mode: Mode
  bpm: number
}

/** "C G | Am F" -> [["C","G"],["Am","F"]]. A bar with no separator holds one chord per token. */
function parseBars(text: string): string[][] {
  const bars = text.split(/[|\n]/).map((b) => b.split(/[\s,]+/).filter(Boolean)).filter((b) => b.length)
  // Without bar lines, treat each chord as its own bar.
  if (!/[|\n]/.test(text)) return bars.flat().map((c) => [c])
  return bars
}

export function BuilderModule() {
  const sketches = useCollection<Sketch>('sketches')
  const [text, setText] = useState('C G Am F')
  const [tonic, setTonic] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode | null>(null)
  const [bpm, setBpm] = useState(100)
  const [loop, setLoop] = useState(true)
  const [name, setName] = useState('')
  const [loadedId, setLoadedId] = useState<string | null>(null)
  const transport = useTransport()

  useEffect(() => () => player.cancelSequence(), [])

  const bars = useMemo(() => parseBars(text), [text])
  const symbols = useMemo(() => bars.flat(), [bars])
  const guesses = useMemo(() => suggestKeys(symbols), [symbols])
  const key = tonic ?? guesses[0]?.tonic ?? 'C'
  const keyMode: Mode = mode ?? guesses[0]?.mode ?? 'major'
  const analysis = useMemo(() => analyzeProgression(symbols, key, keyMode), [symbols, key, keyMode])

  // Shape the analysis like realized bars so the shared grid can draw it.
  const realized: RealizedChord[][] = useMemo(() => {
    let i = 0
    return bars.map((bar) => bar.map((sym) => {
      const a = analysis[i++]
      const p = parseChord(sym)
      return { numeral: a?.numeral ?? '?', symbol: p?.symbol ?? sym, root: p?.root ?? '', suffix: p?.suffix ?? '' }
    }))
  }, [bars, analysis])

  const play = () => {
    const steps = realized.flatMap((bar) => bar.map((c) => ({ midis: parseChord(c.symbol) ? closeVoicing(c.symbol, 3) : [], beats: 4 / bar.length })))
    void player.playSteps(steps, bpm, loop)
  }

  const save = () => {
    const n = name.trim() || symbols.slice(0, 4).join(' ')
    if (loadedId) {
      sketches.update(loadedId, { name: n, text, tonic: key, mode: keyMode, bpm })
    } else {
      const s = sketches.add({ name: n, text, tonic: key, mode: keyMode, bpm })
      setLoadedId(s.id)
    }
    setName(n)
  }

  const load = (s: Sketch) => {
    player.cancelSequence()
    setText(s.text)
    setTonic(s.tonic)
    setMode(s.mode)
    setBpm(s.bpm)
    setName(s.name)
    setLoadedId(s.id)
  }

  const fresh = () => {
    player.cancelSequence()
    setText('')
    setTonic(null)
    setMode(null)
    setName('')
    setLoadedId(null)
  }

  const unreadable = analysis.filter((a) => a.numeral == null).map((a) => a.symbol)
  const tonics = keyMode === 'major' ? CIRCLE_MAJOR : CIRCLE_MINOR

  return (
    <div className="catalog-layout">
      <aside className="panel catalog-list">
        <div className="section-head" style={{ marginBottom: 8 }}>
          <h3 className="section" style={{ margin: 0 }}>Sketches</h3>
          <button className="small" onClick={fresh}>New</button>
        </div>
        <ul className="entry-list">
          {sketches.items.map((s) => (
            <li key={s.id} className={s.id === loadedId ? 'active' : ''} onClick={() => load(s)}>
              <div className="entry-name">{s.name}</div>
              <div className="entry-sub">{s.tonic} {s.mode} · {s.text}</div>
            </li>
          ))}
          {sketches.items.length === 0 && <li className="muted">Saved sketches appear here. They live in this browser; use Backup in the top bar to export them.</li>}
        </ul>
      </aside>

      <section className="panel">
        <div className="controls">
          <label style={{ flex: 1, minWidth: 280 }}>
            Chords (use | for bar lines, or one chord per bar)
            <input type="text" value={text} onChange={(e) => { setText(e.target.value); setTonic(null); setMode(null) }} placeholder="C G Am F   or   Dm7 G7 | Cmaj7" style={{ width: '100%', fontFamily: 'ui-monospace, monospace' }} />
          </label>
        </div>
        <div className="controls">
          <label>
            Key
            <div style={{ display: 'flex', gap: 4 }}>
              <select value={key} onChange={(e) => { setTonic(e.target.value); setMode(keyMode) }}>
                {tonics.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={keyMode} onChange={(e) => { setMode(e.target.value as Mode); setTonic(key) }}>
                <option value="major">major</option>
                <option value="minor">minor</option>
              </select>
            </div>
          </label>
          <label>
            Tempo
            <input type="number" min={40} max={240} value={bpm} onChange={(e) => setBpm(Number(e.target.value) || 100)} style={{ width: 70 }} />
          </label>
          <label>
            Loop
            <div className="seg-group">
              <button className={`seg ${loop ? 'on' : ''}`} onClick={() => setLoop(true)}>on</button>
              <button className={`seg ${!loop ? 'on' : ''}`} onClick={() => setLoop(false)}>off</button>
            </div>
          </label>
          <div className="seg-group">
            <button className="seg primary" onClick={play} disabled={symbols.length === 0}>Play</button>
            <button className="seg" onClick={() => player.togglePause()} disabled={transport.status === 'stopped'}>{transport.status === 'paused' ? 'Resume' : 'Pause'}</button>
            <button className="seg" onClick={() => player.stopAll()} disabled={transport.status === 'stopped'}>Stop</button>
          </div>
          <label>
            Name
            <div style={{ display: 'flex', gap: 4 }}>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="untitled" style={{ width: 160 }} />
              <button onClick={save} disabled={symbols.length === 0}>{loadedId ? 'Update' : 'Save'}</button>
              {loadedId && <button onClick={() => { sketches.remove(loadedId); fresh() }}>Delete</button>}
            </div>
          </label>
        </div>

        {guesses.length > 0 && (
          <p className="muted" style={{ margin: '0 0 4px' }}>
            Likely keys:{' '}
            {guesses.slice(0, 4).map((g, i) => (
              <button key={`${g.tonic}${g.mode}`} className={`small key-guess ${g.tonic === key && g.mode === keyMode ? 'on' : ''}`} onClick={() => { setTonic(g.tonic); setMode(g.mode) }} style={{ marginRight: 4 }}>
                {g.tonic} {g.mode} <span className="muted">{g.diatonic}/{g.total}{i === 0 ? ' best' : ''}</span>
              </button>
            ))}
          </p>
        )}

        {symbols.length > 0 ? (
          <BarGrid bars={realized} mode={keyMode} activeStep={transport.step} />
        ) : (
          <p className="muted">Type some chords to begin. Try a song you have written: the analysis will tell you what it is doing.</p>
        )}
        {unreadable.length > 0 && <p className="muted">Could not read: {unreadable.join(', ')}. Use symbols like C, Am, G7, Dm7, Fmaj7, Bm7b5, Ebdim7.</p>}

        {symbols.length > 0 && (
          <>
            <h3 className="section">Analysis in {key} {keyMode}</h3>
            <table className="note-table">
              <thead><tr><th>Chord</th><th>Numeral</th><th>Role</th></tr></thead>
              <tbody>
                {analysis.map((a, i) => (
                  <tr key={i}>
                    <td>{a.symbol}</td>
                    <td><b style={{ color: a.diatonic ? 'var(--accent)' : 'var(--ext)' }}>{a.numeral ?? '?'}</b></td>
                    <td>
                      {a.diatonic ? <span className="muted">diatonic{a.device ? `, ${a.device}` : ''}</span> : <span>{a.device}</span>}
                      {a.deviceId && (
                        <>
                          {' '}
                          <a className="tiny-link" href="#" onClick={(e) => { e.preventDefault(); navigate('devices', { id: a.deviceId! }) }}>
                            {deviceById(a.deviceId)?.name ?? 'read more'}
                          </a>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="hint">The analyzer names the most common reading. Secondary dominants are detected from what follows them, so order matters. If a chord is labelled "chromatic chord", it is doing something the library does not yet describe: a good thing to write a note about.</p>
          </>
        )}
      </section>
    </div>
  )
}
