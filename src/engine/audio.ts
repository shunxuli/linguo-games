export class SoundManager {
  enabled = true
  private audioCtx: AudioContext | null = null

  initFromStorage(): void {
    const saved = localStorage.getItem('sudoku_soundEnabled')
    if (saved !== null) {
      this.enabled = saved === 'true'
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  private getCtx(): AudioContext | null {
    if (!this.audioCtx) {
      try {
        this.audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      } catch {
        return null
      }
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
    return this.audioCtx
  }

  playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.enabled) return
    try {
      const ctx = this.getCtx()
      if (!ctx) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = frequency
      osc.type = type
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
    } catch { /* ignore audio errors */ }
  }

  playSuccess(): void {
    this.playTone(523, 0.1)
    setTimeout(() => this.playTone(659, 0.1), 100)
    setTimeout(() => this.playTone(784, 0.15), 200)
  }

  playError(): void {
    this.playTone(200, 0.15, 'square')
    setTimeout(() => this.playTone(150, 0.2, 'square'), 150)
  }

  playWin(): void {
    const notes = [523, 587, 659, 784, 880, 1047]
    notes.forEach((freq, i) => setTimeout(() => this.playTone(freq, 0.2), i * 120))
  }
}
