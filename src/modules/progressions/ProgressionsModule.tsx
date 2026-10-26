import { useEffect, useMemo, useState } from 'react'
import { player } from '../../audio/player'
import { useTransport } from '../../audio/useStep'
import { BarGrid } from '../../app/components/BarGrid'
import { navigate, parseHash } from '../../app/hashState'
import { DEVICES, deviceById } from '../../content/devices'
import { GENRES, PROGRESSIONS } from '../../content/progressions'
import { CIRCLE_MAJOR, CIRCLE_MINOR, closeVoicing, keyInfo, realizeBars } from '../../theory'

export function ProgressionsModule() {
  const initial = parseHash().params
  const [selectedId, setSelectedId] = useState(initial.get('id') ?? PROGRESSIONS[0].id)
  const [device, setDevice] = useState('any')
  const [genre, setGenre] = useState('any')
  const [mode, setMode] = useState<'any' | 'major' | 'minor'>('any')
  const [tonic, setTonic] = useState<string | null>(null)
  const [bpm, setBpm] = useState<number | null>(null)
  const [loop, setLoop] = useState(true)
  const transport = useTransport()
  const step = transport.step

  useEffect(() => {
    const onHash = () => {
      const p = parseHash()
      if (p.module === 'progressions' && p.params.get('id')) setSelectedId(p.params.get('id')!)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => () => player.cancelSequence(), [])

  const list = useMemo(() => PROGRESSIONS.filter((p) =>
    (device === 'any' || p.devices.includes(device)) &&
    (genre === 'any' || p.genres.includes(genre)) &&
    (mode === 'any' || p.mode === mode)), [device, genre, mode])

  const entry = PROGRESSIONS.find((p) => p.id === selectedId) ?? PROGRESSIONS[0]
  const key = tonic ?? entry.tonic ?? 'C'
  const tempo = bpm ?? entry.bpm ?? 96
  const bars = useMemo(() => realizeBars(entry.bars, key), [entry, key])
  const info = useMemo(() => keyInfo(key, entry.mode), [key, entry.mode])

  const play = () => {
    const steps = bars.flatMap((bar) => bar.map((c) => ({ midis: closeVoicing(c.symbol, 3), beats: 4 / bar.length })))
    void player.playSteps(steps, tempo, loop)
  }

  const select = (id: string) => {
    player.cancelSequence()
    setSelectedId(id)
    setTonic(null)
    setBpm(null)
  }

  const tonics = entry.mode === 'major' ? CIRCLE_MAJOR : CIRCLE_MINOR

  return (
    <div className="catalog-layout">
      <aside className="panel catalog-list">
        <div className="controls" style={{ gap: 10 }}>
          <label>
            Device
            <select value={device} onChange={(e) => setDevice(e.target.value)}>
              <option value="any">any</option>
              {DEVICES.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </label>
          <label>
            Genre
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="any">any</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>
          <label>
            Mode
            <div className="seg-group">
              {(['any', 'major', 'minor'] as const).map((m) => (
                <button key={m} className={`seg ${mode === m ? 'on' : ''}`} onClick={() => setMode(m)}>{m}</button>
              ))}
            </div>
          </label>
        </div>
        <ul className="entry-list">
          {list.map((p) => (
            <li key={p.id} className={p.id === entry.id ? 'active' : ''} onClick={() => select(p.id)}>
              <div className="entry-name">{p.name}</div>
              <div className="entry-sub">{p.bars.join(' · ')}</div>
            </li>
          ))}
          {list.length === 0 && <li className="muted">Nothing matches those filters.</li>}
        </ul>
      </aside>

      <section className="panel">
        <h2 className="chord-title">{entry.name}</h2>
        <p className="muted" style={{ marginTop: 4 }}>{entry.feel}</p>

        <div className="controls">
          <label>
            Key
            <select value={key} onChange={(e) => setTonic(e.target.value)}>
              {tonics.map((t) => <option key={t} value={t}>{t} {entry.mode}</option>)}
            </select>
          </label>
          <label>
            Tempo
            <input type="number" min={40} max={240} value={tempo} onChange={(e) => setBpm(Number(e.target.value) || 96)} style={{ width: 70 }} />
          </label>
          <label>
            Loop
            <div className="seg-group">
              <button className={`seg ${loop ? 'on' : ''}`} onClick={() => setLoop(true)}>on</button>
              <button className={`seg ${!loop ? 'on' : ''}`} onClick={() => setLoop(false)}>off</button>
            </div>
          </label>
          <div className="seg-group">
            <button className="seg primary" onClick={play}>Play</button>
            <button className="seg" onClick={() => player.togglePause()} disabled={transport.status === 'stopped'}>
              {transport.status === 'paused' ? 'Resume' : 'Pause'}
            </button>
            <button className="seg" onClick={() => player.stopAll()} disabled={transport.status === 'stopped'}>Stop</button>
          </div>
        </div>

        <BarGrid bars={bars} mode={entry.mode} activeStep={step} />
        <p className="hint">
          Key of {key} {entry.mode}: {info.scale.join(' ')}. Chords with an orange edge are outside the diatonic set. Click any chord to hear it.
        </p>

        <h3 className="section">Why it works</h3>
        {entry.why.map((p, i) => <p key={i} className="prose">{p}</p>)}

        <h3 className="section">Devices</h3>
        <div className="notes-row" style={{ marginTop: 4 }}>
          {entry.devices.map((d) => (
            <a key={d} className="chip link-chip" href="#" onClick={(e) => { e.preventDefault(); navigate('devices', { id: d }) }}>{deviceById(d)?.name ?? d}</a>
          ))}
        </div>

        <h3 className="section">Listen for it</h3>
        <ul className="examples">
          {entry.examples.map((x, i) => (
            <li key={i}><b>{x.title}</b> <span className="muted">· {x.by}{x.note ? ` · ${x.note}` : ''}</span></li>
          ))}
        </ul>
        <p className="muted" style={{ fontSize: 12 }}>Genres: {entry.genres.join(', ')}</p>
      </section>
    </div>
  )
}
