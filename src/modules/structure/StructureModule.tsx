import { useEffect, useMemo, useState } from 'react'
import { player } from '../../audio/player'
import { usePhone } from '../../app/phone'
import { useTransport } from '../../audio/useStep'
import { BarGrid } from '../../app/components/BarGrid'
import { SONG_FORMS, type FormSection, type SongForm } from '../../content/forms'
import { CIRCLE_MAJOR, CIRCLE_MINOR, closeVoicing, realizeBars, type RealizedChord } from '../../theory'

interface TimelineItem {
  section: FormSection
  bars: RealizedChord[][]
  /** Flattened chord index of the first chord, for playback highlighting. */
  offset: number
  barStart: number
}

/** Expand repeats and realize every bar in the key. */
function buildTimeline(form: SongForm, key: string): TimelineItem[] {
  const out: TimelineItem[] = []
  let offset = 0
  let barStart = 0
  for (const section of form.sections) {
    for (let r = 0; r < (section.repeat ?? 1); r++) {
      const bars = realizeBars(section.bars, key)
      out.push({ section, bars, offset, barStart })
      offset += bars.reduce((n, b) => n + b.length, 0)
      barStart += bars.length
    }
  }
  return out
}

const SECTION_COLORS: Record<string, string> = {
  Verse: 'var(--third)', 'Pre-chorus': 'var(--ext)', Chorus: 'var(--root)', Bridge: 'var(--seventh)',
  Outro: 'var(--fifth)', Intro: 'var(--fifth)', A: 'var(--third)', B: 'var(--seventh)', Chorus_: 'var(--root)',
}
const colorFor = (name: string) => SECTION_COLORS[name] ?? 'var(--other)'

export function StructureModule() {
  const phone = usePhone()
  const [formId, setFormId] = useState(SONG_FORMS[0].id)
  // Key and tempo are remembered per form for the session.
  const [choices, setChoices] = useState<Record<string, { tonic?: string; bpm?: number }>>({})
  const remember = (id: string, patch: { tonic?: string; bpm?: number }) =>
    setChoices((c) => ({ ...c, [id]: { ...c[id], ...patch } }))
  const [open, setOpen] = useState<number | null>(0)
  const transport = useTransport()
  const step = transport.step

  useEffect(() => () => player.cancelSequence(), [])

  const form = SONG_FORMS.find((f) => f.id === formId) ?? SONG_FORMS[0]
  const key = choices[form.id]?.tonic ?? form.tonic
  const tempo = choices[form.id]?.bpm ?? form.bpm

  const timeline = useMemo(() => buildTimeline(form, key), [form, key])

  const totalBars = timeline.reduce((n, t) => n + t.bars.length, 0)

  // The whole form is one sequence; playing from a section starts at that section's first chord.
  const play = (fromItem = 0) => {
    const steps = timeline.flatMap((t) => t.bars.flatMap((bar) => bar.map((c) => ({ midis: closeVoicing(c.symbol, 3), beats: 4 / bar.length }))))
    void player.playSteps(steps, tempo, false, 0, timeline[fromItem]?.offset ?? 0)
  }

  const tonics = form.mode === 'major' ? CIRCLE_MAJOR : CIRCLE_MINOR
  const activeItem = step == null ? null : timeline.findIndex((t, i) => step >= t.offset && (i === timeline.length - 1 || step < timeline[i + 1].offset))

  return (
    <div className="panel">
      <div className="controls">
        <label>
          Form
          <select value={form.id} onChange={(e) => { player.cancelSequence(); setFormId(e.target.value); setOpen(0) }}>
            {SONG_FORMS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </label>
        <label>
          Key
          <select value={key} onChange={(e) => remember(form.id, { tonic: e.target.value })}>
            {tonics.map((t) => <option key={t} value={t}>{t} {form.mode}</option>)}
          </select>
        </label>
        <label>
          Tempo
          <input type="number" min={40} max={240} value={tempo} onChange={(e) => remember(form.id, { bpm: Number(e.target.value) || 100 })} style={{ width: 70 }} />
        </label>
        <div className="seg-group">
          <button className="seg primary" onClick={() => play(open ?? 0)}>{open != null && open > 0 ? `Play from ${timeline[open]?.section.name}` : 'Play all'}</button>
          <button className="seg" onClick={() => player.togglePause()} disabled={transport.status === 'stopped'}>
            {transport.status === 'paused' ? 'Resume' : 'Pause'}
          </button>
          <button className="seg" onClick={() => player.stopAll()} disabled={transport.status === 'stopped'}>Stop</button>
        </div>
      </div>
      <p className="muted" style={{ marginTop: 0 }}>{form.description} {totalBars} bars.</p>

      {/* timeline: one block per section occurrence, width by bar count */}
      <div className="timeline">
        {timeline.map((t, i) => (
          <div
            key={i}
            className={`timeline-block ${open === i ? 'open' : ''} ${activeItem === i ? 'playing' : ''} ${transport.status === 'paused' && activeItem === i ? 'paused' : ''}`}
            style={{ flex: t.bars.length, background: colorFor(t.section.name) }}
            onClick={() => setOpen(open === i ? null : i)}
            title={`${t.section.name}: bars ${t.barStart + 1}–${t.barStart + t.bars.length}`}
          >
            <span className="timeline-name">{t.section.name}</span>
            <span className="timeline-bars">{t.bars.length}</span>
          </div>
        ))}
      </div>
      <div className="timeline-ruler">
        {timeline.map((t, i) => <span key={i} style={{ flex: t.bars.length }}>{t.barStart + 1}</span>)}
      </div>

      {open != null && timeline[open] && (
        <div className="section-detail">
          <div className="section-head">
            <h3 className="section" style={{ margin: 0 }}>
              <span className="swatch" style={{ background: colorFor(timeline[open].section.name) }} />
              {timeline[open].section.name}
              <span className="muted"> · bars {timeline[open].barStart + 1}–{timeline[open].barStart + timeline[open].bars.length}</span>
            </h3>
            <button className="small" onClick={() => play(open)}>Play from here</button>
          </div>
          {timeline[open].section.note && <p className="muted" style={{ margin: '4px 0 8px' }}>{timeline[open].section.note}</p>}
          <BarGrid bars={timeline[open].bars} mode={form.mode} activeStep={step} stepOffset={timeline[open].offset} compact />
        </div>
      )}

      <h3 className="section">Whole form</h3>
      <div className="form-overview">
        {timeline.map((t, i) => (
          <div key={i} className="form-row">
            <div className="form-row-label" style={{ borderColor: colorFor(t.section.name) }}>{t.section.name}</div>
            <BarGrid bars={t.bars} mode={form.mode} activeStep={step} stepOffset={t.offset} barsPerRow={Math.min(phone ? 4 : 8, t.bars.length)} compact />
          </div>
        ))}
      </div>
      <p className="hint">Each block is a section; its width is its length in bars. Click a block to select it, then Play from here (or the main Play button) starts there and continues to the end. Pause holds the current chord; Resume continues from it. Click any chord to hear it on its own.</p>
    </div>
  )
}
