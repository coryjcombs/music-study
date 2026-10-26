import { describe, expect, it } from 'vitest'
import { STANDARD } from '../../theory/tuning'
import { analyzeVoicing } from '../../theory/voicing'
import { CHORD_SHAPES } from '../shapes'

/**
 * Content check: every library shape must identify as its declared symbol when
 * the analyzer is told the root. A failure here means the shape data is wrong
 * (or the template table needs a case).
 */
describe('chord shape library', () => {
  it('has unique ids', () => {
    const ids = CHORD_SHAPES.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has six strings per shape', () => {
    for (const s of CHORD_SHAPES) expect(s.frets, s.id).toHaveLength(6)
  })

  for (const s of CHORD_SHAPES) {
    it(`${s.id} analyzes as ${s.symbol}`, () => {
      const a = analyzeVoicing(STANDARD, s.frets, s.root)
      expect(a.best?.symbol).toBe(s.symbol)
      expect(a.best?.rootImplied).toBe(false)
    })
  }
})
