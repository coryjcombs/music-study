import { chromaOf, spellPitchClass, toMidi, type SpellingContext } from './spelling'
import { functionLabel } from './intervals'
import type { LabeledPosition, Midi, NoteName, Position, Tuning } from './types'

export function midiAt(tuning: Tuning, pos: Position): Midi {
  const open = tuning.strings[pos.string]
  if (open == null) throw new Error(`Tuning has no string ${pos.string}`)
  return toMidi(open) + pos.fret
}

export interface FretboardOptions {
  tuning: Tuning
  frets: number
  /** Root for interval labels. Omit for plain note names. */
  root?: NoteName
  /** Notes of the active overlay (scale or chord). Also drives spelling. */
  set?: NoteName[]
  labelMode?: 'chord' | 'degree'
  spelling?: SpellingContext
}

/** Every position on the fretboard, labeled in context. Grid is [string][fret]. */
export function fretboardGrid(opts: FretboardOptions): LabeledPosition[][] {
  const { tuning, frets, root, set, labelMode = 'chord' } = opts
  const ctx: SpellingContext = opts.spelling ?? { notes: set ?? (root ? [root] : undefined) }
  const setChromas = new Set((set ?? []).map(chromaOf))
  const rootChroma = root ? chromaOf(root) : -1

  return tuning.strings.map((_, string) => {
    const row: LabeledPosition[] = []
    for (let fret = 0; fret <= frets; fret++) {
      const midi = midiAt(tuning, { string, fret })
      const chroma = midi % 12
      const name = spellPitchClass(midi, ctx)
      row.push({
        string,
        fret,
        midi,
        name,
        label: root ? functionLabel(root, name, labelMode) : null,
        inSet: set ? setChromas.has(chroma) : true,
        isRoot: chroma === rootChroma,
      })
    }
    return row
  })
}

/** All positions of a pitch class on the fretboard, up to a fret limit. */
export function findPositions(tuning: Tuning, note: NoteName, frets: number): Position[] {
  const chroma = chromaOf(note)
  const out: Position[] = []
  tuning.strings.forEach((_, string) => {
    for (let fret = 0; fret <= frets; fret++) {
      if (midiAt(tuning, { string, fret }) % 12 === chroma) out.push({ string, fret })
    }
  })
  return out
}
