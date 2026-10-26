import { player } from '../../audio/player'
import { closeVoicing, isDiatonic, type RealizedChord } from '../../theory'
import { navigate } from '../hashState'
import { ChordHover } from './ChordHover'

export interface BarGridProps {
  bars: RealizedChord[][]
  mode: 'major' | 'minor'
  /** Flattened chord index currently sounding, or null. */
  activeStep?: number | null
  /** Offset added to local indices to compare against activeStep (for multi-section views). */
  stepOffset?: number
  barsPerRow?: number
  compact?: boolean
}

/** Chords laid out in bars, four to a row like a chart. Click a chord to hear it; the small link opens shapes. */
export function BarGrid({ bars, mode, activeStep = null, stepOffset = 0, barsPerRow = 4, compact }: BarGridProps) {
  let step = stepOffset
  return (
    <div className={`bar-grid ${compact ? 'compact' : ''}`} style={{ gridTemplateColumns: `repeat(${barsPerRow}, minmax(0, 1fr))` }}>
      {bars.map((bar, bi) => (
        <div className="bar" key={bi}>
          {bar.map((c, ci) => {
            const idx = step++
            const borrowed = !isDiatonic(c.numeral, mode)
            return (
              <ChordHover key={ci} as="div" symbol={c.symbol} className={`chord-cell ${idx === activeStep ? 'active' : ''} ${borrowed ? 'borrowed' : ''}`}>
                <button className="chord-cell-btn" onClick={() => void player.strum(closeVoicing(c.symbol, 3), 0.03, 1.5)} title={borrowed ? 'outside the diatonic set' : undefined}>
                  <span className="numeral">{c.numeral}</span>
                  <span className="symbol">{c.symbol}</span>
                </button>
                {!compact && (
                  <a className="tiny-link" href="#" onClick={(e) => { e.preventDefault(); navigate('shapes', { root: c.root, suffix: c.suffix }) }}>shapes</a>
                )}
              </ChordHover>
            )
          })}
        </div>
      ))}
    </div>
  )
}
