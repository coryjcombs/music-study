import { useMemo, useState } from 'react'
import { player } from '../../audio/player'
import type { ModuleProps } from '../../app/modules'
import {
  CIRCLE_ALT, CIRCLE_MAJOR, CIRCLE_MINOR, closeVoicing, keyInfo, keysContaining, scaleRun, type Mode,
} from '../../theory'

const R_OUTER = 170
const R_INNER = 112
const CX = 200
const CY = 200

function polar(i: number, r: number) {
  const a = ((i * 30 - 90) * Math.PI) / 180
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
}

export function CircleModule({ settings: _settings }: ModuleProps) {
  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState<Mode>('major')
  const [hoverChord, setHoverChord] = useState<string | null>(null)

  const tonic = mode === 'major' ? CIRCLE_MAJOR[index] : CIRCLE_MINOR[index]
  const key = useMemo(() => keyInfo(tonic, mode), [tonic, mode])

  // Keys lit up when hovering a chord: everywhere it is diatonic.
  const lit = useMemo(() => {
    if (!hoverChord) return null
    const hits = keysContaining(hoverChord)
    const m = new Map<string, string>()
    for (const h of hits) m.set(`${h.mode}:${h.tonic}`, h.numeral)
    return m
  }, [hoverChord])

  const neighbours = {
    dominant: (index + 1) % 12,
    subdominant: (index + 11) % 12,
  }

  const playChord = (symbol: string) => void player.strum(closeVoicing(symbol, 3), 0.03, 1.6)
  const playScale = () => void player.playSequence(scaleRun(key.scale, 3), 0.26, 0.4)

  const slot = (i: number, ring: 'major' | 'minor') => {
    const name = ring === 'major' ? CIRCLE_MAJOR[i] : CIRCLE_MINOR[i]
    const r = ring === 'major' ? R_OUTER : R_INNER
    const { x, y } = polar(i, r)
    const selected = ring === mode && i === index
    const isRelative = ring !== mode && i === index
    const isNeighbour = ring === mode && (i === neighbours.dominant || i === neighbours.subdominant)
    const litNumeral = lit?.get(`${ring}:${name}`)
    const dim = lit ? !litNumeral : false
    const alt = ring === 'major' ? CIRCLE_ALT[name] : undefined
    const label = ring === 'minor' ? `${name}m` : name
    return (
      <g
        key={`${ring}-${i}`}
        className="circle-slot"
        onClick={() => { setIndex(i); setMode(ring) }}
        opacity={dim ? 0.25 : 1}
      >
        <circle
          cx={x} cy={y} r={ring === 'major' ? 24 : 19}
          fill={selected ? 'var(--accent)' : litNumeral ? 'var(--third)' : isRelative ? 'var(--panel-2)' : 'var(--panel)'}
          stroke={selected ? 'var(--accent)' : isNeighbour || isRelative ? 'var(--accent)' : 'var(--border)'}
          strokeWidth={isNeighbour || isRelative ? 2 : 1}
        />
        <text x={x} y={y + (alt ? 1 : 5)} textAnchor="middle" fontSize={ring === 'major' ? 15 : 12} fontWeight={600} fill={selected || litNumeral ? '#111' : 'var(--text)'}>
          {litNumeral && !selected ? litNumeral : label}
        </text>
        {alt && !litNumeral && (
          <text x={x} y={y + 13} textAnchor="middle" fontSize={9} fill={selected ? '#333' : 'var(--muted)'}>{alt}</text>
        )}
      </g>
    )
  }

  const sigText = key.accidentals === 0
    ? 'no sharps or flats'
    : `${key.accidentals} ${key.signature.startsWith('b') ? 'flat' : 'sharp'}${key.accidentals > 1 ? 's' : ''}: ${key.accidentalNames.join(' ')}`

  return (
    <div className="two-col">
      <div className="panel circle-panel">
        <svg viewBox="0 0 400 400" className="circle">
          <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="var(--border)" />
          <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="var(--border)" />
          {/* signature counts between rings */}
          {CIRCLE_MAJOR.map((_, i) => {
            const { x, y } = polar(i, (R_OUTER + R_INNER) / 2)
            const n = i <= 6 ? i : 12 - i
            const txt = n === 0 ? '' : i <= 6 ? `${n}♯` : `${n}♭`
            return <text key={i} x={x} y={y + 3} textAnchor="middle" fontSize={9} fill="var(--muted)">{txt}</text>
          })}
          {CIRCLE_MAJOR.map((_, i) => slot(i, 'major'))}
          {CIRCLE_MINOR.map((_, i) => slot(i, 'minor'))}
          <text x={CX} y={CY - 6} textAnchor="middle" fontSize={11} fill="var(--muted)">outer: major</text>
          <text x={CX} y={CY + 10} textAnchor="middle" fontSize={11} fill="var(--muted)">inner: relative minor</text>
        </svg>
        <p className="hint">Clockwise adds a sharp (or removes a flat). Each key's dominant is one step clockwise, its subdominant one step counter-clockwise. Hover a chord on the right to see every key it belongs to.</p>
      </div>

      <div className="panel">
        <h2 className="chord-title">{key.tonic} {key.mode}</h2>
        <p className="muted">{sigText}</p>
        <div className="controls" style={{ marginTop: 8 }}>
          <button onClick={playScale}>Play scale</button>
          <button onClick={() => setMode(key.relativeMode)}>
            Relative {key.relativeMode}: {key.relative}
          </button>
          <button onClick={() => { setMode(mode === 'major' ? 'minor' : 'major'); setIndex(parallelIndex(key.tonic, mode === 'major' ? 'minor' : 'major')) }}>
            Parallel {mode === 'major' ? 'minor' : 'major'}: {key.tonic}
          </button>
        </div>

        <div className="notes-row">
          {key.scale.map((n, i) => <span className="chip" key={n}><b>{n}</b>&nbsp;<span className="muted">{i + 1}</span></span>)}
        </div>

        <h3 className="section">Diatonic chords</h3>
        <table className="chord-table">
          <thead><tr>{key.numerals.map((n) => <th key={n}>{n}</th>)}</tr></thead>
          <tbody>
            <tr>
              {key.triads.map((c) => (
                <td key={c}><button className="chord-btn" onClick={() => playChord(c)} onMouseEnter={() => setHoverChord(c)} onMouseLeave={() => setHoverChord(null)}>{c}</button></td>
              ))}
            </tr>
            <tr>
              {key.chords.map((c) => (
                <td key={c}><button className="chord-btn" onClick={() => playChord(c)} onMouseEnter={() => setHoverChord(c)} onMouseLeave={() => setHoverChord(null)}>{c}</button></td>
              ))}
            </tr>
          </tbody>
        </table>
        {key.harmonicChords && key.harmonicNumerals && (
          <>
            <h3 className="section">From harmonic minor</h3>
            <p className="muted" style={{ marginTop: 0 }}>Raising the 7th gives the V7 that pulls home, and the vii°7.</p>
            <table className="chord-table">
              <thead><tr>{key.harmonicNumerals.map((n) => <th key={n}>{n}</th>)}</tr></thead>
              <tbody>
                <tr>
                  {key.harmonicChords.map((c) => (
                    <td key={c}><button className="chord-btn" onClick={() => playChord(c)} onMouseEnter={() => setHoverChord(c)} onMouseLeave={() => setHoverChord(null)}>{c}</button></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </>
        )}
        <p className="hint">Click a chord to hear it. Hover to light up every key where it is diatonic, with its numeral there: that shared ground is where modulations and borrowed chords come from.</p>
      </div>
    </div>
  )
}

function parallelIndex(tonic: string, mode: Mode): number {
  const ring = mode === 'major' ? CIRCLE_MAJOR : CIRCLE_MINOR
  const i = ring.indexOf(tonic)
  if (i >= 0) return i
  // Enharmonic fallback by pitch class.
  const chroma = (n: string) => {
    const base: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
    let c = base[n[0]]
    for (const ch of n.slice(1)) c += ch === '#' ? 1 : -1
    return ((c % 12) + 12) % 12
  }
  return ring.findIndex((n) => chroma(n) === chroma(tonic))
}
