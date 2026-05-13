export class SpeechManager {
  enabled = true
  private synth: SpeechSynthesis | null = null
  private queue: Array<{ text: string; lang: string }> = []
  private speaking = false
  private available = false
  private zhVoice: SpeechSynthesisVoice | null = null
  private enVoice: SpeechSynthesisVoice | null = null

  constructor() {
    this.available = typeof window !== 'undefined' && 'speechSynthesis' in window
    if (this.available) {
      this.synth = window.speechSynthesis
      // Voices load asynchronously in most browsers
      this.synth.onvoiceschanged = () => this._selectVoices()
      this._selectVoices()
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

  private _selectVoices(): void {
    if (!this.synth) return
    const voices = this.synth.getVoices()
    if (voices.length === 0) return // Not yet loaded

    // Chinese: Google > Microsoft neural > any zh voice
    this.zhVoice =
      voices.find(v => v.lang.startsWith('zh-CN') && /Google|Xiaoxiao|Yunyang/i.test(v.name))
      || voices.find(v => v.lang.startsWith('zh-CN'))
      || voices.find(v => v.lang.startsWith('zh'))
      || null

    // English: Google > Microsoft > any en voice
    this.enVoice =
      voices.find(v => v.lang.startsWith('en') && /Google|Microsoft/i.test(v.name))
      || voices.find(v => v.lang.startsWith('en-US'))
      || voices.find(v => v.lang.startsWith('en'))
      || null
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
    utter.voice = lang === 'zh-CN' ? this.zhVoice : this.enVoice
    utter.rate = 0.85
    utter.pitch = 1.05
    utter.volume = 1
    utter.onend = () => setTimeout(() => this._processQueue(), 120)
    utter.onerror = () => this._processQueue()
    this.synth!.speak(utter)
  }
}
