import { useMemo, useState, type CSSProperties } from 'react'
import { player } from '../../audio/player'
import type { ModuleProps } from '../../app/modules'
import {
  CHORD_TEMPLATES, ROOT_CHOICES, SCALE_CHOICES, chordNotes, chordSymbol, fretboardGrid,
  functionLabel, scaleNotes, toMidi, tuningById, type LabelMode, type LabeledPosition,
} from '../../theory'
import { Fretboard } from './Fretboard'

type Overlay = 'none' | 'scale' | 'chord'

export function FretboardModule({ settings, updateSettings }: ModuleProps) {
  const tuning = tuningById(settings.tuningId)
  const [root, setRoot] = useState('C')
  const [overlay, setOverlay] = useState<Overlay>('scale')
  const [scaleId, setScaleId] = useState('major')
  const [chordSuffix, setChordSuffix] = useState('m9')
  const [labelMode, setLabelMode] = useState<LabelMode>('chord')
  const [dimOthers, setDimOthers] = useState(true)

  const set = useMemo(() => {
    try {
      if (overlay === 'scale') return scaleNotes(root, scaleId)
      if (overlay === 'chord') return chordNotes(chordSymbol(root, chordSuffix))
    } catch {
      /* fall through */
    }
    return undefined
  }, [overlay, root, scaleId, chordSuffix])

  const grid = useMemo(
    () => fretboardGrid({
      tuning, frets: settings.fretCount, root,
      set,
      labelMode: labelMode === 'degree' ? 'degree' : 'chord',
    }),
    [tuning, settings.fretCount, root, set, labelMode],
  )

  const onClick = (p: LabeledPosition) => void player.playNote(p.midi)

  const playSet = () => {
    if (!set) return
    // Walk the set upward from the root in the octave of the 5th-string region.
    const base = toMidi(root + '3')
    const midis = set.map((n) => {
      const m = toMidi(n + '3')
      return m < base ? m + 12 : m
    })
    void player.playSequence([...midis, base + 12], 0.28, 0.45)
  }

  const strumSet = () => {
    if (!set) return
    const base = toMidi(root + '3')
    const midis = set.map((n) => {
      const m = toMidi(n + '3')
      return m < base ? m + 12 : m
    })
    void player.strum(midis, 0.04, 2.2)
  }

  return (
    <div className="panel">
      <div className="controls">
        <label>
          Root
          <select value={root} onChange={(e) => setRoot(e.target.value)}>
            {ROOT_CHOICES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <label>
          Overlay
          <div className="seg-group">
            {(['none', 'scale', 'chord'] as Overlay[]).map((o) => (
              <button key={o} className={`seg ${overlay === o ? 'on' : ''}`} onClick={() => setOverlay(o)}>
                {o === 'none' ? 'All notes' : o === 'scale' ? 'Scale' : 'Chord'}
              </button>
            ))}
          </div>
        </label>
        {overlay === 'scale' && (
          <label>
            Scale
            <select value={scaleId} onChange={(e) => setScaleId(e.target.value)}>
              {SCALE_CHOICES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
        )}
        {overlay === 'chord' && (
          <label>
            Chord
            <select value={chordSuffix} onChange={(e) => setChordSuffix(e.target.value)}>
              {CHORD_TEMPLATES.map((t) => (
                <option key={t.suffix} value={t.suffix}>{root}{t.suffix} ({t.name})</option>
              ))}
            </select>
          </label>
        )}
        <label>
          Labels
          <div className="seg-group">
            <button className={`seg ${labelMode === 'names' ? 'on' : ''}`} onClick={() => setLabelMode('names')}>Note names</button>
            <button className={`seg ${labelMode === 'chord' ? 'on' : ''}`} onClick={() => setLabelMode('chord')}>Chord functions</button>
            <button className={`seg ${labelMode === 'degree' ? 'on' : ''}`} onClick={() => setLabelMode('degree')}>Scale degrees</button>
          </div>
        </label>
        <label>
          Frets
          <input
            type="number" min={5} max={24} value={settings.fretCount}
            onChange={(e) => updateSettings({ fretCount: Math.max(5, Math.min(24, Number(e.target.value) || 12)) })}
            style={{ width: 64 }}
          />
        </label>
        <label>
          Show
          <div className="seg-group">
            <button className={`seg ${dimOthers ? 'on' : ''}`} onClick={() => setDimOthers(true)}>Overlay only</button>
            <button className={`seg ${!dimOthers ? 'on' : ''}`} onClick={() => setDimOthers(false)}>Everything</button>
          </div>
        </label>
        <label>
          Hand
          <div className="seg-group">
            <button className={`seg ${!settings.leftHanded ? 'on' : ''}`} onClick={() => updateSettings({ leftHanded: false })}>Right</button>
            <button className={`seg ${settings.leftHanded ? 'on' : ''}`} onClick={() => updateSettings({ leftHanded: true })}>Left</button>
          </div>
        </label>
        {set && (
          <label>
            Hear
            <div className="seg-group">
              <button className="seg" onClick={playSet}>{overlay === 'scale' ? 'Play scale' : 'Arpeggiate'}</button>
              {overlay === 'chord' && <button className="seg" onClick={strumSet}>Strum</button>}
            </div>
          </label>
        )}
      </div>

      <Fretboard
        tuning={tuning}
        grid={grid}
        labelMode={labelMode}
        dimOthers={dimOthers && overlay !== 'none'}
        leftHanded={settings.leftHanded}
        onClick={onClick}
      />

      {set && (
        <div className="notes-row">
          {set.map((n) => (
            <span className="chip" key={n}>
              <b>{n}</b>&nbsp;{functionLabel(root, n, labelMode === 'degree' ? 'degree' : 'chord')}
            </span>
          ))}
        </div>
      )}
      <div className="legend">
        <span style={{ '--c': 'var(--root)' } as CSSProperties}>root</span>
        <span style={{ '--c': 'var(--third)' } as CSSProperties}>thirds</span>
        <span style={{ '--c': 'var(--fifth)' } as CSSProperties}>fifths</span>
        <span style={{ '--c': 'var(--seventh)' } as CSSProperties}>sevenths</span>
        <span style={{ '--c': 'var(--ext)' } as CSSProperties}>extensions and other degrees</span>
      </div>
      <p className="hint">Click any note to hear it. Labels follow the spelling of the current scale or chord, so the same fret reads Eb in C minor and D# in B major.</p>
    </div>
  )
}
