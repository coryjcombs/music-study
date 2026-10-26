import { describe, expect, it } from 'vitest'
import { keyInfo } from '../keys'
import { scaleNotes } from '../scales'

describe('keyInfo', () => {
  it('describes Eb major', () => {
    const k = keyInfo('Eb', 'major')
    expect(k.signature).toBe('bbb')
    expect(k.accidentals).toBe(3)
    expect(k.scale).toEqual(['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'])
    expect(k.chords).toEqual(['Ebmaj7', 'Fm7', 'Gm7', 'Abmaj7', 'Bb7', 'Cm7', 'Dm7b5'])
    expect(k.relative).toBe('C')
  })

  it('describes C minor with the same signature as Eb major', () => {
    const k = keyInfo('C', 'minor')
    expect(k.signature).toBe('bbb')
    expect(k.chords[0]).toBe('Cm7')
    expect(k.relative).toBe('Eb')
  })

  it('describes sharp keys', () => {
    expect(keyInfo('E', 'major').signature).toBe('####')
    expect(keyInfo('A', 'major').scale).toEqual(['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'])
  })
})

describe('scaleNotes', () => {
  it('spells modes from their root', () => {
    expect(scaleNotes('D', 'dorian')).toEqual(['D', 'E', 'F', 'G', 'A', 'B', 'C'])
    expect(scaleNotes('F', 'lydian')).toEqual(['F', 'G', 'A', 'B', 'C', 'D', 'E'])
    expect(scaleNotes('A', 'minor pentatonic')).toEqual(['A', 'C', 'D', 'E', 'G'])
  })
})
