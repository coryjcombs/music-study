import { useEffect, useState } from 'react'
import { player } from './player'

/** Current playback step index of player.playSteps, or null when idle. */
export function usePlaybackStep(): number | null {
  const [step, setStep] = useState<number | null>(null)
  useEffect(() => player.onStep(setStep), [])
  return step
}
