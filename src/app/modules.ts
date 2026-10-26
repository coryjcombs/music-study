import type { ComponentType } from 'react'
import { CircleModule } from '../modules/circle/CircleModule'
import { FretboardModule } from '../modules/fretboard/FretboardModule'
import { ShapesModule } from '../modules/shapes/ShapesModule'
import { VoicingsModule } from '../modules/voicings/VoicingsModule'
import type { Settings } from '../store/settings'

/**
 * Module registry. Adding a screen means adding one entry here and one folder
 * under src/modules. Modules depend on theory/, audio/ and store/, never on each other
 * (shared UI such as the fretboard SVG lives in modules/fretboard and app/components).
 */
export interface ModuleProps {
  settings: Settings
  updateSettings: (patch: Partial<Settings>) => void
}

export interface ModuleDef {
  id: string
  title: string
  component: ComponentType<ModuleProps>
}

export const MODULES: ModuleDef[] = [
  { id: 'fretboard', title: 'Fretboard', component: FretboardModule },
  { id: 'voicings', title: 'Voicings', component: VoicingsModule },
  { id: 'shapes', title: 'Shapes', component: ShapesModule },
  { id: 'circle', title: 'Circle of fifths', component: CircleModule },
]
