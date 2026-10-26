import { describe, expect, it } from 'vitest'
import { findPositions, fretboardGrid, midiAt } from '../fretboard'
import { scaleNotes } from '../scales'
import { STANDARD, tuningById } from '../tuning'

describe('midiAt', () => {
  it('maps standard tuning open strings and frets', () => {
    expect(midiAt(STANDARD, { string: 0, fret: 0 })).toBe(40) // E2
    expect(midiAt(STANDARD, { string: 5, fret: 0 })).toBe(64) // E4
    expect(midiAt(STANDARD, { string: 1, fret: 3 })).toBe(48) // C3
    expect(midiAt(STANDARD, { string: 0, fret: 8 })).toBe(48) // same C3 on the 6th string
  })

  it('respects alternate tunings', () => {
    expect(midiAt(tuningById('drop-d'), { string: 0, fret: 0 })).toBe(38)
  })
})

describe('fretboardGrid', () => {
  it('labels Eb major scale degrees with flat spellings', () => {
    const grid = fretboardGrid({
      tuning: STANDARD, frets: 12, root: 'Eb', set: scaleNotes('Eb', 'major'), labelMode: 'degree',
    })
    const aString = grid[1]
    expect(aString[1]).toMatchObject({ name: 'Bb', label: '5', inSet: true })
    expect(aString[4]).toMatchObject({ name: 'Db', label: 'b7', inSet: false })
    expect(aString[6]).toMatchObject({ name: 'Eb', label: '1', isRoot: true })
  })

  it('uses chord-function labels for a chord overlay', () => {
    const grid = fretboardGrid({ tuning: STANDARD, frets: 5, root: 'C', set: ['C', 'Eb', 'G', 'Bb', 'D'] })
    expect(grid[3][3]).toMatchObject({ name: 'Bb', label: 'b7', inSet: true })
    expect(grid[4][3]).toMatchObject({ name: 'D', label: '9', inSet: true })
    expect(grid[2][1]).toMatchObject({ name: 'Eb', label: 'b3' })
  })

  it('has plain names and no labels without a root', () => {
    const grid = fretboardGrid({ tuning: STANDARD, frets: 3 })
    expect(grid[5][1]).toMatchObject({ name: 'F', label: null, inSet: true })
    expect(grid[4][1].name).toBe('C')
  })
})

describe('findPositions', () => {
  it('finds every C up to the 12th fret in standard tuning', () => {
    const c = findPositions(STANDARD, 'C', 12)
    expect(c).toEqual([
      { string: 0, fret: 8 }, { string: 1, fret: 3 }, { string: 2, fret: 10 },
      { string: 3, fret: 5 }, { string: 4, fret: 1 }, { string: 5, fret: 8 },
    ])
  })
})
