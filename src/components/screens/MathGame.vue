<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices, mathRanges } from '../../stores/gameServices'
import { MathEngine } from '../../engine/math'
import { createSeededRandom } from '../../engine/random'
import type { MathOp, MathQuestion } from '../../engine/math'

const game = useGameStore()
const { storage, speech, sound, init, addScore } = useGameServices()

const prng = createSeededRandom(Date.now())
const engine = new MathEngine()

const op = ref<MathOp>((storage.getLastOp() as MathOp) || 'add')
const range = ref(storage.getLastRange() || 10)
const baseScore = computed(() => mathRanges[range.value] || 5)

const question = ref<MathQuestion | null>(null)
const userAnswer = ref('')
const streak = ref(0)
const correctCount = ref(0)
const totalCount = ref(0)
const score = ref(0)
const hintsUsed = ref(0)

const opName = computed(() => {
  const map: Record<MathOp, string> = { add: '➕ 加法', sub: '➖ 减法', mix: '± 混合' }
  return map[op.value] || '数学'
})

function generateQuestion() {
  question.value = engine.generateQuestion(range.value, op.value, prng)
  userAnswer.value = ''
}

function inputDigit(d: string) {
  if (userAnswer.value.length >= 3) return
  userAnswer.value += d
  checkAuto()
}

function inputBackspace() {
  userAnswer.value = userAnswer.value.slice(0, -1)
}

function checkAuto() {
  if (!question.value) return
  const answerDigits = question.value.answer.toString().length
  if (userAnswer.value.length >= answerDigits) {
    checkAnswer()
  }
}

function checkAnswer() {
  if (!question.value) return
  if (engine.checkAnswer(userAnswer.value, question.value.answer)) {
    handleCorrect()
  } else {
    handleWrong()
  }
}

function handleCorrect() {
  if (!question.value) return
  streak.value++
  correctCount.value++
  totalCount.value++
  const points = baseScore.value + Math.min(streak.value, 5)
  score.value += points
  addScore(points)
  sound.playSuccess()
  speech.speak('对了！', 'zh-CN')
  setTimeout(() => generateQuestion(), 400)
}

function handleWrong() {
  if (!question.value) return
  streak.value = 0
  totalCount.value++
  sound.playError()
  const msg = `答案是 ${question.value.answer}`
  game.showOverlay('error', { message: msg })
  speech.speak(msg, 'zh-CN')
  setTimeout(() => {
    userAnswer.value = ''
    game.hideOverlay()
  }, 1500)
}

function handleHint() {
  if (hintsUsed.value >= 3 || !question.value) return
  hintsUsed.value++
  score.value = Math.max(0, score.value - 2)
  game.showOverlay('hint', {
    message: '答案提示',
    display: String(question.value.answer),
  })
  speech.speak(`答案是 ${question.value.answer}`, 'zh-CN')
}

function handleSkip() {
  generateQuestion()
}

function handleBack() {
  game.showConfirm('退出游戏', '确定要退出数学游戏吗？', () => {
    game.navigateBackToConfig()
  })
}

function handleHelp() {
  game.showOverlay('tutorial')
  speech.speak(
    '这是一个数学游戏。你会看到一道算术题，用数字键盘输入答案。答对了有加分，连续答对还有额外奖励。加油！',
    'zh-CN',
  )
}

watch(() => game.currentScreen, (screen) => {
  if (screen === 'math-game') {
    init()
    // Re-read config from storage
    const so = storage.getLastOp()
    if (so) op.value = so as MathOp
    const sr = storage.getLastRange()
    if (sr) range.value = sr
    streak.value = 0
    correctCount.value = 0
    totalCount.value = 0
    score.value = 0
    hintsUsed.value = 0
    generateQuestion()
  }
}, { immediate: true })
</script>

