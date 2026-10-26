import { useCallback, useEffect, useState } from 'react'
import type { InstrumentId } from '../audio/player'

/**
 * User settings persisted in localStorage. Reference content never lives here;
 * only your own preferences and (later) notes, sketches and logs.
 */
export interface Settings {
  tuningId: string
  instrument: InstrumentId
  fretCount: number
  leftHanded: boolean
}

const KEY = 'music-study:settings'

const DEFAULTS: Settings = {
  tuningId: 'standard',
  instrument: 'acoustic_guitar_nylon',
  fretCount: 15,
  leftHanded: false,
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

export function saveSettings(s: Settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    // Storage may be unavailable (private window); the app still works.
  }
}

export function useSettings(): [Settings, (patch: Partial<Settings>) => void] {
  const [settings, setSettings] = useState<Settings>(loadSettings)
  useEffect(() => saveSettings(settings), [settings])
  const update = useCallback((patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })), [])
  return [settings, update]
}
