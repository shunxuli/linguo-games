<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices } from '../../stores/gameServices'
import { patternThemes, patternSizes, generatePatternQuestion, getPatternRulesForSize, type PatternRule } from '../../engine/pattern'

type ThemeKey = keyof typeof patternThemes

const game = useGameStore()
const { speech, sound, addScore, storage } = useGameServices()

const themeKey = ref<ThemeKey>('fruit')
const difficulty = ref(2)
const rule = ref<PatternRule>('AB')
const baseScore = computed(() => patternSizes[difficulty.value]?.score || 10)

const sequence = ref<string[]>([])
const options = ref<string[]>([])
const correctIdx = ref(0)
const questionNum = ref(0)
const correctCount = ref(0)
const totalCount = ref(0)
const streak = ref(0)
const score = ref(0)
const answerState = ref<'waiting' | 'correct' | 'wrong' | 'gameover'>('waiting')
const gameover = ref(false)

function newQuestion() {
  const q = generatePatternQuestion(themeKey.value, rule.value, Math.random)
  sequence.value = q.sequence
  options.value = q.options
  correctIdx.value = q.correctIndex
  answerState.value = 'waiting'
  questionNum.value++
}

watch(() => game.currentScreen, (screen) => {
  if (screen === 'pattern-game') {
    const t = storage.getPatternTheme()
    if (t) themeKey.value = t as ThemeKey
    const s = storage.getPatternSize()
    if (s) difficulty.value = s
    const rules = getPatternRulesForSize(difficulty.value)
    rule.value = rules[Math.floor(Math.random() * rules.length)]
    questionNum.value = 0
    correctCount.value = 0
    totalCount.value = 0
    streak.value = 0
    score.value = baseScore.value
    gameover.value = false
    newQuestion()
  }
})

function answer(index: number) {
  if (answerState.value !== 'waiting' || gameover.value) return
  totalCount.value++
  if (index === correctIdx.value) {
    correctCount.value++
    streak.value++
    answerState.value = 'correct'
    const bonus = Math.min(streak.value, 5)
    score.value += baseScore.value + bonus
    addScore(baseScore.value + bonus)
    sound.playSuccess()
    speech.speak('对啦！', 'zh-CN')
    if (correctCount.value >= 5) {
      gameover.value = true
      answerState.value = 'gameover'
      sound.playWin()
      game.returnScreen = 'pattern-config'
      game.showOverlay('win', { message: '答对5题，太棒了！', score: score.value })
      return
    }
    setTimeout(() => newQuestion(), 800)
  } else {
    streak.value = 0
    answerState.value = 'wrong'
    sound.playError()
    speech.speak('不对哦，再试试！', 'zh-CN')
    setTimeout(() => answerState.value = 'waiting', 1000)
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
      <span class="badge">{{ patternThemes[themeKey].name }}</span>
      <span class="badge diff">{{ difficulty }}级 {{ patternSizes[difficulty]?.name }}</span>
      <span class="score">⭐ {{ score }}</span>
    </div>
    <div class="progress">
      第 {{ questionNum }} 题 | ✅ {{ correctCount }}/5
    </div>
    <div class="sequence">
      <span
        v-for="(s, i) in sequence"
        :key="i"
        class="seq-item"
        :class="{ fade: answerState === 'correct' }"
      >{{ s }}</span>
      <span class="seq-item question">❓</span>
    </div>
    <div class="options">
      <button
        v-for="(opt, i) in options"
        :key="i"
        class="opt-btn"
        :class="{
          correct: answerState === 'correct' && i === correctIdx,
          wrong: answerState === 'wrong' && i !== correctIdx,
        }"
        :disabled="answerState !== 'waiting'"
        @click="answer(i)"
      >
        {{ opt }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-container { width: 100%; max-width: 500px; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 16px; min-height: 100%; }
.header { width: 100%; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.header-btn { padding: 8px 12px; border-radius: var(--radius-sm); border: none; background: var(--card-bg); cursor: pointer; font-family: inherit; }
.badge { padding: 4px 10px; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; background: #FFF5E6; color: var(--primary); }
.badge.diff { background: #EEE; color: var(--text-light); }
.score { font-weight: 700; color: var(--primary); }
.progress { font-size: 0.95rem; color: var(--text-light); }
.sequence { display: flex; gap: 8px; font-size: 2.5rem; flex-wrap: wrap; justify-content: center; }
.seq-item { transition: opacity 0.3s; }
.seq-item.fade { opacity: 0.5; }
.seq-item.question { color: var(--primary); animation: pulse 1s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
.options { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; width: 100%; max-width: 300px; }
.opt-btn { padding: 16px; border-radius: var(--radius-sm); border: 3px solid #eee; background: var(--card-bg); font-size: 2rem; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.opt-btn:active { transform: scale(0.95); }
.opt-btn.correct { border-color: var(--success); background: #E8F5E9; animation: pop 0.3s; }
.opt-btn.wrong { border-color: var(--danger); background: #FFEBEE; }
@keyframes pop { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
</style>
