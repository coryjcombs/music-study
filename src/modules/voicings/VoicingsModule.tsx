import { useEffect, useMemo, useState } from 'react'
import { player } from '../../audio/player'
import { ChordDiagram } from '../../app/components/ChordDiagram'
import { colorFor } from '../../app/components/colors'
import { parseHash } from '../../app/hashState'
import type { ModuleProps } from '../../app/modules'
import {
  LABEL_DESCRIPTIONS, ROOT_CHOICES, analyzeVoicing, fretboardGrid, keysContaining, parseShape,
  shapeMidis, shapeToString, tuningById, type LabeledPosition, type Shape,
} from '../../theory'
import { Fretboard } from '../fretboard/Fretboard'

const EMPTY: Shape = [null, null, null, null, null, null]

export function VoicingsModule({ settings }: ModuleProps) {
  const tuning = tuningById(settings.tuningId)
  const initial = parseHash().params
  const [text, setText] = useState(initial.get('shape') ?? 'x3133x')
  const [shape, setShape] = useState<Shape>(() => safeParse(initial.get('shape') ?? 'x3133x'))
  const [root, setRoot] = useState(initial.get('root') ?? '')

  // Follow links from the shape library.
  useEffect(() => {
    const onHash = () => {
      const p = parseHash()
      if (p.module !== 'voicings') return
      const s = p.params.get('shape')
      if (s) {
        setText(s)
        setShape(safeParse(s))
        setRoot(p.params.get('root') ?? '')
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const analysis = useMemo(() => analyzeVoicing(tuning, shape, root || undefined), [tuning, shape, root])
  const best = analysis.best
  const keys = useMemo(() => (best ? keysContaining(best.symbol) : []), [best])

  const dots = analysis.notes.map((n) => ({
    string: n.string, label: n.label, isRoot: n.label === 'R', color: colorFor(n.label),
  }))

  const grid = useMemo(
    () => fretboardGrid({
      tuning, frets: settings.fretCount, root: analysis.root ?? undefined,
      set: best ? analysis.notes.map((n) => n.pitchClass) : undefined,
    }),
    [tuning, settings.fretCount, analysis, best],
  )
  const played = new Set(analysis.notes.map((n) => `${n.string}-${n.fret}`))

  const commitText = (t: string) => {
    setText(t)
    setShape(safeParse(t))
  }

  const toggleFret = (p: LabeledPosition) => {
    const next = [...shape]
    const muting = next[p.string] === p.fret
    next[p.string] = muting ? null : p.fret
    setShape(next)
    setText(shapeToString(next))
    if (!muting) void player.playNote(p.midi)
  }

  const strum = () => void player.strum(shapeMidis(tuning, shape))
  const arpeggiate = () => void player.playSequence(shapeMidis(tuning, shape), 0.3, 0.6)

  return (
    <div className="two-col">
      <div className="panel">
        <div className="controls">
          <label>
            Shape (low to high)
            <input
              type="text" value={text} onChange={(e) => commitText(e.target.value)}
              placeholder="x3133x or x 10 8 10 10 x" style={{ width: 200, fontFamily: 'ui-monospace, monospace' }}
            />
          </label>
          <label>
            Read it over root
            <select value={root} onChange={(e) => setRoot(e.target.value)}>
              <option value="">auto</option>
              {ROOT_CHOICES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <label>
            Hear
            <div className="seg-group">
              <button className="seg" onClick={strum} disabled={!analysis.notes.length}>Strum</button>
              <button className="seg" onClick={arpeggiate} disabled={!analysis.notes.length}>Arpeggiate</button>
            </div>
          </label>
          <button onClick={() => { setShape(EMPTY); setText('xxxxxx') }}>Clear</button>
        </div>

        <div className="analysis">
          <ChordDiagram
            shape={shape} dots={dots} size={2.2}
            stringNames={tuning.strings.map((s) => s.replace(/\d+$/, ''))}
            title={best ? best.symbol : analysis.notes.length ? '?' : ''}
            subtitle={best ? best.name : undefined}
            onClick={analysis.notes.length ? strum : undefined}
          />
          <div className="analysis-text">
            {best ? (
              <>
                <h2 className="chord-title">
                  {best.symbol}
                  {analysis.isInversion && analysis.bassNote && <span className="muted"> / {analysis.bassNote} in the bass</span>}
                </h2>
                <p className="muted">{best.name}{best.rootImplied ? ', root not played' : ''}</p>
                <table className="note-table">
                  <thead><tr><th>String</th><th>Fret</th><th>Note</th><th>Function</th></tr></thead>
                  <tbody>
                    {[...analysis.notes].reverse().map((n) => (
                      <tr key={n.string}>
                        <td>{6 - n.string}</td>
                        <td>{n.fret}</td>
                        <td>{n.note}</td>
                        <td><span className="fn-chip" style={{ background: colorFor(n.label) }}>{n.label}</span> <span className="muted">{LABEL_DESCRIPTIONS[n.label] ?? ''}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(analysis.missing.length > 0 || analysis.doubled.length > 0) && (
                  <p className="muted">
                    {analysis.missing.length > 0 && <>Omitted: {analysis.missing.join(', ')}. </>}
                    {analysis.doubled.length > 0 && <>Doubled: {analysis.doubled.join(', ')}.</>}
                  </p>
                )}
                {analysis.candidates.length > 1 && (
                  <p className="muted">
                    Other readings: {analysis.candidates.slice(1, 5).map((c) => c.symbol).join(', ')}
                  </p>
                )}
                {keys.length > 0 && (
                  <p className="muted">
                    Diatonic in: {keys.map((k) => `${k.tonic} ${k.mode} (${k.numeral})`).join(', ')}
                  </p>
                )}
              </>
            ) : (
              <p className="muted">Type a shape, or click frets on the fretboard below. Use x for a muted string and 0 for open.</p>
            )}
          </div>
        </div>
      </div>

      <div className="panel">
        <p className="hint" style={{ marginTop: 0, marginBottom: 10 }}>
          Click a fret to set that string and hear the note; click it again to mute. Click the chord chart to strum. Faint notes show where the chord's other tones live.
        </p>
        <Fretboard
          tuning={tuning} grid={grid} labelMode={analysis.root ? 'chord' : 'names'}
          dimOthers={!!best} leftHanded={settings.leftHanded}
          onClick={toggleFret}
          emphasized={played}
        />
      </div>
    </div>
  )
}

function safeParse(t: string): Shape {
  try {
    const s = parseShape(t)
    if (s.length !== 6 || s.some((f) => f != null && (Number.isNaN(f) || f < 0))) return EMPTY
    return s
  } catch {
    return EMPTY
  }
}
