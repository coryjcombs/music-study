import { Note } from 'tonal'
import type { Midi, NoteName } from './types'

/**
 * A spelling context is a set of note names that should win when a pitch class
 * matches one of them (typically the notes of the current key, scale or chord).
 * Pitch classes outside the set fall back to sharps or flats depending on which
 * way the context itself leans.
 */
export interface SpellingContext {
  notes?: NoteName[]
  prefer?: 'sharp' | 'flat'
}

function leaning(notes: NoteName[]): 'sharp' | 'flat' {
  let score = 0
  for (const n of notes) {
    const acc = Note.get(n).acc
    if (acc.includes('#')) score++
    if (acc.includes('b')) score--
  }
  return score < 0 ? 'flat' : 'sharp'
}

/** Spell a midi number as a pitch class (no octave) in context. */
export function spellPitchClass(midi: Midi, ctx: SpellingContext = {}): NoteName {
  const chroma = ((midi % 12) + 12) % 12
  if (ctx.notes) {
    for (const n of ctx.notes) {
      if (Note.get(n).chroma === chroma) return Note.pitchClass(n)
    }
  }
  const prefer = ctx.prefer ?? (ctx.notes ? leaning(ctx.notes) : 'sharp')
  return prefer === 'flat'
    ? Note.pitchClass(Note.fromMidi(midi))
    : Note.pitchClass(Note.fromMidiSharps(midi))
}

/** Spell a midi number with octave in context, e.g. 63 -> "Eb4" or "D#4". */
export function spellNote(midi: Midi, ctx: SpellingContext = {}): NoteName {
  const pc = spellPitchClass(midi, ctx)
  // The octave number follows the letter, so B#3 is midi 60 (same pitch as C4) and Cb4 is 59.
  const letterMidi = Note.get(pc + '4').midi!
  const octave = 4 + Math.round((midi - letterMidi) / 12)
  return pc + octave
}

export function toMidi(note: NoteName): Midi {
  const m = Note.get(note).midi
  if (m == null) throw new Error(`Note "${note}" has no octave or is invalid`)
  return m
}

export function chromaOf(note: NoteName): number {
  const c = Note.get(note).chroma
  if (c == null) throw new Error(`Invalid note "${note}"`)
  return c
}
