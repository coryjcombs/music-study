import { useEffect, useState } from 'react'
import { player, type TransportState } from './player'

/** Transport status and the global step index now sounding (null when idle). */
export function useTransport(): TransportState {
  const [t, setT] = useState<TransportState>(player.getTransport())
  useEffect(() => player.onTransport(setT), [])
  return t
}
