import { describe, expect, it } from 'vitest'
import { STANDARD } from '../tuning'
import { analyzeVoicing, parseShape, shapeToString } from '../voicing'

const labels = (a: ReturnType<typeof analyzeVoicing>) => a.notes.map((n) => `${n.pitchClass}:${n.label}`)

describe('parseShape', () => {
  it('parses compact and spaced forms', () => {
    expect(parseShape('x3133x')).toEqual([null, 3, 1, 3, 3, null])
    expect(parseShape('x 10 8 10 10 x')).toEqual([null, 10, 8, 10, 10, null])
    expect(shapeToString([null, 10, 8, 10, 10, null])).toBe('x 10 8 10 10 x')
    expect(shapeToString([null, 3, 1, 3, 3, null])).toBe('x3133x')
  })
})

describe('analyzeVoicing', () => {
  it('identifies the common Cm9 shape with the fifth omitted', () => {
    const a = analyzeVoicing(STANDARD, parseShape('x3133x'))
    expect(a.best?.symbol).toBe('Cm9')
    expect(a.root).toBe('C')
    expect(labels(a)).toEqual(['C:R', 'Eb:b3', 'Bb:b7', 'D:9'])
    expect(a.missing).toEqual(['5'])
    expect(a.doubled).toEqual([])
    expect(a.notes.map((n) => n.note)).toEqual(['C3', 'Eb3', 'Bb3', 'D4'])
  })

  it('identifies the other Cm9 shape with the fifth doubled', () => {
    const a = analyzeVoicing(STANDARD, parseShape('8 10 8 8 8 10'))
    expect(a.best?.symbol).toBe('Cm9')
    expect(labels(a)).toEqual(['C:R', 'G:5', 'Bb:b7', 'Eb:b3', 'G:5', 'D:9'])
    expect(a.doubled).toEqual(['G'])
    expect(a.missing).toEqual([])
  })

  it('identifies open and barre triads', () => {
    expect(analyzeVoicing(STANDARD, parseShape('x32010')).best?.symbol).toBe('C')
    expect(analyzeVoicing(STANDARD, parseShape('022000')).best?.symbol).toBe('Em')
    expect(analyzeVoicing(STANDARD, parseShape('133211')).best?.symbol).toBe('F')
    expect(analyzeVoicing(STANDARD, parseShape('xx0232')).best?.symbol).toBe('D')
  })

  it('identifies seventh chords and shell voicings', () => {
    expect(analyzeVoicing(STANDARD, parseShape('320001')).best?.symbol).toBe('G7')
    expect(analyzeVoicing(STANDARD, parseShape('x35353')).best?.symbol).toBe('C7')
    expect(analyzeVoicing(STANDARD, parseShape('x3x35x')).best?.symbol).toBe('C7') // shell: R b7 3
    expect(analyzeVoicing(STANDARD, parseShape('x3x45x')).best?.symbol).toBe('Cmaj7') // shell: R 7 3
    expect(analyzeVoicing(STANDARD, parseShape('x3434x')).best?.symbol).toBe('Cm7b5')
  })

  it('spells Eb major 7 with flats', () => {
    const a = analyzeVoicing(STANDARD, parseShape('x 6 5 3 3 x'))
    expect(a.best?.symbol).toBe('Ebmaj7')
    expect(a.notes.map((n) => n.pitchClass)).toEqual(['Eb', 'G', 'Bb', 'D'])
  })

  it('reports inversions', () => {
    const a = analyzeVoicing(STANDARD, parseShape('xx2010')) // E G C E: C/E
    expect(a.best?.symbol).toBe('C')
    expect(a.bassNote).toBe('E')
    expect(a.isInversion).toBe(true)
  })

  it('re-reads a shape when a root is asserted', () => {
    // Eb G Bb D is Ebmaj7 on its own; over an asserted C it is a rootless Cm9.
    const shape = parseShape('x 6 5 3 3 x')
    const a = analyzeVoicing(STANDARD, shape, 'C')
    expect(a.best?.symbol).toBe('Cm9')
    expect(a.best?.rootImplied).toBe(true)
    expect(labels(a)).toEqual(['Eb:b3', 'G:5', 'Bb:b7', 'D:9'])
    expect(a.missing).toEqual(['R'])
  })

  it('reads an altered dominant', () => {
    // G B F Ab: G7b9 with no fifth
    const a = analyzeVoicing(STANDARD, parseShape('3x34x4'))
    expect(a.best?.symbol).toBe('G7b9')
    expect(labels(a)).toEqual(['G:R', 'F:b7', 'B:3', 'Ab:b9'])
  })

  it('returns an empty analysis for an all-muted shape', () => {
    const a = analyzeVoicing(STANDARD, [null, null, null, null, null, null])
    expect(a.best).toBeNull()
    expect(a.notes).toEqual([])
  })
})
