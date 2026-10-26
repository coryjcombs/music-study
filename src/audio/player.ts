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

  private timers: ReturnType<typeof setTimeout>[] = []
  private sequenceListeners = new Set<(step: number | null) => void>()

  /** Subscribe to progression playback position (chord index, or null when stopped). */
  onStep(fn: (step: number | null) => void) {
    this.sequenceListeners.add(fn)
    return () => {
      this.sequenceListeners.delete(fn)
    }
  }

  private emitStep(step: number | null) {
    this.sequenceListeners.forEach((fn) => fn(step))
  }

  cancelSequence() {
    this.timers.forEach(clearTimeout)
    this.timers = []
    this.emitStep(null)
  }

  /**
   * Play a sequence of chords in time. Each step has the midis to strum and a
   * duration in beats. Timing uses JS timers (good enough for study tempos) so
   * playback can be cancelled cleanly. Loops when `loop` is true.
   */
  async playSteps(steps: { midis: Midi[]; beats: number }[], bpm: number, loop = false) {
    await this.ensureReady()
    this.cancelSequence()
    const beat = 60 / bpm
    const total = steps.reduce((n, s) => n + s.beats, 0) * beat
    const schedule = (offset: number) => {
      let t = offset
      steps.forEach((s, i) => {
        const dur = s.beats * beat
        this.timers.push(setTimeout(() => {
          this.emitStep(i)
          const now = this.now()
          s.midis.forEach((m, k) => this.inst?.start({ note: m, velocity: 80, duration: dur * 0.95, time: now + k * 0.02 }))
        }, t * 1000))
        t += dur
      })
    }
    schedule(0)
    if (loop) {
      const again = () => {
        this.timers = []
        schedule(0)
        this.timers.push(setTimeout(again, total * 1000))
      }
      this.timers.push(setTimeout(again, total * 1000))
    } else {
      this.timers.push(setTimeout(() => this.emitStep(null), total * 1000))
    }
  }
}

export const player = new Player()
