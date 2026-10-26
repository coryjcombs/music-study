import { describe, expect, it } from 'vitest'
import { isDiatonic, realizeBar, realizeBars, realizeNumeral } from '../progressions'

const sym = (n: string, tonic: string) => realizeNumeral(n, tonic).symbol

describe('realizeNumeral', () => {
  it('reads case as triad quality', () => {
    expect(sym('I', 'C')).toBe('C')
    expect(sym('ii', 'C')).toBe('Dm')
    expect(sym('vii°', 'C')).toBe('Bdim')
    expect(sym('bIII+', 'C')).toBe('Ebaug')
  })

  it('applies explicit suffixes with the right quality', () => {
    expect(sym('ii7', 'C')).toBe('Dm7')
    expect(sym('V7', 'C')).toBe('G7')
    expect(sym('Imaj7', 'C')).toBe('Cmaj7')
    expect(sym('iiø7', 'C')).toBe('Dm7b5')
    expect(sym('vii°7', 'C')).toBe('Bdim7')
    expect(sym('ivmaj7', 'C')).toBe('FmMaj7')
    expect(sym('vi9', 'C')).toBe('Am9')
    expect(sym('I6', 'C')).toBe('C6')
  })

  it('handles borrowed and flat-side chords in any key', () => {
    expect(sym('bVII', 'C')).toBe('Bb')
    expect(sym('bVI', 'E')).toBe('C')
    expect(sym('bIII', 'A')).toBe('C')
    expect(sym('iv', 'G')).toBe('Cm')
    expect(sym('bII7', 'C')).toBe('Db7')
    expect(sym('bVII7', 'F#')).toBe('E7')
  })

  it('realizes minor progressions against the parallel major scale', () => {
    expect(realizeBars(['i', 'bVII', 'bVI', 'V'], 'D').map((b) => b[0].symbol)).toEqual(['Dm', 'C', 'Bb', 'A'])
    expect(realizeBars(['iiø7', 'V7', 'i'], 'C').map((b) => b[0].symbol)).toEqual(['Dm7b5', 'G7', 'Cm'])
  })

  it('realizes secondary dominants and tritone substitutes', () => {
    expect(realizeNumeral('V7/ii', 'C')).toMatchObject({ symbol: 'A7', secondaryOf: 'ii' })
    expect(sym('V/V', 'C')).toBe('D')
    expect(sym('V7/vi', 'Eb')).toBe('G7')
    expect(sym('vii°7/V', 'C')).toBe('F#dim7')
    expect(sym('subV7/I', 'C')).toBe('Db7')
    expect(sym('subV7/ii', 'C')).toBe('Eb7')
  })

  it('keeps spelling sane in flat keys', () => {
    expect(realizeBars(['I', 'IV', 'V'], 'Eb').map((b) => b[0].symbol)).toEqual(['Eb', 'Ab', 'Bb'])
    expect(sym('iii', 'Db')).toBe('Fm')
  })
})

describe('realizeBar', () => {
  it('splits a bar into equal chords', () => {
    expect(realizeBar('ii V', 'C').map((c) => c.symbol)).toEqual(['Dm', 'G'])
    expect(realizeBar('  I  ', 'C')).toHaveLength(1)
  })
})

describe('isDiatonic', () => {
  it('knows the diatonic sets', () => {
    expect(isDiatonic('IV', 'major')).toBe(true)
    expect(isDiatonic('iv', 'major')).toBe(false)
    expect(isDiatonic('bVII', 'major')).toBe(false)
    expect(isDiatonic('bVII', 'minor')).toBe(true)
    expect(isDiatonic('V', 'minor')).toBe(false)
    expect(isDiatonic('V7/ii', 'major')).toBe(false)
    expect(isDiatonic('ii7', 'major')).toBe(true)
  })
})
