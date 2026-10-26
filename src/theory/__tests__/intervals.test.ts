import { describe, expect, it } from 'vitest'
import { functionLabel, intervalFromRoot } from '../intervals'

describe('functionLabel (chord mode)', () => {
  it('labels Cm9 tones', () => {
    expect(functionLabel('C', 'C')).toBe('R')
    expect(functionLabel('C', 'Eb')).toBe('b3')
    expect(functionLabel('C', 'G')).toBe('5')
    expect(functionLabel('C', 'Bb')).toBe('b7')
    expect(functionLabel('C', 'D')).toBe('9')
  })

  it('reads spelling: D# against C is #9, Eb is b3', () => {
    expect(functionLabel('C', 'D#')).toBe('#9')
    expect(functionLabel('C', 'Eb')).toBe('b3')
  })

  it('labels upper extensions and alterations', () => {
    expect(functionLabel('G', 'C')).toBe('11')
    expect(functionLabel('G', 'C#')).toBe('#11')
    expect(functionLabel('G', 'Eb')).toBe('b13')
    expect(functionLabel('G', 'E')).toBe('13')
    expect(functionLabel('G', 'F#')).toBe('7')
    expect(functionLabel('G', 'F')).toBe('b7')
    expect(functionLabel('G', 'Ab')).toBe('b9')
  })

  it('ignores octaves', () => {
    expect(intervalFromRoot('C3', 'D5')).toBe('2M')
    expect(functionLabel('E2', 'C4')).toBe('b13')
  })
})

describe('functionLabel (degree mode)', () => {
  it('uses scale degrees', () => {
    expect(functionLabel('D', 'E', 'degree')).toBe('2')
    expect(functionLabel('D', 'F', 'degree')).toBe('b3')
    expect(functionLabel('D', 'G#', 'degree')).toBe('#4')
    expect(functionLabel('D', 'Ab', 'degree')).toBe('b5')
    expect(functionLabel('D', 'C', 'degree')).toBe('b7')
  })
})
