import { describe, expect, it } from 'vitest'
import { analyzeProgression, chordToNumeral, parseChord, splitSymbols, suggestKeys } from '../analysis'

describe('chordToNumeral', () => {
  it('labels diatonic chords', () => {
    expect(chordToNumeral('C', 'C')).toBe('I')
    expect(chordToNumeral('Dm7', 'C')).toBe('ii7')
    expect(chordToNumeral('G7', 'C')).toBe('V7')
    expect(chordToNumeral('Bdim', 'C')).toBe('vii°')
    expect(chordToNumeral('Bm7b5', 'C')).toBe('viiø7')
    expect(chordToNumeral('Cmaj7', 'C')).toBe('Imaj7')
  })

  it('labels borrowed chords with flats', () => {
    expect(chordToNumeral('Bb', 'C')).toBe('bVII')
    expect(chordToNumeral('Ab', 'C')).toBe('bVI')
    expect(chordToNumeral('Fm', 'C')).toBe('iv')
    expect(chordToNumeral('Eb', 'C')).toBe('bIII')
    expect(chordToNumeral('Db7', 'C')).toBe('bII7')
    expect(chordToNumeral('A#', 'C')).toBe('bVII')
  })

  it('works in other keys', () => {
    expect(chordToNumeral('C#m', 'A')).toBe('iii')
    expect(chordToNumeral('G', 'A')).toBe('bVII')
    expect(chordToNumeral('Ebm', 'Gb')).toBe('vi')
  })
})

describe('suggestKeys', () => {
  it('guesses C major for I V vi IV', () => {
    const top = suggestKeys(['C', 'G', 'Am', 'F'])[0]
    expect(top).toMatchObject({ tonic: 'C', mode: 'major', diatonic: 4 })
  })

  it('guesses A minor for a minor progression with a harmonic V', () => {
    const top = suggestKeys(['Am', 'G', 'F', 'E'])[0]
    expect(top).toMatchObject({ tonic: 'A', mode: 'minor' })
  })

  it('guesses Bb major for a jazz turnaround', () => {
    const top = suggestKeys(['Bbmaj7', 'Gm7', 'Cm7', 'F7'])[0]
    expect(top).toMatchObject({ tonic: 'Bb', mode: 'major' })
  })
})

describe('analyzeProgression', () => {
  it('marks diatonic chords', () => {
    const a = analyzeProgression(['C', 'F', 'G7', 'C'], 'C', 'major')
    expect(a.map((x) => x.numeral)).toEqual(['I', 'IV', 'V7', 'I'])
    expect(a.every((x) => x.diatonic)).toBe(true)
  })

  it('finds secondary dominants', () => {
    const a = analyzeProgression(['C', 'A7', 'Dm7', 'G7', 'C'], 'C', 'major')
    expect(a[1]).toMatchObject({ numeral: 'V7/ii', diatonic: false, deviceId: 'secondary-dominant' })
    const b = analyzeProgression(['C', 'D', 'G', 'C'], 'C', 'major')
    expect(b[1].numeral).toBe('V/V')
  })

  it('finds tritone substitutes', () => {
    const a = analyzeProgression(['Dm7', 'Db7', 'Cmaj7'], 'C', 'major')
    expect(a[1]).toMatchObject({ numeral: 'subV7/I', deviceId: 'tritone-substitution' })
  })

  it('finds borrowed chords', () => {
    const a = analyzeProgression(['G', 'C', 'Cm', 'G'], 'G', 'major')
    expect(a[2]).toMatchObject({ numeral: 'iv', diatonic: false, deviceId: 'modal-interchange' })
    const b = analyzeProgression(['D', 'C', 'G', 'D'], 'D', 'major')
    expect(b[1]).toMatchObject({ numeral: 'bVII', deviceId: 'bVII' })
  })

  it('finds chromatic mediants', () => {
    const a = analyzeProgression(['C', 'E', 'C'], 'C', 'major')
    expect(a[1]).toMatchObject({ numeral: 'III', deviceId: 'chromatic-mediant' })
    const b = analyzeProgression(['Gm', 'Eb', 'Ebm'], 'G', 'minor')
    expect(b[1].diatonic).toBe(true)
    expect(b[2]).toMatchObject({ numeral: 'bvi', deviceId: 'chromatic-mediant' })
  })

  it('treats the harmonic-minor V as diatonic in minor', () => {
    const a = analyzeProgression(['Am', 'Dm', 'E7', 'Am'], 'A', 'minor')
    expect(a[2]).toMatchObject({ numeral: 'V7', diatonic: true })
  })

  it('reports unreadable symbols without throwing', () => {
    const a = analyzeProgression(['C', 'H', 'G'], 'C', 'major')
    expect(a[1].numeral).toBeNull()
  })
})

describe('helpers', () => {
  it('splits text into symbols', () => {
    expect(splitSymbols('C G | Am, F\nDm7')).toEqual(['C', 'G', 'Am', 'F', 'Dm7'])
    expect(parseChord('F#m7b5')?.quality).toBe('diminished')
    expect(parseChord('G7')?.isDominant7).toBe(true)
    expect(parseChord('Gmaj7')?.isDominant7).toBe(false)
  })
})
