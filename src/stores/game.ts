import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Screen = 'lobby' | 'sudoku-config' | 'math-config' | 'puzzle-config' | 'sudoku-game' | 'math-game' | 'puzzle-game'

export const useGameStore = defineStore('game', () => {
  const currentScreen = ref<Screen>('lobby')

  function navigateTo(screen: Screen) {
    currentScreen.value = screen
  }

  function goToLobby() {
    currentScreen.value = 'lobby'
  }

  return { currentScreen, navigateTo, goToLobby }
})
