import { describe, expect, it } from 'vitest'
import { spellNote, spellPitchClass } from '../spelling'

describe('spelling', () => {
  it('spells midi 63 as Eb in a flat context and D# in a sharp context', () => {
    expect(spellPitchClass(63, { notes: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'] })).toBe('Eb')
    expect(spellPitchClass(63, { notes: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'] })).toBe('D#')
  })

  it('falls back to the leaning of the context for notes outside it', () => {
    // F# is not in Eb major, so it is spelled Gb because the key leans flat.
    expect(spellPitchClass(66, { notes: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'] })).toBe('Gb')
    // Bb is not in D major, so it is spelled A# because the key leans sharp.
    expect(spellPitchClass(70, { notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'] })).toBe('A#')
  })

  it('defaults to sharps with no context and honours prefer', () => {
    expect(spellPitchClass(61)).toBe('C#')
    expect(spellPitchClass(61, { prefer: 'flat' })).toBe('Db')
  })

  it('keeps the octave with the spelled letter', () => {
    expect(spellNote(60)).toBe('C4')
    expect(spellNote(60, { notes: ['B#'] })).toBe('B#3')
    expect(spellNote(59, { notes: ['Cb'] })).toBe('Cb4')
    expect(spellNote(63, { notes: ['Eb'] })).toBe('Eb4')
  })
})
