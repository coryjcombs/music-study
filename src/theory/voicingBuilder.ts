import { Note } from 'tonal'
import { chordNotes } from './chords'
import { toMidi } from './spelling'
import type { Midi, NoteName } from './types'

/**
 * A simple close-position voicing for playback: the root in `octave`, the other
 * chord tones stacked above it. Not a guitar shape; used by the circle and catalog
 * when no specific shape is chosen.
 */
export function closeVoicing(symbol: string, octave = 3): Midi[] {
  const notes = chordNotes(symbol)
  if (notes.length === 0) return []
  const root = toMidi(Note.pitchClass(notes[0]) + octave)
  let prev = root
  return notes.map((n, i) => {
    if (i === 0) return root
    let m = toMidi(Note.pitchClass(n) + octave)
    while (m <= prev) m += 12
    prev = m
    return m
  })
}

/** Scale notes as ascending midis from the root in `octave`, plus the octave above. */
export function scaleRun(notes: NoteName[], octave = 3): Midi[] {
  if (notes.length === 0) return []
  const root = toMidi(Note.pitchClass(notes[0]) + octave)
  let prev = root - 1
  const run = notes.map((n) => {
    let m = toMidi(Note.pitchClass(n) + octave)
    while (m <= prev) m += 12
    prev = m
    return m
  })
  return [...run, root + 12]
}
