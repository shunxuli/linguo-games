<script setup lang="ts">
import { useGameStore } from '../../stores/game'
import { useGameServices } from '../../stores/gameServices'

const game = useGameStore()
const { getTotalScore } = useGameServices()
</script>

<template>
  <div class="lobby-container">
    <div class="lobby-header">
      <h1 class="lobby-title">
        果果乐园
      </h1>
      <button
        class="settings-btn"
        @click="game.showOverlay('settings')"
      >
        ⚙️
      </button>
    </div>
    <div class="score-display">
      ⭐ {{ getTotalScore() }} 分
    </div>
    <p class="lobby-subtitle">
      选择一个游戏开始吧！
    </p>
    <div class="game-cards">
      <button
        class="game-card"
        @click="game.navigateTo('sudoku-config')"
      >
        <span class="game-icon">🔢</span>
        <span class="game-name">数独</span>
      </button>
      <button
        class="game-card"
        @click="game.navigateTo('math-config')"
      >
        <span class="game-icon">🧮</span>
        <span class="game-name">数学</span>
      </button>
      <button
        class="game-card"
        @click="game.navigateTo('puzzle-config')"
      >
        <span class="game-icon">🧩</span>
        <span class="game-name">拼图</span>
      </button>
      <button
        class="game-card"
        @click="game.navigateTo('memory-config')"
      >
        <span class="game-icon">🧠</span>
        <span class="game-name">记忆卡</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.lobby-container {
  width: 100%;
  max-width: 500px;
  text-align: center;
  padding: 20px;
}

.lobby-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.lobby-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--primary);
  text-shadow: 2px 2px 0px rgba(255,140,66,0.2);
  letter-spacing: 2px;
}

.settings-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px;
}

.score-display {
  font-size: 1.2rem;
  color: var(--warning);
  font-weight: 700;
  margin-bottom: 4px;
}

.lobby-subtitle {
  font-size: 1rem;
  color: var(--text-light);
  margin-bottom: 24px;
}

.game-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

.game-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 20px 14px;
  box-shadow: var(--shadow-soft);
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  border: 3px solid transparent;
  font-family: inherit;
  font-size: inherit;
}

.game-card:active {
  transform: scale(0.96);
  box-shadow: var(--shadow-3d-active);
}

.game-icon {
  font-size: 2.5rem;
}

.game-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-main);
}
</style>