<template>
  <div class="math-game">
    <div class="header">
      <button
        class="btn-back"
        @click="handleBack"
      >
        ← 返回
      </button>
      <span class="badge mode-badge">{{ opName }}</span>
      <span class="badge diff-badge">{{ range }}以内</span>
      <span class="badge score-badge">⭐ {{ score }}</span>
    </div>

    <div class="question-card">
      <div class="equation">
        <span class="eq-num">{{ question?.num1 }}</span>
        <span class="eq-op">{{ question?.operator }}</span>
        <span class="eq-num">{{ question?.num2 }}</span>
        <span class="eq-equals">=</span>
        <span
          class="eq-answer"
          :class="{ empty: !userAnswer }"
        >{{ userAnswer || '?' }}</span>
      </div>
      <div class="stats-row">
        <span class="stat">✅ {{ correctCount }}</span>
        <span class="stat">📝 {{ totalCount }}</span>
        <span
          v-if="streak > 1"
          class="streak-badge"
        >🔥 {{ streak }}连对!</span>
      </div>
    </div>

    <div class="numpad">
      <button
        v-for="d in '123456789'"
        :key="d"
        class="num-btn"
        @click="inputDigit(d)"
      >
        {{ d }}
      </button>
      <button
        class="num-btn backspace-btn"
        @click="inputBackspace"
      >
        ⌫
      </button>
      <button
        class="num-btn zero-btn"
        @click="inputDigit('0')"
      >
        0
      </button>
    </div>

    <div class="bottom-bar">
      <button
        class="ctrl-btn hint-btn"
        :disabled="hintsUsed >= 3"
        @click="handleHint"
      >
        💡 提示
        <span class="hint-count">{{ 3 - hintsUsed }}</span>
      </button>
      <button
        class="ctrl-btn skip-btn"
        @click="handleSkip"
      >
        ⏭ 跳过
      </button>
      <button
        class="ctrl-btn help-btn"
        @click="handleHelp"
      >
        📖 帮助
      </button>
    </div>
  </div>
</template>

<style scoped>
.math-game {
  width: 100%;
  max-width: 500px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: 12px;
}

.header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-back {
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  background: var(--card-bg);
  border: 2px solid #e0e0e0;
  cursor: pointer;
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--text-main);
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-back:active {
  transform: scale(0.95);
}

.badge {
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.mode-badge {
  background: #E8F5E9;
  color: #2E7D32;
}

.diff-badge {
  background: #E3F2FD;
  color: #1565C0;
}

.score-badge {
  background: #FFF3E0;
  color: #E65100;
  margin-left: auto;
}

.question-card {
  width: 100%;
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 24px 20px;
  box-shadow: var(--shadow-soft);
  text-align: center;
}

.equation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.eq-num {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--secondary);
  font-variant-numeric: tabular-nums;
}

.eq-op {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-main);
}

.eq-equals {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-light);
}

.eq-answer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  padding: 4px 16px;
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--primary);
  border-bottom: 4px solid var(--primary);
  border-radius: 4px;
  font-variant-numeric: tabular-nums;
  transition: color 0.2s;
}

.eq-answer.empty {
  color: var(--text-light);
  border-bottom-color: #ccc;
}

.stats-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.stat {
  font-size: 0.9rem;
  color: var(--text-light);
}

.streak-badge {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--warning);
  animation: pulse 0.6s ease-in-out infinite alternate;
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}

.numpad {
  width: 100%;
  max-width: 360px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.num-btn {
  aspect-ratio: 1;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1.8rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  background: var(--card-bg);
  color: var(--text-main);
  box-shadow: var(--shadow-3d);
  transition: all 0.12s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.num-btn:active {
  transform: translateY(3px);
  box-shadow: var(--shadow-3d-active);
}

.backspace-btn {
  background: #ffebee;
  color: var(--danger);
  font-size: 1.4rem;
}

.zero-btn {
  background: #e8f5e9;
  color: var(--success);
}

.bottom-bar {
  width: 100%;
  max-width: 360px;
  display: flex;
  gap: 8px;
}

.ctrl-btn {
  flex: 1;
  padding: 12px 8px;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.ctrl-btn:active {
  transform: scale(0.96);
}

.hint-btn {
  background: #FFF9C4;
  color: #F57F17;
}

.hint-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hint-count {
  font-size: 0.75rem;
  background: #F57F17;
  color: #fff;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skip-btn {
  background: #E1F5FE;
  color: #0277BD;
}

.help-btn {
  background: #F3E5F5;
  color: #7B1FA2;
}
</style>
