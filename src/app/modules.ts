import type { ComponentType } from 'react'
import { FretboardModule } from '../modules/fretboard/FretboardModule'
import type { Settings } from '../store/settings'

/**
 * Module registry. Adding a screen means adding one entry here and one folder
 * under src/modules. Modules depend on theory/ and audio/, never on each other.
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
]
