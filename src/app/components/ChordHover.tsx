import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Chord } from 'tonal'
import { player } from '../../audio/player'
import { findLibraryShape } from '../../content/shapeLookup'
import { analyzeVoicing, shapeMidis, shapeToString, tuningById } from '../../theory'
import { loadSettings } from '../../store/settings'
import { navigate } from '../hashState'
import { ChordDiagram } from './ChordDiagram'
import { colorFor } from './colors'

export interface ChordHoverProps {
  symbol: string
  children: ReactNode
  /** Inline wrapper tag; defaults to span. */
  as?: 'span' | 'div'
  className?: string
}

const OPEN_DELAY = 220
const CLOSE_DELAY = 120

/**
 * Wraps anything that names a chord. Hovering shows a small card with the library's
 * reference shape for that chord (click it to hear it) and a link to more shapes.
 */
export function ChordHover({ symbol, children, as = 'span', className }: ChordHoverProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ x: number; y: number; above: boolean }>({ x: 0, y: 0, above: false })
  const anchor = useRef<HTMLElement | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }
  const show = () => {
    clear()
    timer.current = setTimeout(() => {
      const r = anchor.current?.getBoundingClientRect()
      if (!r) return
      const above = r.bottom + 260 > window.innerHeight && r.top > 260
      setPos({ x: Math.min(r.left, window.innerWidth - 240), y: above ? r.top : r.bottom, above })
      setOpen(true)
    }, OPEN_DELAY)
  }
  const hide = () => {
    clear()
    timer.current = setTimeout(() => setOpen(false), CLOSE_DELAY)
  }
  useEffect(() => clear, [])

  const Tag = as
  return (
    <>
      <Tag ref={anchor as never} className={className} onMouseEnter={show} onMouseLeave={hide} style={{ display: as === 'span' ? 'inline-block' : undefined }}>
        {children}
      </Tag>
      {open && createPortal(
        <div
          className="chord-hover-card"
          style={{ left: pos.x, top: pos.above ? undefined : pos.y + 6, bottom: pos.above ? window.innerHeight - pos.y + 6 : undefined }}
          onMouseEnter={clear}
          onMouseLeave={hide}
        >
          <HoverBody symbol={symbol} />
        </div>,
        document.body,
      )}
    </>
  )
}

function HoverBody({ symbol }: { symbol: string }) {
  const match = useMemo(() => findLibraryShape(symbol), [symbol])
  const tuning = tuningById(loadSettings().tuningId)
  const chord = Chord.get(symbol)
  const root = chord.tonic ?? undefined
  const suffix = match?.shape.suffix ?? chord.aliases[0] ?? ''

  if (!match) {
    return (
      <div className="hover-empty">
        <b>{symbol}</b>
        <span className="muted">{chord.empty ? 'unreadable symbol' : `${chord.notes.join(' ')} · no shape in the library yet`}</span>
        {!chord.empty && root && (
          <a href="#" className="tiny-link" onClick={(e) => { e.preventDefault(); navigate('shapes', { root }) }}>browse shapes for {root}</a>
        )}
      </div>
    )
  }

  const a = analyzeVoicing(tuning, match.frets, match.root)
  const dots = a.notes.map((n) => ({ string: n.string, label: n.label, isRoot: n.label === 'R', color: colorFor(n.label) }))
  return (
    <div className="hover-body">
      <ChordDiagram
        shape={match.frets} dots={dots} size={1.25} title={match.symbol}
        subtitle={match.shape.note ?? match.shape.tags.filter((t) => t !== 'jazz').join(' · ')}
        onClick={() => void player.strum(shapeMidis(tuning, match.frets))}
      />
      <div className="hover-meta">
        <code>{shapeToString(match.frets)}</code>
        <span className="muted">click to hear</span>
        <a href="#" className="tiny-link" onClick={(e) => { e.preventDefault(); navigate('shapes', { root: match.root, suffix }) }}>more shapes →</a>
      </div>
    </div>
  )
}
