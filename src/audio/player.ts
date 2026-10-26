/**
 * Audio adapter. Everything in the app that makes sound goes through this one
 * module, so instruments and scheduling can change later without touching screens.
 *
 * Browser rules: an AudioContext may only start after a user gesture, and samples
 * take a moment to load. Both are handled here; callers just call play functions
 * from click handlers.
 */
import { Soundfont } from 'smplr'
import type { Midi } from '../theory/types'

export type InstrumentId = 'acoustic_guitar_nylon' | 'acoustic_guitar_steel' | 'electric_guitar_clean' | 'acoustic_grand_piano'

export const INSTRUMENTS: { id: InstrumentId; name: string }[] = [
  { id: 'acoustic_guitar_nylon', name: 'Nylon guitar' },
  { id: 'acoustic_guitar_steel', name: 'Steel guitar' },
  { id: 'electric_guitar_clean', name: 'Electric guitar (clean)' },
  { id: 'acoustic_grand_piano', name: 'Piano' },
]

export type PlayerStatus = 'idle' | 'loading' | 'ready' | 'error'

type Listener = (status: PlayerStatus) => void

interface Voice {
  start(event: { note: number; velocity?: number; time?: number; duration?: number }): unknown
  stop(): void
}

class Player {
  private ctx: AudioContext | null = null
  private inst: Voice | null = null
  private instrumentId: InstrumentId = 'acoustic_guitar_nylon'
  private status: PlayerStatus = 'idle'
  private listeners = new Set<Listener>()
  private loading: Promise<void> | null = null

  getStatus() {
    return this.status
  }

  getInstrument() {
    return this.instrumentId
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }

  private setStatus(s: PlayerStatus) {
    this.status = s
    this.listeners.forEach((fn) => fn(s))
  }

  /** Must be called from a user gesture the first time. Safe to call repeatedly. */
  async ensureReady(): Promise<void> {
    if (!this.ctx) this.ctx = new AudioContext()
    if (this.ctx.state === 'suspended') await this.ctx.resume()
    if (this.inst) return
    if (this.loading) return this.loading
    this.loading = this.load(this.instrumentId)
    return this.loading
  }

  private async load(id: InstrumentId): Promise<void> {
    if (!this.ctx) return
    this.setStatus('loading')
    try {
      const sf = Soundfont(this.ctx, { instrument: id })
      await sf.load
      this.inst?.stop()
      this.inst = sf as unknown as Voice
      this.instrumentId = id
      this.setStatus('ready')
    } catch (err) {
      console.error('Instrument failed to load', err)
      this.setStatus('error')
    } finally {
      this.loading = null
    }
  }

  async setInstrument(id: InstrumentId) {
    if (id === this.instrumentId && this.inst) return
    this.instrumentId = id
    if (!this.ctx) return // will load on first gesture
    this.inst = null
    this.loading = this.load(id)
    await this.loading
  }

  private now() {
    return this.ctx?.currentTime ?? 0
  }

  async playNote(midi: Midi, duration = 1.2, velocity = 90) {
    await this.ensureReady()
    this.inst?.start({ note: midi, velocity, duration, time: this.now() })
  }

  /** Block chord: all notes at once. */
  async playChord(midis: Midi[], duration = 1.8, velocity = 85) {
    await this.ensureReady()
    const t = this.now()
    for (const m of midis) this.inst?.start({ note: m, velocity, duration, time: t })
  }

  /** Strum: notes staggered low to high by `spread` seconds. */
  async strum(midis: Midi[], spread = 0.035, duration = 2.0, velocity = 85) {
    await this.ensureReady()
    const t = this.now()
    midis.forEach((m, i) => this.inst?.start({ note: m, velocity, duration, time: t + i * spread }))
  }

  /** Arpeggio or melodic line: one note after another, `gap` seconds apart. */
  async playSequence(midis: Midi[], gap = 0.3, duration = 0.5, velocity = 85) {
    await this.ensureReady()
    const t = this.now()
    midis.forEach((m, i) => this.inst?.start({ note: m, velocity, duration, time: t + i * gap }))
  }

  stopAll() {
    this.cancelSequence()
    this.inst?.stop()
  }

  // ---- transport: timed chord sequences with pause and resume ----
  private timers: ReturnType<typeof setTimeout>[] = []
  private sequenceListeners = new Set<(t: TransportState) => void>()
  private transport: TransportState = { status: 'stopped', step: null }
  private sequence: { steps: Step[]; bpm: number; loop: boolean; offset: number } | null = null

  /** Subscribe to transport changes: status and the global step index now sounding. */
  onTransport(fn: (t: TransportState) => void) {
    this.sequenceListeners.add(fn)
    return () => {
      this.sequenceListeners.delete(fn)
    }
  }

  getTransport() {
    return this.transport
  }

  private setTransport(t: TransportState) {
    this.transport = t
    this.sequenceListeners.forEach((fn) => fn(t))
  }

  private clearTimers() {
    this.timers.forEach(clearTimeout)
    this.timers = []
  }

  cancelSequence() {
    this.clearTimers()
    this.sequence = null
    this.setTransport({ status: 'stopped', step: null })
  }

  /**
   * Play a sequence of chords in time. Each step has the midis to strum and a
   * duration in beats. `offset` is added to the emitted step index so views that
   * show a larger structure can highlight the right chord. `from` is the local
   * index to start at. Timing uses JS timers (good enough for study tempos) so
   * playback can be paused and cancelled cleanly.
   */
  async playSteps(steps: Step[], bpm: number, loop = false, offset = 0, from = 0) {
    await this.ensureReady()
    this.clearTimers()
    this.inst?.stop()
    this.sequence = { steps, bpm, loop, offset }
    this.scheduleFrom(from)
  }

  private scheduleFrom(from: number) {
    const seq = this.sequence
    if (!seq) return
    const beat = 60 / seq.bpm
    let t = 0
    for (let i = from; i < seq.steps.length; i++) {
      const s = seq.steps[i]
      const dur = s.beats * beat
      this.timers.push(setTimeout(() => {
        this.setTransport({ status: 'playing', step: seq.offset + i })
        const now = this.now()
        s.midis.forEach((m, k) => this.inst?.start({ note: m, velocity: 80, duration: dur * 0.95, time: now + k * 0.02 }))
      }, t * 1000))
      t += dur
    }
    this.timers.push(setTimeout(() => {
      if (seq.loop) {
        this.timers = []
        this.scheduleFrom(0)
      } else {
        this.sequence = null
        this.setTransport({ status: 'stopped', step: null })
      }
    }, t * 1000))
  }

  /** Pause at the current chord. Resume continues from that chord. */
  pause() {
    if (this.transport.status !== 'playing' || !this.sequence) return
    this.clearTimers()
    this.inst?.stop()
    this.setTransport({ status: 'paused', step: this.transport.step })
  }

  resume() {
    if (this.transport.status !== 'paused' || !this.sequence) return
    const local = (this.transport.step ?? this.sequence.offset) - this.sequence.offset
    this.scheduleFrom(Math.max(0, local))
  }

  togglePause() {
    if (this.transport.status === 'playing') this.pause()
    else if (this.transport.status === 'paused') this.resume()
  }
}

export interface Step {
  midis: Midi[]
  beats: number
}

export interface TransportState {
  status: 'stopped' | 'playing' | 'paused'
  /** Global step index (sequence offset + local index) now sounding, or null. */
  step: number | null
}

export const player = new Player()
