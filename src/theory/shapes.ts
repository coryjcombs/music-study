import { Note } from 'tonal'
import { midiAt } from './fretboard'
import type { Midi, NoteName, Shape, Tuning } from './types'

/** Semitone shift that moves a shape rooted on `from` to `to`, keeping frets in a playable range. */
export function transposeShape(shape: Shape, from: NoteName, to: NoteName, maxFret = 15): Shape {
  const fretted = shape.filter((f): f is number => f != null && f > 0)
  if (fretted.length === 0) return shape
  const diff = (((Note.get(to).chroma! - Note.get(from).chroma!) % 12) + 12) % 12
  const lowest = Math.min(...fretted)
  const highest = Math.max(...fretted)
  let shift = diff
  // Prefer the lowest position where every fretted note stays at or above fret 1.
  if (lowest + shift > 12 && highest + shift - 12 <= maxFret && lowest + shift - 12 >= 1) shift -= 12
  if (highest + shift > maxFret && lowest + shift - 12 >= 1) shift -= 12
  return shape.map((f) => (f == null || f === 0 ? f : f + shift))
}

/** Whether a shape uses open strings (and so cannot be moved without changing quality). */
export function usesOpenStrings(shape: Shape): boolean {
  return shape.some((f) => f === 0)
}

/** Midi notes of a shape, low to high, for playback. */
export function shapeMidis(tuning: Tuning, shape: Shape): Midi[] {
  const out: Midi[] = []
  shape.forEach((fret, string) => {
    if (fret != null && fret >= 0) out.push(midiAt(tuning, { string, fret }))
  })
  return out
}

export function lowestFret(shape: Shape): number {
  const fretted = shape.filter((f): f is number => f != null && f > 0)
  return fretted.length ? Math.min(...fretted) : 0
}

export function highestFret(shape: Shape): number {
  const fretted = shape.filter((f): f is number => f != null && f > 0)
  return fretted.length ? Math.max(...fretted) : 0
}
