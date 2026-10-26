import { describe, expect, it } from 'vitest'
import { findLibraryShape } from '../shapeLookup'

describe('findLibraryShape', () => {
  it('prefers the open shape when the root matches', () => {
    expect(findLibraryShape('C')?.shape.id).toBe('open-C')
    expect(findLibraryShape('Dm7')?.shape.id).toBe('open-Dm7')
    expect(findLibraryShape('Cmaj7')?.shape.id).toBe('open-Cmaj7')
  })

  it('transposes a movable shape otherwise', () => {
    const m = findLibraryShape('Bbmaj7')
    expect(m?.shape.id).toBe('barre-a-maj7')
    expect(m?.frets).toEqual([null, 1, 3, 2, 3, 1])
    expect(m?.symbol).toBe('Bbmaj7')
  })

  it('matches by interval structure, not by alias spelling', () => {
    expect(findLibraryShape('CM')?.shape.id).toBe('open-C')
    expect(findLibraryShape('Cmaj')?.shape.id).toBe('open-C')
    expect(findLibraryShape('F#m7b5')?.shape.id).toBe('shell6-m7b5')
    expect(findLibraryShape('Ebm9')?.shape.id).toBe('ext-m9-a')
  })

  it('returns null for unknown symbols or qualities without a shape', () => {
    expect(findLibraryShape('H')).toBeNull()
    expect(findLibraryShape('C9sus4')).toBeNull()
  })
})
