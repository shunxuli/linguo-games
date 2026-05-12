<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices } from '../../stores/gameServices'
import { initHanoi, moveRing, undoLastMove, getTopRing, generateSolution, getScore, hanoiDifficulties, type HanoiState } from '../../engine/hanoi'

const COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF8C42', '#A29BFE', '#FF69B4']

const game = useGameStore()
const { speech, sound, addScore, storage } = useGameServices()

const rings = ref(3)
const state = ref<HanoiState>(initHanoi(3))
const selectedPeg = ref<number | null>(null)
const invalidPeg = ref<number | null>(null)
const demoRunning = ref(false)
let demoTimer: ReturnType<typeof setInterval> | null = null

const baseScore = computed(() => hanoiDifficulties[rings.value]?.score || 15)

const completionChoices = ref(false)
const canUpgrade = computed(() => rings.value < 5)

function initGame() {
  stopDemo()
  state.value = initHanoi(rings.value)
  selectedPeg.value = null
  completionChoices.value = false
}

watch(() => game.currentScreen, (screen) => {
  if (screen === 'hanoi-game') {
    const s = storage.getHanoiRings()
    if (s) rings.value = s
    initGame()
  }
})

function handlePegClick(pegIndex: number) {
  if (demoRunning.value || state.value.isComplete) return
  invalidPeg.value = null
  if (selectedPeg.value === null) {
    if (getTopRing(state.value.pegs, pegIndex) !== null) {
      selectedPeg.value = pegIndex
    }
  } else {
    if (selectedPeg.value === pegIndex) {
      selectedPeg.value = null
    } else {
      const ok = moveRing(state.value, selectedPeg.value, pegIndex)
      if (ok) {
        sound.playTone(500 + state.value.pegs[pegIndex].length * 80, 0.1)
        selectedPeg.value = null
        if (state.value.isComplete) {
          setTimeout(() => {
            sound.playWin()
            speech.speak('完成啦！', 'zh-CN')
            const s = getScore(baseScore.value, state.value.moves, state.value.minMoves)
            addScore(s)
            completionChoices.value = true
          }, 300)
        }
      } else {
        invalidPeg.value = pegIndex
        sound.playError()
        setTimeout(() => { invalidPeg.value = null }, 400)
      }
    }
  }
}

function handleUndo() {
  if (demoRunning.value || state.value.isComplete) return
  if (undoLastMove(state.value)) {
    selectedPeg.value = null
  }
}

function startDemo() {
  if (state.value.pegs[0].length !== state.value.ringCount) return
  demoRunning.value = true
  selectedPeg.value = null
  const solution = generateSolution(rings.value)
  let idx = 0
  demoTimer = setInterval(() => {
    if (idx >= solution.length) {
      stopDemo()
      return
    }
    const { from, to } = solution[idx]
    moveRing(state.value, from, to)
    idx++
  }, 500)
}

function stopDemo() {
  demoRunning.value = false
  if (demoTimer) { clearInterval(demoTimer); demoTimer = null }
}

function replayGame() {
  initGame()
}

function upgradeGame() {
  if (rings.value < 5) {
    rings.value++
    storage.setHanoiRings(rings.value)
    initGame()
  }
}

function handleBack() {
  stopDemo()
  game.showConfirm('返回', '确定要退出吗？', () => game.navigateBackToConfig())
}

const ringWidth = (r: number) => `${30 + r * 24}px`

// Drag support
const dragRing = ref<number | null>(null)
const dragSourcePeg = ref<number | null>(null)
let dragHanoiEl: HTMLElement | null = null
let dragHanoiStartX = 0
let dragHanoiStartY = 0
let dragHanoiMoved = false

function onRingDragStart(e: MouseEvent | TouchEvent, pegIndex: number) {
  if (demoRunning.value || state.value.isComplete) return
  if (state.value.pegs[pegIndex].length === 0) return
  e.preventDefault()
  const ring = getTopRing(state.value.pegs, pegIndex)
  dragRing.value = ring
  dragSourcePeg.value = pegIndex
  dragHanoiMoved = false
  const pt = 'touches' in e ? e.touches[0] : e
  dragHanoiStartX = pt.clientX
  dragHanoiStartY = pt.clientY
}

