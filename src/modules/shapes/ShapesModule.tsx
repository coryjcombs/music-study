import { useMemo, useState } from 'react'
import { player } from '../../audio/player'
import { ChordDiagram } from '../../app/components/ChordDiagram'
import { colorFor } from '../../app/components/colors'
import { navigate } from '../../app/hashState'
import type { ModuleProps } from '../../app/modules'
import { CHORD_SHAPES, SHAPE_TAGS, type ChordShape } from '../../content/shapes'
import {
  CHORD_TEMPLATES, ROOT_CHOICES, analyzeVoicing, chordSymbol, shapeMidis, shapeToString,
  transposeShape, tuningById, usesOpenStrings, type Shape,
} from '../../theory'

interface Card {
  shape: ChordShape
  frets: Shape
  symbol: string
}

export function ShapesModule({ settings }: ModuleProps) {
  const tuning = tuningById(settings.tuningId)
  const [root, setRoot] = useState('C')
  const [suffix, setSuffix] = useState<string>('any')
  const [tag, setTag] = useState<string>('any')

  const cards = useMemo<Card[]>(() => {
    const out: Card[] = []
    for (const s of CHORD_SHAPES) {
      if (suffix !== 'any' && s.suffix !== suffix) continue
      if (tag !== 'any' && !s.tags.includes(tag)) continue
      if (usesOpenStrings(s.frets)) {
        if (s.root !== root) continue
        out.push({ shape: s, frets: s.frets, symbol: s.symbol })
      } else {
        out.push({ shape: s, frets: transposeShape(s.frets, s.root, root), symbol: chordSymbol(root, s.suffix) })
      }
    }
    return out
  }, [root, suffix, tag])

  const suffixes = useMemo(() => {
    const used = new Set(CHORD_SHAPES.map((s) => s.suffix))
    return CHORD_TEMPLATES.filter((t) => used.has(t.suffix))
  }, [])

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
          Quality
          <select value={suffix} onChange={(e) => setSuffix(e.target.value)}>
            <option value="any">any</option>
            {suffixes.map((t) => <option key={t.suffix} value={t.suffix}>{root}{t.suffix} ({t.name})</option>)}
          </select>
        </label>
        <label>
          Family
          <select value={tag} onChange={(e) => setTag(e.target.value)}>
            <option value="any">any</option>
            {SHAPE_TAGS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </label>
        <span className="hint" style={{ margin: 0, alignSelf: 'center' }}>{cards.length} shapes. Click one to hear it; "analyze" opens it in Voicings.</span>
      </div>

      <div className="card-grid">
        {cards.map((c) => {
          const a = analyzeVoicing(tuning, c.frets, root)
          const dots = a.notes.map((n) => ({ string: n.string, label: n.label, isRoot: n.label === 'R', color: colorFor(n.label) }))
          return (
            <div key={c.shape.id} className="shape-card">
              <ChordDiagram
                shape={c.frets} dots={dots} size={1.35} title={c.symbol}
                subtitle={c.shape.tags.filter((t) => t !== 'jazz').map((t) => SHAPE_TAGS.find((x) => x.id === t)?.name ?? t).join(' · ')}
                onClick={() => void player.strum(shapeMidis(tuning, c.frets))}
              />
              <div className="shape-meta">
                <code>{shapeToString(c.frets)}</code>
                {c.shape.note && <span className="muted">{c.shape.note}</span>}
                <button className="small" onClick={() => navigate('voicings', { shape: shapeToString(c.frets), root })}>analyze</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
