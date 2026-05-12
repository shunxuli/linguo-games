<script setup lang="ts">
import { useGameStore } from './stores/game'
import { useGameServices } from './stores/gameServices'
import LobbyScreen from './components/screens/LobbyScreen.vue'
import SudokuConfig from './components/screens/SudokuConfig.vue'
import MathConfig from './components/screens/MathConfig.vue'
import PuzzleConfig from './components/screens/PuzzleConfig.vue'
import SudokuGame from './components/screens/SudokuGame.vue'
import MathGame from './components/screens/MathGame.vue'
import PuzzleGame from './components/screens/PuzzleGame.vue'
import MemoryConfig from './components/screens/MemoryConfig.vue'
import MemoryGame from './components/screens/MemoryGame.vue'
import TutorialModal from './components/modals/TutorialModal.vue'
import SettingsModal from './components/modals/SettingsModal.vue'
import ErrorModal from './components/modals/ErrorModal.vue'
import HintModal from './components/modals/HintModal.vue'
import WinModal from './components/modals/WinModal.vue'
import ConfirmModal from './components/modals/ConfirmModal.vue'

const game = useGameStore()
const { init } = useGameServices()
init()

function isActive(screen: string) {
  return game.currentScreen === screen
}
</script>

<template>
  <div
    class="screen"
    :class="{ active: isActive('lobby') }"
  >
    <LobbyScreen />
  </div>
  <div
    class="screen"
    :class="{ active: isActive('sudoku-config') }"
  >
    <SudokuConfig />
  </div>
  <div
    class="screen"
    :class="{ active: isActive('math-config') }"
  >
    <MathConfig />
  </div>
  <div
    class="screen"
    :class="{ active: isActive('puzzle-config') }"
  >
    <PuzzleConfig />
  </div>
  <div
    class="screen game-screen"
    :class="{ active: isActive('sudoku-game') }"
  >
    <SudokuGame />
  </div>
  <div
    class="screen game-screen"
    :class="{ active: isActive('math-game') }"
  >
    <MathGame />
  </div>
  <div
    class="screen game-screen"
    :class="{ active: isActive('puzzle-game') }"
  >
    <PuzzleGame />
  </div>
  <div
    class="screen"
    :class="{ active: isActive('memory-config') }"
  >
    <MemoryConfig />
  </div>
  <div
    class="screen game-screen"
    :class="{ active: isActive('memory-game') }"
  >
    <MemoryGame />
  </div>

  <TutorialModal>
    <slot />
  </TutorialModal>
  <SettingsModal />
  <ErrorModal />
  <HintModal />
  <WinModal />
  <ConfirmModal />
</template>

<style scoped>
.screen {
  display: none;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.screen.active {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.game-screen.active {
  justify-content: flex-start;
}
</style>