function onRingDragMove(e: MouseEvent | TouchEvent) {
  if (dragSourcePeg.value === null) return
  const pt = 'touches' in e ? e.touches[0] : e
  if (!dragHanoiMoved && (Math.abs(pt.clientX - dragHanoiStartX) > 8 || Math.abs(pt.clientY - dragHanoiStartY) > 8)) {
    dragHanoiMoved = true
    dragHanoiEl = document.createElement('div')
    const w = 30 + (dragRing.value || 1) * 24
    dragHanoiEl.style.cssText = `position:fixed;pointer-events:none;z-index:200;width:${w}px;height:28px;border-radius:14px;background:${COLORS[(dragRing.value || 1) - 1 % COLORS.length]};transform:translate(-50%,-50%);box-shadow:0 4px 12px rgba(0,0,0,0.3);`
    document.body.appendChild(dragHanoiEl)
  }
  if (dragHanoiEl) {
    dragHanoiEl.style.left = pt.clientX + 'px'
    dragHanoiEl.style.top = pt.clientY + 'px'
  }
}

function onRingDragEnd(e: MouseEvent | TouchEvent) {
  if (dragSourcePeg.value === null) return
  if (dragHanoiEl) {
    const pt = 'changedTouches' in e ? (e as TouchEvent).changedTouches[0] : (e as MouseEvent)
    const el = document.elementFromPoint(pt.clientX, pt.clientY)
    if (el) {
      const pegEl = el.closest('[data-peg]') as HTMLElement | null
      if (pegEl) {
        const targetPeg = parseInt(pegEl.dataset.peg || '')
        if (!isNaN(targetPeg) && targetPeg !== dragSourcePeg.value) {
          moveRing(state.value, dragSourcePeg.value, targetPeg)
          if (state.value.isComplete) {
            sound.playWin()
            speech.speak('完成啦！', 'zh-CN')
            const s = getScore(baseScore.value, state.value.moves, state.value.minMoves)
            addScore(s)
            completionChoices.value = true
          }
        }
      }
    }
    dragHanoiEl.remove()
    dragHanoiEl = null
  }
  dragRing.value = null
  dragSourcePeg.value = null
  dragHanoiMoved = false
}
</script>

<template>
  <div class="game-container" @mousemove="onRingDragMove" @touchmove.prevent="onRingDragMove" @mouseup="onRingDragEnd" @touchend="onRingDragEnd">
    <div class="header">
      <button class="header-btn" @click="handleBack">← 返回</button>
      <span class="badge">{{ rings }}环 {{ hanoiDifficulties[rings]?.name }}</span>
      <div class="header-actions">
        <span class="steps">步数 {{ state.moves }} / 最少 {{ state.minMoves }}</span>
        <button class="header-btn small" :disabled="demoRunning || state.moves === 0" @click="handleUndo">↩ 撤销</button>
        <button class="header-btn small demo" :disabled="demoRunning || state.pegs[0].length !== state.ringCount" @click="startDemo">▶ 演示</button>
        <button v-if="demoRunning" class="header-btn small stop" @click="stopDemo">■ 停止</button>
      </div>
    </div>

    <div class="hanoi-board">
      <div v-for="peg in 3" :key="peg" class="peg-column" :data-peg="peg - 1" @click="handlePegClick(peg - 1)">
        <div class="peg-base" />
        <div class="peg-pole" />
        <div class="peg-label">-</div>
        <div class="rings-stack"
          :class="{
            selected: selectedPeg === peg - 1,
            invalid: invalidPeg === peg - 1,
          }"
        >
          <div v-for="ring in state.pegs[peg - 1]" :key="ring"
            class="ring"
            :class="{ top: ring === getTopRing(state.pegs, peg - 1), buried: ring !== getTopRing(state.pegs, peg - 1) }"
            :style="{
              width: ringWidth(ring),
              background: COLORS[(ring - 1) % COLORS.length],
            }"
            @mousedown.stop="ring === getTopRing(state.pegs, peg - 1) && onRingDragStart($event, peg - 1)"
            @touchstart.stop="ring === getTopRing(state.pegs, peg - 1) && onRingDragStart($event, peg - 1)"
          />
        </div>
      </div>
    </div>

    <div v-if="completionChoices" class="completion-overlay">
      <div class="completion-card">
        <div class="win-icon">🎉</div>
        <h3>太棒了！只用 {{ state.moves }} 步完成{{ rings }}环汉诺塔</h3>
        <p class="win-score">+{{ getScore(baseScore, state.moves, state.minMoves) }} 分</p>
        <div class="completion-btns">
          <button class="choice-btn" @click="replayGame">🔁 再玩一次</button>
          <button v-if="canUpgrade" class="choice-btn primary" @click="upgradeGame">⬆ {{ rings + 1 }}环挑战</button>
          <button class="choice-btn" @click="game.navigateBackToConfig()">← 返回</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container { width: 100%; max-width: 500px; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 16px; position: relative; }
