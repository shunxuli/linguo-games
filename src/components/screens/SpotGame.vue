<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices } from '../../stores/gameServices'
import { spotSizes, generateSpotQuestion, type SpotQuestion } from '../../engine/spot'
import { createSeededRandom } from '../../engine/random'

const game = useGameStore()
const { speech, sound, addScore, storage } = useGameServices()

const difficulty = ref(2)
const baseScore = computed(() => spotSizes[difficulty.value]?.score || 10)

const question = ref<SpotQuestion | null>(null)
const selectedIdx = ref<number | null>(null)
const answerState = ref<'waiting' | 'correct' | 'wrong'>('waiting')
const questionNum = ref(0)
const correctCount = ref(0)
const streak = ref(0)
const score = ref(0)
const gameover = ref(false)
let questionSeed = 0

function newQuestion() {
  question.value = generateSpotQuestion(difficulty.value, createSeededRandom(Date.now() + questionSeed++))
  selectedIdx.value = null
  answerState.value = 'waiting'
  questionNum.value++
}

watch(() => game.currentScreen, (screen) => {
  if (screen === 'spot-game') {
    const s = storage.getSpotSize()
    if (s) difficulty.value = s
    questionNum.value = 0
    correctCount.value = 0
    streak.value = 0
    score.value = baseScore.value
    gameover.value = false
    newQuestion()
  }
})

function selectItem(index: number) {
  if (answerState.value !== 'waiting' || gameover.value) return
  selectedIdx.value = index
  const isCorrect = index === question.value?.oddIndex
  if (isCorrect) {
    correctCount.value++
    streak.value++
    answerState.value = 'correct'
    const bonus = Math.min(streak.value, 3)
    score.value += baseScore.value + bonus
    addScore(baseScore.value + bonus)
    sound.playSuccess()
    if (question.value?.items[index]) {
      speech.speak(question.value.items[index].label + '是不同类的！', 'zh-CN')
    }
    if (correctCount.value >= 5) {
      gameover.value = true
      sound.playWin()
      game.returnScreen = 'spot-config'
      game.showOverlay('win', { message: '找对5个，太棒了！', score: score.value })
      return
    }
    setTimeout(() => newQuestion(), 1000)
  } else {
    streak.value = 0
    answerState.value = 'wrong'
    sound.playError()
    speech.speak('不对，再找找看！', 'zh-CN')
    setTimeout(() => {
      selectedIdx.value = null
      answerState.value = 'waiting'
    }, 800)
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
      <span class="badge">{{ difficulty }}级 {{ spotSizes[difficulty]?.name }}</span>
      <span class="score">⭐ {{ score }}</span>
    </div>
    <div class="progress">
      第 {{ questionNum }} 题 | ✅ {{ correctCount }}/5
    </div>
    <p class="prompt">
      哪一个不同类？点它！
    </p>
    <div
      v-if="question"
      class="items-grid"
      :style="{ gridTemplateColumns: `repeat(auto-fit, minmax(80px, 1fr))` }"
    >
      <button
        v-for="(item, i) in question.items"
        :key="i"
        class="item-btn"
        :class="{
          selected: selectedIdx === i,
          correct: answerState === 'correct' && i === question.oddIndex,
          wrong: answerState === 'wrong' && selectedIdx === i,
        }"
        :disabled="answerState !== 'waiting'"
        @click="selectItem(i)"
      >
        <span class="item-emoji">{{ item.emoji }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-container { width: 100%; max-width: 500px; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 16px; min-height: 100%; }
.header { width: 100%; display: flex; align-items: center; gap: 8px; }
.header-btn { padding: 8px 12px; border-radius: var(--radius-sm); border: none; background: var(--card-bg); cursor: pointer; font-family: inherit; }
.badge { padding: 4px 10px; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; background: #FFF5E6; color: var(--primary); }
.score { font-weight: 700; color: var(--primary); }
.progress { font-size: 0.95rem; color: var(--text-light); }
.prompt { font-size: 1.1rem; color: var(--text-main); font-weight: 600; }
.items-grid { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; max-width: 400px; }
.item-btn { width: 80px; height: 80px; border-radius: var(--radius-md); border: 3px solid #eee; background: var(--card-bg); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-family: inherit; }
.item-emoji { font-size: 2.5rem; }
.item-btn.selected { border-color: var(--secondary); transform: scale(1.05); }
.item-btn.correct { border-color: var(--success); background: #E8F5E9; animation: pop 0.3s; }
.item-btn.wrong { border-color: var(--danger); animation: shake 0.4s; }
@keyframes pop { 50% { transform: scale(1.1); } }
@keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
</style>
