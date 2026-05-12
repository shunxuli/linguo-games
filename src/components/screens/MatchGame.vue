<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices } from '../../stores/gameServices'
import { matchThemes, matchSizes, generateMatchPairs, shuffleSides, type MatchSide } from '../../engine/match'
import { createSeededRandom } from '../../engine/sudoku'

type ThemeKey = keyof typeof matchThemes

const game = useGameStore()
const { speech, sound, addScore, storage } = useGameServices()

const themeKey = ref<ThemeKey>('food')
const difficulty = ref(2)
const baseScore = computed(() => matchSizes[difficulty.value]?.score || 10)

const leftItems = ref<MatchSide[]>([])
const rightItems = ref<MatchSide[]>([])
const selectedLeft = ref<number | null>(null)
const matchedPairs = ref<Set<number>>(new Set())
const score = ref(0)
const mistakes = ref(0)
const isComplete = ref(false)

const matchLines = computed(() => {
  const lines: Array<{ top: number; height: number }> = []
  for (let i = 0; i < leftItems.value.length; i++) {
    const li = leftItems.value[i]
    if (matchedPairs.value.has(li.index)) {
      const ri = rightItems.value.findIndex(r => r.index === li.index)
      lines.push({
        top: Math.min(i, ri) * 56 + 28,
        height: Math.abs(ri - i) * 56,
      })
    }
  }
  return lines
})

function initGame() {
  const info = matchSizes[difficulty.value]
  const prng = createSeededRandom(Date.now())
  const pairs = generateMatchPairs(themeKey.value, info.pairs, prng)
  const { lefts, rights } = shuffleSides(pairs, prng)
  leftItems.value = lefts
  rightItems.value = rights
  matchedPairs.value = new Set()
  selectedLeft.value = null
  score.value = info.score
  mistakes.value = 0
  isComplete.value = false
}

watch(() => game.currentScreen, (screen) => {
  if (screen === 'match-game') {
    const t = storage.getMatchTheme()
    if (t) themeKey.value = t as ThemeKey
    const s = storage.getMatchSize()
    if (s) difficulty.value = s
    initGame()
  }
})

function selectLeft(index: number) {
  if (isComplete.value) return
  if (matchedPairs.value.has(leftItems.value[index].index)) return
  selectedLeft.value = index
}

function selectRight(index: number) {
  if (isComplete.value || selectedLeft.value === null) return
  if (matchedPairs.value.has(rightItems.value[index].index)) return

  const leftPair = leftItems.value[selectedLeft.value]
  const rightPair = rightItems.value[index]

  if (leftPair.index === rightPair.index) {
    matchedPairs.value = new Set([...matchedPairs.value, leftPair.index])
    selectedLeft.value = null
    sound.playSuccess()
    speech.speak('配对成功！', 'zh-CN')

    if (matchedPairs.value.size === leftItems.value.length) {
      isComplete.value = true
      score.value = Math.max(0, baseScore.value - mistakes.value)
      addScore(score.value)
      sound.playWin()
      game.returnScreen = 'match-config'
      game.showOverlay('win', { message: '全部配对完成！', score: score.value })
    }
  } else {
    mistakes.value++
    sound.playError()
    selectedLeft.value = null
  }
}

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
      <span class="badge">{{ matchThemes[themeKey]?.name }}</span>
      <span class="score">⭐ {{ score }}</span>
    </div>
    <div class="board">
      <div class="column">
        <div
          v-for="(item, i) in leftItems"
          :key="i"
          class="item"
          :class="{
            selected: selectedLeft === i,
            matched: matchedPairs.has(item.index),
          }"
          @click="selectLeft(i)"
        >
          <span class="item-emoji">{{ item.item }}</span>
        </div>
      </div>
      <div class="lines-col">
        <div
          v-for="(line, i) in matchLines"
          :key="'l' + i"
          class="line-connector"
          :style="{ top: line.top + 'px', height: line.height + 'px' }"
        />
      </div>
      <div class="column">
        <div
          v-for="(item, i) in rightItems"
          :key="i"
          class="item"
          :class="{
            'hover-match': selectedLeft !== null && !matchedPairs.has(item.index),
            matched: matchedPairs.has(item.index),
          }"
          @click="selectRight(i)"
        >
          <span class="item-emoji">{{ item.item }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container { width: 100%; max-width: 500px; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 16px; min-height: 100%; }
.header { width: 100%; display: flex; align-items: center; gap: 8px; }
.header-btn { padding: 8px 12px; border-radius: var(--radius-sm); border: none; background: var(--card-bg); cursor: pointer; font-family: inherit; }
.badge { padding: 4px 10px; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; background: #FFF5E6; color: var(--primary); }
.score { font-weight: 700; color: var(--primary); }
.board { display: flex; gap: 0; position: relative; width: 100%; max-width: 400px; }
.column { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.item { padding: 8px; border-radius: var(--radius-sm); border: 3px solid #eee; background: var(--card-bg); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; aspect-ratio: 1; }
.item-emoji { font-size: 2rem; }
.item.selected { border-color: var(--secondary); background: #E8F0FE; }
.item.matched { border-color: var(--success); background: #E8F5E9; opacity: 0.8; }
.item.hover-match { border-color: var(--secondary); }
.lines-col { position: relative; width: 20px; flex-shrink: 0; }
.line-connector { position: absolute; left: 8px; width: 4px; background: var(--success); opacity: 0.6; border-radius: 2px; }
</style>