.header { width: 100%; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.header-btn { padding: 8px 12px; border-radius: var(--radius-sm); border: none; background: var(--card-bg); cursor: pointer; font-family: inherit; font-size: 0.9rem; box-shadow: var(--shadow-soft); }
.header-btn:disabled { opacity: 0.4; cursor: default; }
.header-btn.small { padding: 6px 10px; font-size: 0.8rem; }
.header-btn.demo { background: var(--secondary); color: #fff; }
.header-btn.stop { background: var(--danger); color: #fff; }
.badge { padding: 4px 10px; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; background: #FFF5E6; color: var(--primary); }
.header-actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.steps { font-size: 0.8rem; color: var(--text-light); white-space: nowrap; }

.hanoi-board { display: flex; justify-content: space-around; width: 100%; height: 240px; }
.peg-column { position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; flex: 1; min-width: 0; border-radius: var(--radius-md); transition: background 0.2s; overflow: visible; }
.peg-column:hover { background: rgba(0,0,0,0.03); }
.peg-base { width: 100%; height: 6px; background: #8B7355; border-radius: 3px; position: absolute; bottom: 0; }
.peg-pole { width: 6px; height: 85%; background: #C4A97D; border-radius: 3px; position: absolute; bottom: 6px; }
.peg-label { display: none; }

.rings-stack { position: absolute; bottom: 6px; display: flex; flex-direction: column; align-items: center; gap: 0; transition: box-shadow 0.2s; }
.rings-stack.selected { box-shadow: 0 0 0 3px var(--secondary); border-radius: var(--radius-md); }
.rings-stack.invalid { animation: invalidShake 0.3s ease; }

@keyframes invalidShake {
  0%, 100% { transform: translateX(0); }
  33% { transform: translateX(-3px); }
  66% { transform: translateX(3px); }
}

.ring { height: 28px; border-radius: 14px; border: 2px solid rgba(0,0,0,0.15); transition: all 0.15s; }
.ring.top:hover { filter: brightness(1.15); transform: translateY(-3px); cursor: grab; }
.ring.top:active { cursor: grabbing; }
.ring.buried { opacity: 0.7; cursor: default; }

.completion-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; border-radius: var(--radius-lg); }
.completion-card { background: var(--card-bg); border-radius: var(--radius-lg); padding: 24px; text-align: center; max-width: 300px; width: 90%; border: 3px solid var(--success); }
.win-icon { font-size: 3rem; animation: bounce 0.6s infinite alternate; }
@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-8px); } }
h3 { font-size: 1.1rem; color: var(--text-main); margin: 8px 0; }
.win-score { font-size: 1.3rem; color: var(--success); font-weight: 700; margin-bottom: 16px; }
.completion-btns { display: flex; flex-direction: column; gap: 8px; }
.choice-btn { padding: 10px 16px; border-radius: var(--radius-sm); border: 2px solid #eee; background: var(--card-bg); cursor: pointer; font-family: inherit; font-size: 0.9rem; }
.choice-btn.primary { background: var(--primary); color: #fff; border-color: var(--primary); font-weight: 600; }
</style>
