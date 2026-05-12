export class SpeechManager {
  enabled = true
  private synth: SpeechSynthesis | null = null
  private queue: Array<{ text: string; lang: string }> = []
  private speaking = false
  private available = false

  constructor() {
    this.available = typeof window !== 'undefined' && 'speechSynthesis' in window
    if (this.available) {
      this.synth = window.speechSynthesis
    }
  }

  initFromStorage(): void {
    const saved = localStorage.getItem('sudoku_voiceEnabled')
    if (saved !== null) {
      this.enabled = saved === 'true'
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
    if (!enabled && this.synth) this.synth.cancel()
  }

  isAvailable(): boolean {
    return this.available
  }

  speak(text: string, lang = 'zh-CN'): void {
    if (!this.enabled || !this.synth || !this.available) return
    this.queue.push({ text, lang })
    if (!this.speaking) this._processQueue()
  }

  private _processQueue(): void {
    if (this.queue.length === 0) {
      this.speaking = false
      return
    }
    this.speaking = true
    const { text, lang } = this.queue.shift()!
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang
    utter.rate = lang === 'zh-CN' ? 0.9 : 0.85
    utter.pitch = 1.1
    utter.volume = 1
    utter.onend = () => setTimeout(() => this._processQueue(), 150)
    utter.onerror = () => this._processQueue()
    this.synth!.speak(utter)
  }
}
