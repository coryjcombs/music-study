import type { ComponentType } from 'react'
import { CircleModule } from '../modules/circle/CircleModule'
import { DevicesModule } from '../modules/devices/DevicesModule'
import { FretboardModule } from '../modules/fretboard/FretboardModule'
import { ProgressionsModule } from '../modules/progressions/ProgressionsModule'
import { ShapesModule } from '../modules/shapes/ShapesModule'
import { StructureModule } from '../modules/structure/StructureModule'
import { VoicingsModule } from '../modules/voicings/VoicingsModule'
import type { Settings } from '../store/settings'

/**
 * Module registry. Adding a screen means adding one entry here and one folder
 * under src/modules. Modules depend on theory/, audio/, content/ and store/, never on
 * each other (shared UI lives in modules/fretboard/Fretboard.tsx and app/components).
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
  { id: 'circle', title: 'Circle', component: CircleModule },
  { id: 'progressions', title: 'Progressions', component: ProgressionsModule },
  { id: 'devices', title: 'Devices', component: DevicesModule },
  { id: 'structure', title: 'Structure', component: StructureModule },
]
