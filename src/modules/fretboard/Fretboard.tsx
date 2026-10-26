import type { LabeledPosition, LabelMode, Tuning } from '../../theory'
import { colorFor } from '../../app/components/colors'

export interface FretboardProps {
  tuning: Tuning
  grid: LabeledPosition[][]
  labelMode: LabelMode
  /** When true, positions outside the overlay set are drawn faintly. */
  dimOthers: boolean
  leftHanded?: boolean
  onClick?: (pos: LabeledPosition) => void
  /** Positions drawn with a bright ring, keyed "string-fret" (e.g. the notes of a voicing). */
  emphasized?: Set<string>
}

const INLAYS = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24]

export function Fretboard({ tuning, grid, labelMode, dimOthers, leftHanded, onClick, emphasized }: FretboardProps) {
  const strings = tuning.strings.length
  const frets = grid[0].length - 1
  const left = 48
  const top = 26
  const fretW = 64
  const stringH = 34
  const nutW = 8
  const width = left + nutW + frets * fretW + 24
  const height = top + (strings - 1) * stringH + 40

  const mirror = (x: number) => (leftHanded ? width - x : x)
  const xOfFret = (f: number) => mirror(f === 0 ? left - 10 : left + nutW + (f - 0.5) * fretW)
  const xFretLine = (f: number) => mirror(left + nutW + f * fretW)
  const boardX = mirror(left)
  const boardX2 = mirror(left + nutW + frets * fretW)
  const yOfString = (s: number) => top + (strings - 1 - s) * stringH // low string at bottom

  return (
    <div className="fretboard-wrap">
      <svg
        className="fretboard"
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* board */}
        <rect x={Math.min(boardX, boardX2)} y={top - stringH / 2} width={nutW + frets * fretW} height={(strings - 1) * stringH + stringH} rx={4} fill="var(--wood)" />
        {/* nut */}
        <rect x={leftHanded ? boardX - nutW : boardX} y={top - stringH / 2} width={nutW} height={strings * stringH} fill="#d9d2c0" />
        {/* frets */}
        {Array.from({ length: frets }, (_, i) => i + 1).map((f) => (
          <line
            key={f}
            x1={xFretLine(f)}
            x2={xFretLine(f)}
            y1={top - stringH / 2}
            y2={top + (strings - 0.5) * stringH}
            stroke="var(--fret)"
            strokeWidth={2}
          />
        ))}
        {/* inlays */}
        {INLAYS.filter((f) => f <= frets).map((f) => {
          const x = xOfFret(f)
          const yMid = top + ((strings - 1) * stringH) / 2
          return f % 12 === 0 ? (
            <g key={f} fill="#5a5048">
              <circle cx={x} cy={yMid - stringH} r={5} />
              <circle cx={x} cy={yMid + stringH} r={5} />
            </g>
          ) : (
            <circle key={f} cx={x} cy={yMid} r={5} fill="#5a5048" />
          )
        })}
        {/* fret numbers */}
        {Array.from({ length: frets }, (_, i) => i + 1).map((f) => (
          <text
            key={f}
            x={xOfFret(f)}
            y={height - 8}
            textAnchor="middle"
            fontSize={11}
            fill="var(--muted)"
          >
            {f}
          </text>
        ))}
        {/* strings */}
        {tuning.strings.map((_, s) => (
          <line
            key={s}
            x1={Math.min(boardX, boardX2)}
            x2={Math.max(boardX, boardX2)}
            y1={yOfString(s)}
            y2={yOfString(s)}
            stroke="var(--string)"
            strokeWidth={1 + (strings - 1 - s) * 0.35}
          />
        ))}
        {/* open-string names */}
        {tuning.strings.map((n, s) => (
          <text key={s} x={mirror(12)} y={yOfString(s) + 4} fontSize={12} fill="var(--muted)" textAnchor="middle">
            {n.replace(/\d+$/, '')}
          </text>
        ))}
        {/* notes */}
        {grid.map((row) =>
          row.map((p) => {
            const emph = emphasized?.has(`${p.string}-${p.fret}`) ?? false
            const faint = dimOthers && !p.inSet && !emph
            const text = labelMode === 'names' ? p.name : (p.label ?? p.name)
            const fill = labelMode === 'names' && !p.isRoot ? (p.inSet ? 'var(--panel-2)' : 'var(--other)') : colorFor(p.label, p.isRoot)
            const textFill = labelMode === 'names' && !p.isRoot ? 'var(--text)' : '#111'
            return (
              <g
                key={`${p.string}-${p.fret}`}
                className="fret-dot"
                opacity={faint ? 0.18 : emphasized && !emph ? 0.45 : 1}
                onClick={() => onClick?.(p)}
              >
                <circle cx={xOfFret(p.fret)} cy={yOfString(p.string)} r={13} fill={fill} stroke={emph ? 'var(--accent)' : p.isRoot ? '#fff' : 'rgba(0,0,0,0.35)'} strokeWidth={emph ? 3 : p.isRoot ? 2 : 1} />
                <text x={xOfFret(p.fret)} y={yOfString(p.string) + 4} textAnchor="middle" fontSize={text.length > 2 ? 9.5 : 11} fill={textFill}>
                  {text}
                </text>
              </g>
            )
          }),
        )}
      </svg>
    </div>
  )
}
