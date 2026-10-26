import { useEffect, useState } from 'react'
import { player, type PlayerStatus } from './player'

/** React view of the player's load status. */
export function usePlayerStatus(): PlayerStatus {
  const [status, setStatus] = useState<PlayerStatus>(player.getStatus())
  useEffect(() => player.subscribe(setStatus), [])
  return status
}
