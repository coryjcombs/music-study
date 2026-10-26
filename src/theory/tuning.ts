import type { Tuning } from './types'

/** Tunings are data. Strings run low to high, so index 0 is the 6th string. */
export const TUNINGS: Tuning[] = [
  { id: 'standard', name: 'Standard (E A D G B E)', strings: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
  { id: 'drop-d', name: 'Drop D (D A D G B E)', strings: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
  { id: 'dadgad', name: 'DADGAD', strings: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'] },
  { id: 'eb-standard', name: 'Eb Standard', strings: ['Eb2', 'Ab2', 'Db3', 'Gb3', 'Bb3', 'Eb4'] },
  { id: 'open-g', name: 'Open G (D G D G B D)', strings: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'] },
]

export const STANDARD = TUNINGS[0]

export function tuningById(id: string): Tuning {
  return TUNINGS.find((t) => t.id === id) ?? STANDARD
}
