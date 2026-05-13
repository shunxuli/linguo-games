<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
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
const wrongIdx = ref<number | null>(null)
const qNum = ref(0)
const correctCount = ref(0)
const streak = ref(0)
const score = ref(0)
let seed = 0

const totalNeeded = 10

function newQuestion() {
  speech.cancelAll()
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
  speech.cancelAll()
  speech.speak(item.char + '，' + item.meaning, 'zh-CN')
}
function speakCharBrief(item: HanziItem | undefined) {
  if (!item) return
  speech.cancelAll()
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
    if (mode.value === 'browse') {
      initBrowse()
      browseIdx.value = 0
    } else {
      newQuestion()
    }
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
      const item = question.value.item
      speech.cancelAll()
      if (correctCount.value >= totalNeeded) {
        const total = totalNeeded
        speech.speak('对了！' + item.char + '，' + item.word + '的' + item.char, 'zh-CN', () => {
          sound.playWin()
          speech.speak('太棒了！完成了！', 'zh-CN', () => {
            game.returnScreen = 'hanzi-config'
            game.showOverlay('win', { message: '认识了' + total + '个汉字！', score: score.value })
          })
        })
      } else {
        speech.speak('对了！' + item.char + '，' + item.word + '的' + item.char, 'zh-CN', () => {
          newQuestion()
        })
      }
    }
  } else {
    streak.value = 0
    answerState.value = 'wrong'
    wrongIdx.value = index
    sound.playError()
    speech.cancelAll()
    const wrongChar = question.value?.options[index]?.char || '这个'
    speech.speak('不对，这是' + wrongChar + '，再试试！', 'zh-CN')
    setTimeout(() => { answerState.value = 'waiting'; wrongIdx.value = null }, 600)
  }
}

function handleBack() {
  game.showConfirm('返回', '确定要退出吗？', () => game.navigateBackToConfig())
}

// Browse mode state
const browseIdx = ref(0)
const browseFiles = ref<string[]>([])
const browseLoaded = ref(false)

function initBrowse() {
  if (browseLoaded.value) return
  const files = [
    '13420631487449290.jpeg', '13420631507716150.jpeg', '13420631520416613.jpeg', '13420631530817498.jpeg', '13420631543595438.jpeg',
    '13420631558865811.jpeg', '13420631569204896.jpeg', '13420631578300429.jpeg', '13420631591950345.jpeg', '13420631601963095.jpeg',
    '13420631612406452.jpeg', '13420631628283056.jpeg', '13420631639547790.jpeg', '13420631649870795.jpeg', '13420631663018209.jpeg',
    '13420631674398757.jpeg', '13420631684550291.jpeg', '13420631694758349.jpeg', '13421751175700809.jpeg', '13421751191017596.jpeg',
    '13421751205426598.jpeg', '13421751217188658.jpeg', '13421751227750793.jpeg', '13421751238726301.jpeg', '13421751249617406.jpeg',
    '13421751259212305.jpeg', '13421751269231781.jpeg', '13421751280954542.jpeg', '13421751290460779.jpeg', '13421751301159437.jpeg',
    '13421751311642184.jpeg', '13421751321288206.jpeg', '13421751330664209.jpeg', '13421751339875174.jpeg', '13421751349813092.jpeg',
    '13421751361318271.jpeg', '13421751372365388.jpeg', '13421751382286820.jpeg', '13421751392209972.jpeg', '13421751403121445.jpeg',
    '13421751414401711.jpeg', '13421751424002058.jpeg', '13421751435101106.jpeg', '13421751445330086.jpeg', '13421751472247172.jpeg',
    '13421751487712683.jpeg', '13421751498478396.jpeg', '13421751508972234.jpeg', '13421751520530624.jpeg', '13421751532897142.jpeg',
  ]
  browseFiles.value = files
  browseLoaded.value = true
}

function browsePrev() { if (browseIdx.value > 0) browseIdx.value-- }
function browseNext() { if (browseIdx.value < browseFiles.value.length - 1) browseIdx.value++ }

function handleBrowseKey(e: KeyboardEvent) {
  if (game.currentScreen !== 'hanzi-game' || mode.value !== 'browse') return
  if (e.key === 'ArrowLeft') browsePrev()
  if (e.key === 'ArrowRight') browseNext()
  if (e.key === 'Escape') game.navigateBackToConfig()
}

