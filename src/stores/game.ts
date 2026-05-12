import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Screen = 'lobby' | 'sudoku-config' | 'math-config' | 'puzzle-config' | 'memory-config' | 'pattern-config' | 'spot-config' | 'maze-config' | 'match-config' | 'sort-config' | 'hanoi-config' | 'sudoku-game' | 'math-game' | 'puzzle-game' | 'memory-game' | 'pattern-game' | 'spot-game' | 'maze-game' | 'match-game' | 'sort-game' | 'hanoi-game'

export const useGameStore = defineStore('game', () => {
  const currentScreen = ref<Screen>('lobby')
  const score = ref(0)
  const activeOverlay = ref<string | null>(null)
  const overlayData = ref<Record<string, unknown>>({})
  const confirmCallback = ref<(() => void) | null>(null)
  const returnScreen = ref<Screen>('lobby')

  function navigateTo(screen: Screen) { currentScreen.value = screen }
  function goToLobby() { currentScreen.value = 'lobby'; activeOverlay.value = null }
  function goToReturnScreen() { currentScreen.value = returnScreen.value; activeOverlay.value = null }
  function navigateBackToConfig() {
    const map: Record<string, Screen> = {
      'sudoku-game': 'sudoku-config',
      'math-game': 'math-config',
      'puzzle-game': 'puzzle-config',
      'memory-game': 'memory-config',
      'pattern-game': 'pattern-config',
      'spot-game': 'spot-config',
      'maze-game': 'maze-config',
      'match-game': 'match-config',
      'sort-game': 'sort-config',
      'hanoi-game': 'hanoi-config',
    }
    currentScreen.value = map[currentScreen.value] || 'lobby'
    activeOverlay.value = null
  }
  function updateScore(s: number) { score.value = s }

  function showOverlay(id: string, data?: Record<string, unknown>) {
    activeOverlay.value = id
    if (data) overlayData.value = { ...overlayData.value, ...data }
  }
  function hideOverlay() { activeOverlay.value = null; overlayData.value = {} }
  function showConfirm(title: string, message: string, cb: () => void) {
    confirmCallback.value = cb
    showOverlay('confirm', { title, message })
  }
  function onConfirmYes() {
    if (confirmCallback.value) confirmCallback.value()
    confirmCallback.value = null
    hideOverlay()
  }
  function onConfirmNo() {
    confirmCallback.value = null
    hideOverlay()
  }

  return {
    currentScreen, score,
    activeOverlay, overlayData,
    returnScreen,
    navigateTo, goToLobby, goToReturnScreen, navigateBackToConfig, updateScore,
    showOverlay, hideOverlay,
    showConfirm, onConfirmYes, onConfirmNo,
  }
})
