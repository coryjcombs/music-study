import { Scale } from 'tonal'
import type { NoteName } from './types'

/** Scales offered in the UI, in the order shown. Names are tonal scale names. */
export const SCALE_CHOICES: { id: string; name: string }[] = [
  { id: 'major', name: 'Major (Ionian)' },
  { id: 'dorian', name: 'Dorian' },
  { id: 'phrygian', name: 'Phrygian' },
  { id: 'lydian', name: 'Lydian' },
  { id: 'mixolydian', name: 'Mixolydian' },
  { id: 'minor', name: 'Natural minor (Aeolian)' },
  { id: 'locrian', name: 'Locrian' },
  { id: 'harmonic minor', name: 'Harmonic minor' },
  { id: 'melodic minor', name: 'Melodic minor' },
  { id: 'major pentatonic', name: 'Major pentatonic' },
  { id: 'minor pentatonic', name: 'Minor pentatonic' },
  { id: 'blues', name: 'Blues' },
  { id: 'altered', name: 'Altered (super Locrian)' },
  { id: 'lydian dominant', name: 'Lydian dominant' },
  { id: 'half-whole diminished', name: 'Half-whole diminished' },
  { id: 'whole tone', name: 'Whole tone' },
]

/** Spelled notes of a scale, e.g. scaleNotes("Eb", "major") -> Eb F G Ab Bb C D. */
export function scaleNotes(root: NoteName, scaleId: string): NoteName[] {
  const s = Scale.get(`${root} ${scaleId}`)
  if (s.empty) throw new Error(`Unknown scale "${scaleId}"`)
  return s.notes
}

export function scaleIntervals(scaleId: string): string[] {
  return Scale.get(`C ${scaleId}`).intervals
}
