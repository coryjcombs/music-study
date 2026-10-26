/** Color for a chord-function or scale-degree label. Shared by the fretboard and chord diagrams. */
export function colorFor(label: string | null | undefined, isRoot = false): string {
  if (isRoot || label === 'R' || label === '1') return 'var(--root)'
  if (!label) return 'var(--other)'
  if (/3$/.test(label)) return 'var(--third)'
  if (/5$/.test(label)) return 'var(--fifth)'
  if (/7$/.test(label)) return 'var(--seventh)'
  if (/^(b?b?9|#9|11|#11|b13|13|2|#2|b2|4|#4|6|b6|#6)$/.test(label)) return 'var(--ext)'
  return 'var(--other)'
}
