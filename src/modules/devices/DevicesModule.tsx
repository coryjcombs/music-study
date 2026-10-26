import { useEffect, useState } from 'react'
import { navigate, parseHash } from '../../app/hashState'
import { DEVICES } from '../../content/devices'
import { PROGRESSIONS } from '../../content/progressions'

export function DevicesModule() {
  const [selectedId, setSelectedId] = useState(parseHash().params.get('id') ?? DEVICES[0].id)

  useEffect(() => {
    const onHash = () => {
      const p = parseHash()
      if (p.module === 'devices' && p.params.get('id')) setSelectedId(p.params.get('id')!)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const device = DEVICES.find((d) => d.id === selectedId) ?? DEVICES[0]
  const uses = PROGRESSIONS.filter((p) => p.devices.includes(device.id))

  return (
    <div className="catalog-layout">
      <aside className="panel catalog-list">
        <ul className="entry-list">
          {DEVICES.map((d) => (
            <li key={d.id} className={d.id === device.id ? 'active' : ''} onClick={() => setSelectedId(d.id)}>
              <div className="entry-name">{d.name}</div>
              <div className="entry-sub">{d.summary}</div>
            </li>
          ))}
        </ul>
      </aside>
      <section className="panel">
        <h2 className="chord-title">{device.name}</h2>
        <p className="muted" style={{ marginTop: 4 }}>{device.summary}</p>
        {device.body.map((p, i) => <p key={i} className="prose">{p}</p>)}
        {device.tips && (
          <>
            <h3 className="section">Try</h3>
            <ul className="examples">{device.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
          </>
        )}
        <h3 className="section">Progressions that use it</h3>
        <div className="notes-row" style={{ marginTop: 4 }}>
          {uses.map((p) => (
            <a key={p.id} className="chip link-chip" href="#" onClick={(e) => { e.preventDefault(); navigate('progressions', { id: p.id }) }}>{p.name}</a>
          ))}
          {uses.length === 0 && <span className="muted">none yet</span>}
        </div>
      </section>
    </div>
  )
}
