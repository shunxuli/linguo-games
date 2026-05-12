<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices } from '../../stores/gameServices'
import { generateMaze, canMove, mazeSizes, type MazeCell, type MazePosition } from '../../engine/maze'
import { createSeededRandom } from '../../engine/sudoku'

const game = useGameStore()
const { speech, sound, addScore, storage } = useGameServices()

const size = ref(4)
const baseScore = computed(() => mazeSizes[size.value]?.score || 10)
const grid = ref<MazeCell[][]>([])
const playerPos = ref<MazePosition>({ x: 0, y: 0 })
const endPos = ref<MazePosition>({ x: 3, y: 3 })
const moves = ref(0)
const score = ref(10)
const isComplete = ref(false)

function initMaze() {
  const prng = createSeededRandom(Date.now())
  const m = generateMaze(size.value, prng)
  grid.value = m.grid
  playerPos.value = { ...m.start }
  endPos.value = { ...m.end }
  moves.value = 0
  score.value = baseScore.value
  isComplete.value = false
}

watch(() => game.currentScreen, (screen) => {
  if (screen === 'maze-game') {
    const s = storage.getMazeSize()
    if (s) size.value = s
    initMaze()
  }
})

function move(dir: string) {
  if (isComplete.value) return
  const { x, y } = playerPos.value
  if (!canMove(grid.value, x, y, dir)) return
  moves.value++
  score.value = Math.max(1, baseScore.value - Math.floor(moves.value / 4))
  switch (dir) {
    case 'up': playerPos.value = { x, y: y - 1 }; break
    case 'right': playerPos.value = { x: x + 1, y }; break
    case 'down': playerPos.value = { x, y: y + 1 }; break
    case 'left': playerPos.value = { x: x - 1, y }; break
  }
  if (playerPos.value.x === endPos.value.x && playerPos.value.y === endPos.value.y) {
    isComplete.value = true
    addScore(score.value)
    sound.playWin()
    speech.speak('到达终点了！', 'zh-CN')
    game.returnScreen = 'maze-config'
    game.showOverlay('win', { message: '走出迷宫啦！', score: score.value })
  }
}

function onKeydown(e: KeyboardEvent) {
  const map: Record<string, string> = { ArrowUp: 'up', ArrowRight: 'right', ArrowDown: 'down', ArrowLeft: 'left' }
  if (map[e.key]) { e.preventDefault(); move(map[e.key]) }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

function handleBack() {
  game.showConfirm('返回', '确定要退出吗？', () => game.navigateBackToConfig())
}
</script>

<template>
  <div class="game-container">
    <div class="header">
      <button
        class="header-btn"
        @click="handleBack"
      >
        ← 返回
      </button>
      <span class="badge">{{ size }}×{{ size }} {{ mazeSizes[size]?.name }}</span>
      <span class="score">⭐ {{ score }} | 🚶 {{ moves }}</span>
    </div>
    <div
      class="maze-grid"
      :style="{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
      }"
    >
      <div
        v-for="(row, y) in grid"
        :key="y"
      >
        <div
          v-for="(cell, x) in row"
          :key="x"
          class="maze-cell"
          :style="{
            borderTopWidth: cell.top ? '3px' : '1px',
            borderRightWidth: cell.right ? '3px' : '1px',
            borderBottomWidth: cell.bottom ? '3px' : '1px',
            borderLeftWidth: cell.left ? '3px' : '1px',
            borderColor: cell.top || cell.right || cell.bottom || cell.left ? '#333' : '#ddd',
          }"
        >
          <span
            v-if="playerPos.x === x && playerPos.y === y"
            class="player"
          >🐣</span>
          <span
            v-else-if="endPos.x === x && endPos.y === y"
            class="goal"
          >🚩</span>
        </div>
      </div>
    </div>
    <div class="controls">
      <button
        class="ctrl-btn"
        @click="move('up')"
      >
        ↑
      </button>
      <div class="ctrl-row">
        <button
          class="ctrl-btn"
          @click="move('left')"
        >
          ←
        </button>
        <button
          class="ctrl-btn"
          @click="move('down')"
        >
          ↓
        </button>
        <button
          class="ctrl-btn"
          @click="move('right')"
        >
          →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container { width: 100%; max-width: 500px; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.header { width: 100%; display: flex; align-items: center; gap: 8px; }
.header-btn { padding: 8px 12px; border-radius: var(--radius-sm); border: none; background: var(--card-bg); cursor: pointer; font-family: inherit; }
.badge { padding: 4px 10px; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; background: #FFF5E6; color: var(--primary); }
.score { font-weight: 700; color: var(--primary); }
.maze-grid { display: grid; gap: 0; width: 100%; max-width: 320px; aspect-ratio: 1; }
.maze-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; background: var(--card-bg); font-size: 1.5rem; transition: border-color 0.15s; }
.player { font-size: 1.8rem; }
.goal { font-size: 1.6rem; }
.controls { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.ctrl-row { display: flex; gap: 12px; }
.ctrl-btn { width: 56px; height: 56px; border-radius: var(--radius-sm); border: 2px solid #eee; background: var(--card-bg); font-size: 1.4rem; cursor: pointer; font-family: inherit; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-soft); }
.ctrl-btn:active { transform: scale(0.92); background: #FFF5E6; }
</style>
