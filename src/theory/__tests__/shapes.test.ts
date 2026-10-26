import { describe, expect, it } from 'vitest'
import { keysContaining } from '../keys'
import { shapeMidis, transposeShape, usesOpenStrings } from '../shapes'
import { STANDARD } from '../tuning'
import { closeVoicing, scaleRun } from '../voicingBuilder'

describe('transposeShape', () => {
  it('moves a movable shape up by the root difference', () => {
    expect(transposeShape([null, 3, 1, 3, 3, null], 'C', 'E')).toEqual([null, 7, 5, 7, 7, null])
  })

  it('drops an octave when the shape would run too high', () => {
    // C at fret 8 to B would be fret 19; prefer fret 7.
    expect(transposeShape([8, 10, 10, 9, 8, 8], 'C', 'B')).toEqual([7, 9, 9, 8, 7, 7])
  })

  it('never puts a fretted note below fret 1', () => {
    expect(transposeShape([null, 3, 1, 3, 3, null], 'C', 'Bb')).toEqual([null, 13, 11, 13, 13, null])
  })

  it('leaves open strings alone and reports them', () => {
    expect(usesOpenStrings([null, 3, 2, 0, 1, 0])).toBe(true)
    expect(usesOpenStrings([null, 3, 1, 3, 3, null])).toBe(false)
  })
})

describe('shapeMidis', () => {
  it('lists sounding notes low to high', () => {
    expect(shapeMidis(STANDARD, [null, 3, 1, 3, 3, null])).toEqual([48, 51, 58, 62])
  })
})

describe('closeVoicing and scaleRun', () => {
  it('stacks chord tones above the root', () => {
    expect(closeVoicing('Cm9', 3)).toEqual([48, 51, 55, 58, 62])
    expect(closeVoicing('G7', 2)).toEqual([43, 47, 50, 53])
  })

  it('runs a scale up to the octave', () => {
    expect(scaleRun(['A', 'B', 'C', 'D', 'E', 'F', 'G'], 2)).toEqual([45, 47, 48, 50, 52, 53, 55, 57])
  })
})

describe('keysContaining', () => {
  it('finds the major keys where Cm7 is diatonic', () => {
    const hits = keysContaining('Cm7').filter((h) => h.mode === 'major')
    expect(hits.map((h) => `${h.tonic}:${h.numeral}`).sort()).toEqual(['Ab:iii', 'Bb:ii', 'Eb:vi'])
  })

  it('finds G7 only in C major and its relative and parallel minors', () => {
    const hits = keysContaining('G7')
    expect(hits.map((h) => `${h.tonic} ${h.mode}:${h.numeral}`)).toEqual(['C major:V', 'A minor:VII'])
  })
})
