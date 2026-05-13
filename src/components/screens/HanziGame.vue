<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices } from '../../stores/gameServices'
import { generateQuestion, hanziDifficulties, type HanziQuestion, type HanziItem, type HanziMode } from '../../engine/hanzi'
import { createSeededRandom } from '../../engine/sudoku'

const game = useGameStore()
const { speech, sound, addScore, storage } = useGameServices()

const difficulty = ref(1)
const mode = ref<HanziMode>('picture')
const info = computed(() => hanziDifficulties[difficulty.value])
const baseScore = computed(() => info.value?.score || 10)

const question = ref<HanziQuestion | null>(null)
const answerState = ref<'waiting' | 'correct' | 'wrong'>('waiting')
const qNum = ref(0)
const correctCount = ref(0)
const streak = ref(0)
const score = ref(0)
let seed = 0

const totalNeeded = 10

function newQuestion() {
  question.value = generateQuestion(difficulty.value, mode.value, createSeededRandom(Date.now() + seed++))
  answerState.value = 'waiting'
  qNum.value++
  if (question.value?.mode === 'audio') {
    speakChar(question.value.item)
  } else {
    speakCharBrief(question.value?.item)
  }
}

function speakChar(item: HanziItem) {
  speech.speak(item.char + '，' + item.meaning, 'zh-CN')
}
function speakCharBrief(item: HanziItem | undefined) {
  if (!item) return
  speech.speak(item.char, 'zh-CN')
}

watch(() => game.currentScreen, (screen) => {
  if (screen === 'hanzi-game') {
    const d = storage.getHanziDifficulty()
    if (d) difficulty.value = d
    const m = storage.getHanziMode()
    if (m) mode.value = m as HanziMode
    qNum.value = 0
    correctCount.value = 0
    streak.value = 0
    score.value = 0
    seed = 0
    newQuestion()
  }
})

function selectAnswer(index: number) {
  if (answerState.value !== 'waiting') return
  const correct = index === question.value?.correctIndex
  if (correct) {
    correctCount.value++
    streak.value++
    answerState.value = 'correct'
    const bonus = Math.min(streak.value, 3)
    score.value += baseScore.value + bonus
    addScore(baseScore.value + bonus)
    sound.playSuccess()
    if (question.value?.item) {
      speech.speak('对了！' + question.value.item.char + '，' + question.value.item.meaning, 'zh-CN')
    }
    if (correctCount.value >= totalNeeded) {
      sound.playWin()
      speech.speak('太棒了！完成了！', 'zh-CN')
      setTimeout(() => {
        game.returnScreen = 'hanzi-config'
        game.showOverlay('win', { message: '认识了' + correctCount.value + '个汉字！', score: score.value })
      }, 800)
    } else {
      setTimeout(() => newQuestion(), 1000)
    }
  } else {
    streak.value = 0
    answerState.value = 'wrong'
    sound.playError()
    if (question.value?.item) {
      speech.speak('不对，这是' + question.value.options[index].char + '。再试试！', 'zh-CN')
    }
    setTimeout(() => { answerState.value = 'waiting' }, 500)
  }
}

function handleBack() {
  game.showConfirm('返回', '确定要退出吗？', () => game.navigateBackToConfig())
}
</script>

<template>
  <div class="game-container">
    <div class="header">
      <button class="header-btn" @click="handleBack">← 返回</button>
      <span class="badge">{{ info?.name }} · {{ info?.count }}字</span>
      <span class="badge mode-badge">{{ mode === 'picture' ? '🖼️ 看图' : mode === 'oracle' ? '🏺 象形' : '🔊 听音' }}</span>
      <div class="progress">✅ {{ correctCount }}/{{ totalNeeded }} ⭐ {{ score }}</div>
    </div>

    <div v-if="question" class="question-area">
      <!-- Mode label -->
      <div class="mode-label">
        <span v-if="question.mode === 'picture'">🖼️ 看图识字</span>
        <span v-else-if="question.mode === 'oracle'">🏺 象形识字</span>
        <span v-else>🔊 听音识字 <button class="replay-btn" @click="speakChar(question.item)">🔁</button></span>
      </div>

      <!-- Question display -->
      <div class="prompt">
        <template v-if="question.mode === 'picture'">
          <span class="big-emoji">{{ question.item.emoji }}</span>
        </template>
        <template v-else-if="question.mode === 'oracle'">
          <div class="oracle-box" v-html="'<svg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'>' + question.item.oracleSvg + '</svg>'" />
        </template>
        <template v-else>
          <div class="audio-hint">👂 听声音选字</div>
        </template>
      </div>

      <!-- Options -->
      <div class="options">
        <button
          v-for="(opt, i) in question.options"
          :key="opt.char"
          class="char-btn"
          :class="{
            correct: answerState === 'correct' && i === question.correctIndex,
            wrong: answerState !== 'waiting' && i !== question.correctIndex,
          }"
          :disabled="answerState !== 'waiting'"
          @click="selectAnswer(i)"
        >{{ opt.char }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container { width: 100%; max-width: 500px; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 16px; min-height: 100%; }
.header { width: 100%; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.header-btn { padding: 8px 12px; border-radius: var(--radius-sm); border: none; background: var(--card-bg); cursor: pointer; font-family: inherit; font-size: 0.9rem; box-shadow: var(--shadow-soft); }
.badge { padding: 4px 10px; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; background: #FFF5E6; color: var(--primary); }
.progress { font-size: 0.9rem; font-weight: 600; color: var(--primary); }
.question-area { display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%; }
.mode-label { font-size: 0.85rem; color: var(--text-light); }
.replay-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; padding: 2px 6px; }
.prompt { min-height: 120px; display: flex; align-items: center; justify-content: center; }
.big-emoji { font-size: 5rem; }
.oracle-box { width: 120px; height: 120px; }
.oracle-box :deep(svg) { width: 100%; height: 100%; }
.audio-hint { font-size: 1.5rem; color: var(--text-light); }
.options { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
.char-btn { width: 80px; height: 80px; border-radius: var(--radius-md); border: 3px solid #eee; background: var(--card-bg); font-size: 2.5rem; cursor: pointer; font-family: 'KaiTi', 'STKaiti', serif; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.char-btn:active { transform: scale(0.95); }
.char-btn.correct { border-color: var(--success); background: #E8F5E9; animation: pop 0.3s; }
.char-btn.wrong { border-color: var(--danger); animation: shake 0.4s; }
@keyframes pop { 50% { transform: scale(1.1); } }
@keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
</style>
