<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices } from '../../stores/gameServices'
import {
  generateCards, getPairCount, isMatch, memoryThemes, memorySizes,
  type MemoryCard,
} from '../../engine/memory'
import { createSeededRandom } from '../../engine/sudoku'

type ThemeKey = keyof typeof memoryThemes

const game = useGameStore()
const { speech, sound, addScore } = useGameServices()

const themeKey = ref<ThemeKey>('emoji')
const gridSize = ref(2)
const pairCount = computed(() => getPairCount(gridSize.value))
const baseScore = computed(() => memorySizes[gridSize.value]?.score ?? 10)

const theme = computed(() => memoryThemes[themeKey.value])
const cards = ref<Array<MemoryCard & { flipped: boolean; matched: boolean; shaking: boolean }>>([])

const flippedCards = ref<number[]>([])
const isLocked = ref(false)
const mistakes = ref(0)
const matchedCount = ref(0)
const score = ref(0)
const isComplete = ref(false)

function initGame() {
  const raw = generateCards(pairCount.value, themeKey.value, createSeededRandom(Date.now()))
  cards.value = raw.map(c => ({
    ...c,
    flipped: false,
    matched: false,
    shaking: false,
  }))
  flippedCards.value = []
  isLocked.value = false
  mistakes.value = 0
  matchedCount.value = 0
  score.value = baseScore.value
  isComplete.value = false
}

watch(() => game.currentScreen, (screen) => {
  if (screen === 'memory-game') initGame()
})

function handleCardClick(index: number) {
  if (isLocked.value || isComplete.value) return
  const card = cards.value[index]
  if (card.matched || card.flipped) return
  if (flippedCards.value.length >= 2) return

  card.flipped = true
  flippedCards.value.push(index)

  if (flippedCards.value.length === 2) {
    const [i1, i2] = flippedCards.value
    if (isMatch(cards.value[i1], cards.value[i2])) {
      // Match!
      isLocked.value = true
      setTimeout(() => {
        cards.value[i1].matched = true
        cards.value[i2].matched = true
        matchedCount.value++
        flippedCards.value = []
        isLocked.value = false

        sound.playSuccess()
        speech.speak('找到一对啦！', 'zh-CN')

        if (matchedCount.value === pairCount.value) {
          isComplete.value = true
          addScore(score.value)
          setTimeout(() => {
            sound.playWin()
            speech.speak('太棒了！全部找到了！', 'zh-CN')
            game.returnScreen = 'memory-config'
            game.showOverlay('win', { message: '全部配对完啦！', score: score.value })
          }, 600)
        }
      }, 400)
    } else {
      // No match
      mistakes.value++
      score.value = Math.max(0, baseScore.value - mistakes.value)
      isLocked.value = true
      sound.playError()

      const c1 = cards.value[i1]
      const c2 = cards.value[i2]
      c1.shaking = true
      c2.shaking = true

      setTimeout(() => {
        c1.flipped = false
        c2.flipped = false
        c1.shaking = false
        c2.shaking = false
        flippedCards.value = []
        isLocked.value = false
      }, 800)
    }
  }
}

function handleBack() {
  game.showConfirm('返回', '确定要退出吗？', () => game.navigateBackToConfig())
}

function handleRestart() {
  game.showConfirm('重新开始', '确定要重新开始吗？', () => initGame())
}
</script>

<template>
  <div class="game-container">
    <div class="game-header">
      <button
        class="header-btn"
        @click="handleBack"
      >
        ← 返回
      </button>
      <div class="header-info">
        <span class="badge">{{ theme.icon }} {{ theme.name }}</span>
        <span class="badge diff">{{ gridSize }}×{{ gridSize }} {{ memorySizes[gridSize]?.name }}</span>
      </div>
      <button
        class="header-btn"
        @click="handleRestart"
      >
        🔄
      </button>
    </div>

    <div class="score-bar">
      <span>⭐ {{ score }}</span>
      <span v-if="mistakes > 0">❌ {{ mistakes }}</span>
    </div>

    <div
      class="card-grid"
      :style="{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }"
    >
      <div
        v-for="(card, i) in cards"
        :key="i"
        class="card-wrapper"
        :class="{
          flipped: card.flipped || card.matched,
          matched: card.matched,
          shaking: card.shaking,
        }"
        @click="handleCardClick(i)"
      >
        <div class="card-inner">
          <div class="card-front">
            <span class="card-question">?</span>
          </div>
          <div class="card-back">
            <template v-if="themeKey === 'color'">
              <div
                class="card-color-swatch"
                :style="{ backgroundColor: card.content }"
              />
            </template>
            <template v-else>
              <span class="card-content">{{ card.content }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container { width: 100%; max-width: 500px; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 16px; min-height: 100%; }

.game-header { width: 100%; display: flex; align-items: center; justify-content: space-between; }
.header-btn { padding: 8px 12px; border-radius: var(--radius-sm); border: none; background: var(--card-bg); font-size: 1.1rem; cursor: pointer; font-family: inherit; box-shadow: var(--shadow-soft); }
.header-info { display: flex; gap: 6px; }
.badge { padding: 4px 10px; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; background: #FFF5E6; color: var(--primary); }
.badge.diff { background: #EEE; color: var(--text-light); }

.score-bar { display: flex; gap: 16px; font-size: 1rem; font-weight: 600; color: var(--primary); }

.card-grid {
  display: grid;
  gap: 8px;
  width: 100%;
  max-width: 400px;
}

.card-wrapper { aspect-ratio: 1; perspective: 600px; cursor: pointer; }
.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.4s ease;
  transform-style: preserve-3d;
}
.card-wrapper.flipped .card-inner { transform: rotateY(180deg); }

.card-front, .card-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #ddd;
  -webkit-backface-visibility: hidden;
}

.card-front {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  z-index: 2;
}
.card-question { font-size: 2rem; color: rgba(255,255,255,0.7); font-weight: 800; }

.card-back {
  background: var(--card-bg);
  transform: rotateY(180deg);
}

.card-wrapper.matched .card-back {
  background: #E8F5E9;
  border-color: var(--success);
  box-shadow: 0 0 12px rgba(0, 210, 106, 0.3);
}

.card-wrapper.matched {
  animation: pop 0.3s ease;
}

@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

.card-wrapper.shaking .card-inner {
  animation: cardShake 0.4s ease;
}

@keyframes cardShake {
  0%, 100% { transform: rotateY(180deg) translateX(0); }
  20% { transform: rotateY(180deg) translateX(-4px); }
  40% { transform: rotateY(180deg) translateX(4px); }
  60% { transform: rotateY(180deg) translateX(-3px); }
  80% { transform: rotateY(180deg) translateX(3px); }
}

.card-content { font-size: 2.2rem; }

.card-color-swatch {
  width: 70%;
  height: 70%;
  border-radius: var(--radius-sm);
  border: 2px solid rgba(0,0,0,0.1);
}
</style>
