import type { Shape } from '../../theory'

export interface DiagramDot {
  string: number
  label: string
  isRoot?: boolean
  color?: string
}

export interface ChordDiagramProps {
  shape: Shape
  /** One entry per sounding string, in any order. Labels drawn inside the dots. */
  dots?: DiagramDot[]
  /** Open-string names low to high, drawn under the diagram. */
  stringNames?: string[]
  title?: string
  subtitle?: string
  size?: number
  onClick?: () => void
  selected?: boolean
}

/** Vertical chord chart, like a songbook: strings as columns (low on the left), frets as rows. */
export function ChordDiagram({ shape, dots = [], stringNames, title, subtitle, size = 1, onClick, selected }: ChordDiagramProps) {
  const strings = shape.length
  const fretted = shape.filter((f): f is number => f != null && f > 0)
  const minFret = fretted.length ? Math.min(...fretted) : 1
  const maxFret = fretted.length ? Math.max(...fretted) : 1
  const span = Math.max(4, maxFret - minFret + 1)
  const startFret = maxFret <= span ? 1 : minFret
  const atNut = startFret === 1

  const colW = 22 * size
  const rowH = 24 * size
  const padL = 26 * size
  const padT = (subtitle ? 46 : title ? 36 : 22) * size
  const w = padL + colW * (strings - 1) + 18 * size
  const h = padT + rowH * span + 22 * size
  const xOf = (s: number) => padL + s * colW
  const yOf = (f: number) => padT + (f - startFret + 0.5) * rowH

  const byString = new Map(dots.map((d) => [d.string, d]))

  return (
    <svg
      className={`chord-diagram ${onClick ? 'clickable' : ''} ${selected ? 'selected' : ''}`}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {title && (
        <text x={w / 2} y={12 * size} textAnchor="middle" fontSize={12 * size} fontWeight={600} fill="var(--text)">{title}</text>
      )}
      {subtitle && (
        <text x={w / 2} y={23 * size} textAnchor="middle" fontSize={9 * size} fill="var(--muted)">{subtitle}</text>
      )}
      {/* nut or position marker */}
      {atNut ? (
        <rect x={xOf(0) - 1} y={padT - 2.5 * size} width={colW * (strings - 1) + 2} height={3 * size} fill="var(--text)" />
      ) : (
        <text x={padL - 10 * size} y={yOf(startFret) + 4 * size} fontSize={10 * size} fill="var(--muted)" textAnchor="end">{startFret}</text>
      )}
      {/* frets */}
      {Array.from({ length: span + 1 }, (_, i) => (
        <line key={i} x1={xOf(0)} x2={xOf(strings - 1)} y1={padT + i * rowH} y2={padT + i * rowH} stroke="var(--border)" strokeWidth={1} />
      ))}
      {/* strings */}
      {Array.from({ length: strings }, (_, s) => (
        <line key={s} x1={xOf(s)} x2={xOf(s)} y1={padT} y2={padT + span * rowH} stroke="var(--string)" strokeWidth={1} />
      ))}
      {/* muted / open markers */}
      {shape.map((f, s) => {
        if (f === null) return <text key={s} x={xOf(s)} y={padT - 6 * size} textAnchor="middle" fontSize={11 * size} fill="var(--muted)">×</text>
        if (f === 0) {
          const d = byString.get(s)
          return (
            <g key={s}>
              <circle cx={xOf(s)} cy={padT - 9 * size} r={7 * size} fill={d?.color ?? 'none'} stroke={d?.isRoot ? '#fff' : 'var(--muted)'} strokeWidth={d?.isRoot ? 1.5 : 1} />
              {d && <text x={xOf(s)} y={padT - 9 * size + 3 * size} textAnchor="middle" fontSize={(d.label.length > 2 ? 6.5 : 8) * size} fontWeight={600} fill="#111">{d.label}</text>}
            </g>
          )
        }
        return null
      })}
      {/* fretted dots */}
      {shape.map((f, s) => {
        if (f == null || f === 0) return null
        const d = byString.get(s)
        return (
          <g key={s}>
            <circle cx={xOf(s)} cy={yOf(f)} r={8.5 * size} fill={d?.color ?? 'var(--text)'} stroke={d?.isRoot ? '#fff' : 'none'} strokeWidth={1.5} />
            {d && <text x={xOf(s)} y={yOf(f) + 3 * size} textAnchor="middle" fontSize={(d.label.length > 2 ? 6.5 : 8.5) * size} fontWeight={600} fill="#111">{d.label}</text>}
          </g>
        )
      })}
      {/* string names */}
      {stringNames?.map((n, s) => (
        <text key={s} x={xOf(s)} y={h - 6 * size} textAnchor="middle" fontSize={9 * size} fill="var(--muted)">{n}</text>
      ))}
    </svg>
  )
}
