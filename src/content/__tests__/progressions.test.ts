import { describe, expect, it } from 'vitest'
import { CIRCLE_MAJOR } from '../../theory/keys'
import { realizeBars } from '../../theory/progressions'
import { chordNotes } from '../../theory/chords'
import { DEVICES, deviceById } from '../devices'
import { SONG_FORMS } from '../forms'
import { PROGRESSIONS } from '../progressions'

describe('progression catalog', () => {
  it('has unique ids and known devices', () => {
    const ids = PROGRESSIONS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const p of PROGRESSIONS) for (const d of p.devices) expect(deviceById(d), `${p.id} -> ${d}`).toBeDefined()
  })

  for (const p of PROGRESSIONS) {
    it(`${p.id} realizes in every key with playable chords`, () => {
      for (const tonic of CIRCLE_MAJOR) {
        const bars = realizeBars(p.bars, tonic)
        for (const bar of bars) for (const c of bar) {
          expect(chordNotes(c.symbol).length, `${p.id} ${c.numeral} in ${tonic} -> ${c.symbol}`).toBeGreaterThan(1)
        }
      }
    })
  }

  it('spells the well-known cases as expected', () => {
    const get = (id: string, tonic: string) => realizeBars(PROGRESSIONS.find((p) => p.id === id)!.bars, tonic).flat().map((c) => c.symbol)
    expect(get('andalusian', 'D')).toEqual(['Dm', 'C', 'Bb', 'A'])
    expect(get('ii-V-I', 'C')).toEqual(['Dm7', 'G7', 'Cmaj7', 'Cmaj7'])
    expect(get('secondary-dominants-chain', 'C')).toEqual(['C', 'E7', 'A7', 'D7', 'G7', 'C'])
    expect(get('ii-subV-I', 'C')).toEqual(['Dm7', 'Db7', 'Cmaj7', 'Cmaj7'])
    expect(get('I-IV-iv-I', 'G')).toEqual(['G', 'C', 'Cm', 'G'])
    expect(get('i-bVI-bvi', 'G')).toEqual(['Gm', 'Eb', 'Gm', 'Ebm'])
  })
})

describe('devices', () => {
  it('has unique ids and non-empty bodies', () => {
    const ids = DEVICES.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const d of DEVICES) expect(d.body.length, d.id).toBeGreaterThan(0)
  })
})

describe('song forms', () => {
  for (const f of SONG_FORMS) {
    it(`${f.id} realizes in its own key`, () => {
      for (const s of f.sections) {
        const bars = realizeBars(s.bars, f.tonic)
        for (const bar of bars) for (const c of bar) expect(chordNotes(c.symbol).length).toBeGreaterThan(1)
      }
    })
  }
})
