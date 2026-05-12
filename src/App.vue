<script setup lang="ts">
import { useGameStore } from './stores/game'
import LobbyScreen from './components/screens/LobbyScreen.vue'

const game = useGameStore()
</script>

<template>
  <div
    class="screen"
    :class="{ active: game.currentScreen === 'lobby' }"
  >
    <LobbyScreen />
  </div>
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
  justify-content: center;
}
</style>
