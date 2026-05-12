import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Screen = 'lobby' | 'sudoku-config' | 'math-config' | 'puzzle-config' | 'sudoku-game' | 'math-game' | 'puzzle-game'

export const useGameStore = defineStore('game', () => {
  const currentScreen = ref<Screen>('lobby')
  const score = ref(0)

  // Overlay state
  const activeOverlay = ref<string | null>(null)
  const overlayData = ref<Record<string, unknown>>({})
  const confirmCallback = ref<(() => void) | null>(null)

  function navigateTo(screen: Screen) { currentScreen.value = screen }
  function goToLobby() { currentScreen.value = 'lobby'; activeOverlay.value = null }
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
    navigateTo, goToLobby, updateScore,
    showOverlay, hideOverlay,
    showConfirm, onConfirmYes, onConfirmNo,
  }
})