onMounted(() => window.addEventListener('keydown', handleBrowseKey))
onUnmounted(() => window.removeEventListener('keydown', handleBrowseKey))
</script>

<template>
  <!-- Browse mode -->
  <div v-if="mode === 'browse'" class="browse-container">
    <div class="browse-header">
      <button class="browse-back" @click="game.navigateBackToConfig()">← 返回</button>
      <span class="browse-count">{{ browseIdx + 1 }} / {{ browseFiles.length }}</span>
    </div>
    <div class="browse-image-area" @click="browseNext">
      <img v-if="browseFiles[browseIdx]" :src="'browse/' + browseFiles[browseIdx]" class="browse-img" alt="浏览图片" />
    </div>
    <div class="browse-nav">
      <button class="browse-btn" :disabled="browseIdx <= 0" @click="browsePrev">◀ 上一张</button>
      <button class="browse-btn" :disabled="browseIdx >= browseFiles.length - 1" @click="browseNext">下一张 ▶</button>
    </div>
  </div>

  <!-- Quiz modes -->
  <div v-else class="game-container">
    <div class="header">
      <button class="header-btn" @click="handleBack">← 返回</button>
      <span class="badge">{{ info?.name }} · {{ info?.count }}字</span>
      <span class="badge mode-badge">{{ mode === 'picture' ? '🖼️ 看图' : mode === 'oracle' ? '🏺 象形' : '🔊 听音' }}</span>
      <div class="progress">✅ {{ correctCount }}/{{ totalNeeded }} ⭐ {{ score }}</div>
    </div>

    <div v-if="question" class="question-area">
      <div class="mode-label">
        <span v-if="question.mode === 'picture'">🖼️ 看图识字 <button class="replay-btn" @click="speakChar(question.item)">🔊</button></span>
        <span v-else-if="question.mode === 'oracle'">🏺 象形识字 <button class="replay-btn" @click="speakChar(question.item)">🔊</button></span>
        <span v-else>🔊 听音识字 <button class="replay-btn" @click="speakChar(question.item)">🔁</button></span>
      </div>
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
      <div class="options">
        <button v-for="(opt, i) in question.options" :key="opt.char" class="char-btn"
          :class="{ correct: answerState === 'correct' && i === question.correctIndex, wrong: answerState === 'wrong' && i === wrongIdx }"
          :disabled="answerState !== 'waiting'" @click="selectAnswer(i)">{{ opt.char }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Quiz styles */
.game-container { width: 100%; max-width: 500px; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 16px; min-height: 100%; }
.header { width: 100%; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.header-btn { padding: 8px 12px; border-radius: var(--radius-sm); border: none; background: var(--card-bg); cursor: pointer; font-family: inherit; font-size: 0.9rem; box-shadow: var(--shadow-soft); }
.badge { padding: 4px 10px; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; background: #FFF5E6; color: var(--primary); }
.progress { font-size: 0.9rem; font-weight: 600; color: var(--primary); }
.question-area { display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%; }
.mode-label { font-size: 0.85rem; color: var(--text-light); }
.replay-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; padding: 8px 12px; min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; vertical-align: middle; -webkit-tap-highlight-color: transparent; border-radius: 50%; transition: background 0.1s, transform 0.1s; }
.replay-btn:active { background: rgba(0,0,0,0.08); transform: scale(0.85); }
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

/* Browse styles */
.browse-container { width: 100%; height: 100%; display: flex; flex-direction: column; background: #1a1a2e; }
.browse-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(0,0,0,0.3); }
.browse-back { padding: 8px 16px; border-radius: var(--radius-sm); border: none; background: rgba(255,255,255,0.15); color: #fff; cursor: pointer; font-family: inherit; font-size: 0.9rem; }
.browse-count { color: rgba(255,255,255,0.6); font-size: 0.9rem; }
.browse-image-area { flex: 1; display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; padding: 16px; }
.browse-img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px; }
.browse-nav { display: flex; gap: 12px; justify-content: center; padding: 12px 16px; background: rgba(0,0,0,0.3); }
.browse-btn { padding: 10px 24px; border-radius: var(--radius-sm); border: none; background: rgba(255,255,255,0.15); color: #fff; cursor: pointer; font-family: inherit; font-size: 1rem; }
.browse-btn:disabled { opacity: 0.3; cursor: default; }
</style>
