import { useEffect, useState } from 'react'
import { INSTRUMENTS, player, type InstrumentId } from '../audio/player'
import { usePlayerStatus } from '../audio/usePlayer'
import { useSettings } from '../store/settings'
import { TUNINGS } from '../theory'
import { parseHash } from './hashState'
import { MODULES } from './modules'

function moduleFromHash(): string {
  const { module } = parseHash()
  return MODULES.some((m) => m.id === module) ? module : MODULES[0].id
}

export function App() {
  const [settings, updateSettings] = useSettings()
  const [active, setActive] = useState(moduleFromHash)
  const status = usePlayerStatus()

  useEffect(() => {
    const onHash = () => setActive(moduleFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    void player.setInstrument(settings.instrument)
  }, [settings.instrument])

  const Active = MODULES.find((m) => m.id === active)!.component

  return (
    <div className="app">
      <header className="topbar">
        <h1 className="brand">Music Study</h1>
        <nav className="nav">
          {MODULES.map((m) => (
            <a key={m.id} href={`#/${m.id}`} className={m.id === active ? 'active' : ''}>
              {m.title}
            </a>
          ))}
        </nav>
        <div className="global-controls">
          <label>
            Tuning
            <select value={settings.tuningId} onChange={(e) => updateSettings({ tuningId: e.target.value })}>
              {TUNINGS.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </label>
          <label>
            Sound
            <select
              value={settings.instrument}
              onChange={(e) => updateSettings({ instrument: e.target.value as InstrumentId })}
            >
              {INSTRUMENTS.map((i) => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          </label>
          <span className={`audio-status status-${status}`} title="Audio loads on your first click">
            {status === 'idle' && 'audio: click to start'}
            {status === 'loading' && 'audio: loading…'}
            {status === 'ready' && 'audio: ready'}
            {status === 'error' && 'audio: failed to load'}
          </span>
        </div>
      </header>
      <main className="content">
        <Active settings={settings} updateSettings={updateSettings} />
      </main>
    </div>
  )
}
