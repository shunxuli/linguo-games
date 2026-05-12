<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices, puzzleSizes } from '../../stores/gameServices'
import { PATTERNS, generatePieces, isFullyCorrect, isPieceCorrect, createSeededRandom, drawPattern, type PuzzlePiece } from '../../engine/puzzle'

const game = useGameStore()
const { storage, speech, sound, addScore } = useGameServices()

const patternIndex = ref(storage.getPuzzleLastPatternIndex() ?? 0)
const size = ref(storage.getPuzzleLastSize() || 3)

const difficulty = computed(() => puzzleSizes[size.value as keyof typeof puzzleSizes] ?? { name: '简单', score: 20 })
const pattern = computed(() => PATTERNS[patternIndex.value])
const baseScore = computed(() => difficulty.value.score)

const pieces = ref<PuzzlePiece[]>([])
const selectedPiece = ref<number | null>(null)
const showNumbers = ref(true)
const score = ref(0)
const isComplete = ref(false)
const showHelp = ref(false)
const fullImageUrl = ref('')
const referenceUrl = ref('')

function renderFullImage() {
  const canvas = document.createElement('canvas')
  canvas.width = 400
  canvas.height = 400
  const ctx = canvas.getContext('2d')
  if (ctx) {
    drawPattern(ctx, 400, 400, pattern.value, createSeededRandom(Date.now()))
  }
  const url = canvas.toDataURL()
  fullImageUrl.value = url

  const refCanvas = document.createElement('canvas')
  refCanvas.width = 120
  refCanvas.height = 120
  const refCtx = refCanvas.getContext('2d')
  if (refCtx) {
    refCtx.drawImage(canvas, 0, 0, 400, 400, 0, 0, 120, 120)
  }
  referenceUrl.value = refCanvas.toDataURL()
}

watch(() => game.currentScreen, (screen) => {
  if (screen === 'puzzle-game') {
    // Re-read config from storage
    const pi = storage.getPuzzleLastPatternIndex()
    if (pi !== null) patternIndex.value = pi
    const ps = storage.getPuzzleLastSize()
    if (ps) size.value = ps
    score.value = 0
    isComplete.value = false
    selectedPiece.value = null
    renderFullImage()
    pieces.value = generatePieces(400, size.value, pattern.value, createSeededRandom(Date.now()))
  }
}, { immediate: true })

function onPieceClick(index: number) {
  if (isComplete.value) return
  const piece = pieces.value[index]
  if (piece.locked) return

  if (selectedPiece.value === null) {
    selectedPiece.value = index
  } else if (selectedPiece.value === index) {
    selectedPiece.value = null
  } else {
    swapPieces(selectedPiece.value, index)
    selectedPiece.value = null
    checkCompletion()
  }
}

function swapPieces(i1: number, i2: number) {
  ;[pieces.value[i1], pieces.value[i2]] = [pieces.value[i2], pieces.value[i1]]
  pieces.value[i1].currentIndex = i1
  pieces.value[i2].currentIndex = i2
}

function checkCompletion() {
  let locked = 0
  pieces.value.forEach((p, i) => {
    if (!p.locked && isPieceCorrect(p, i)) { p.locked = true; locked++ }
  })
  if (locked > 0) { sound.playSuccess(); speech.speak('拼对啦！', 'zh-CN') }
  if (isFullyCorrect(pieces.value)) onWin()
}

function onWin() {
  isComplete.value = true
  addScore(baseScore.value)
  sound.playSuccess()
  speech.speak('恭喜你，全部拼对啦！', 'zh-CN')
}

function newGame() {
  game.showConfirm('新游戏', '确定要重新开始吗？', () => {
    pieces.value = generatePieces(400, size.value, pattern.value, createSeededRandom(Date.now()))
    selectedPiece.value = null
    score.value = 0
    isComplete.value = false
    renderFullImage()
  })
}

function goBack() {
  game.showConfirm('返回', '确定要退出游戏吗？', () => {
    game.goToLobby()
  })
}
</script>

<template>
  <div class="puzzle-container">
    <div class="puzzle-header">
      <button
        class="header-btn"
        @click="goBack"
      >
        ← 返回
      </button>
      <div class="header-info">
        <span class="header-tag">{{ pattern.name }}</span>
        <span class="header-tag">{{ size }}×{{ size }} {{ difficulty.name }}</span>
      </div>
      <div class="header-actions">
        <span class="score-display">{{ baseScore }}分</span>
        <button
          class="header-btn icon-btn"
          @click="showHelp = true"
        >
          ❓
        </button>
        <button
          class="header-btn icon-btn"
          @click="newGame"
        >
          🔄
        </button>
      </div>
    </div>

    <div
      v-if="referenceUrl"
      class="ref-thumb"
      :style="{ backgroundImage: `url(${referenceUrl})` }"
    />

    <div
      class="puzzle-board"
      :style="{ gridTemplateColumns: `repeat(${size}, 1fr)` }"
    >
      <div
        v-for="(piece, i) in pieces"
        :key="piece.correctIndex"
        class="puzzle-cell"
        :class="{
          locked: piece.locked,
          selected: selectedPiece === i,
          'is-complete': isComplete,
        }"
        :style="{ backgroundImage: `url(${piece.image})` }"
        @click="onPieceClick(i)"
      >
        <span
          v-if="showNumbers"
          class="piece-number"
        >{{ piece.correctIndex + 1 }}</span>
      </div>
    </div>

    <div class="puzzle-controls">
      <label class="toggle-label">
        <input
          v-model="showNumbers"
          type="checkbox"
        >
        <span>显示编号</span>
      </label>
    </div>

    <div
      v-if="isComplete && fullImageUrl"
      class="win-overlay"
    >
      <div class="win-card">
        <div class="win-icon-box">
          🎉
        </div>
        <h3>太棒了！拼图完成！</h3>
        <p class="win-score-text">
          +{{ baseScore }} 分
        </p>
        <div
          class="win-full-image"
          :style="{ backgroundImage: `url(${fullImageUrl})` }"
        />
        <button
          class="win-btn"
          @click="game.goToLobby()"
        >
          返回大厅
        </button>
        <button
          class="win-btn secondary"
          @click="newGame"
        >
          再玩一次
        </button>
      </div>
    </div>

    <div
      v-if="showHelp"
      class="help-overlay"
      @click.self="showHelp = false"
    >
      <div class="help-card">
        <h3>🧩 拼图玩法</h3>
        <ul>
          <li>点击一块拼图选中它</li>
          <li>再点击另一块，两块就会交换位置</li>
          <li>拼到正确位置的拼图会自动锁住（绿色边框）</li>
          <li>把所有的拼图都放到正确位置就赢啦！</li>
        </ul>
        <button
          class="win-btn"
          @click="showHelp = false"
        >
          知道啦！
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.puzzle-container {
  width: 100%;
  max-width: 500px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  position: relative;
}

.puzzle-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.header-btn {
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  background: var(--card-bg);
  border: 2px solid #eee;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  white-space: nowrap;
}

.header-btn:active {
  transform: scale(0.96);
}

.icon-btn {
  padding: 6px 10px;
  font-size: 1.1rem;
}

.header-info {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.header-tag {
  padding: 3px 10px;
  border-radius: 12px;
  background: #FFF5E6;
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.score-display {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--success);
  white-space: nowrap;
}

.ref-thumb {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-sm);
  border: 2px solid #eee;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  align-self: flex-start;
}

.puzzle-board {
  display: grid;
  width: 100%;
  aspect-ratio: 1;
  gap: 4px;
  padding: 6px;
  background: #f0f0f0;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
  max-width: 420px;
}

.puzzle-cell {
  aspect-ratio: 1;
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  border: 3px solid transparent;
  transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s;
}

.puzzle-cell:active {
  transform: scale(0.94);
}

.puzzle-cell.locked {
  border-color: #4CAF50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
  cursor: default;
}

.puzzle-cell.selected {
  border-color: #2196F3;
  box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
  transform: scale(1.03);
}

.puzzle-cell.is-complete {
  cursor: default;
}

.piece-number {
  position: absolute;
  top: 2px;
  left: 2px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
  line-height: 1.3;
  pointer-events: none;
}

.puzzle-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: var(--text-light);
  cursor: pointer;
}

.toggle-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--primary);
}

/* Win overlay */
.win-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.win-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 24px;
  max-width: 340px;
  width: 90%;
  text-align: center;
  border: 3px solid var(--success);
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from { transform: scale(0.7); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.win-icon-box {
  font-size: 3.5rem;
  animation: bounce 0.5s infinite alternate;
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-8px); }
}

.win-card h3 {
  margin: 10px 0 4px;
  color: var(--primary);
  font-size: 1.3rem;
}

.win-score-text {
  font-size: 1.2rem;
  color: var(--success);
  font-weight: 700;
  margin-bottom: 12px;
}

.win-full-image {
  width: 180px;
  height: 180px;
  margin: 0 auto 14px;
  border-radius: var(--radius-md);
  background-size: cover;
  background-position: center;
  border: 3px solid #eee;
}

.win-btn {
  padding: 10px 28px;
  border-radius: var(--radius-sm);
  background: var(--primary);
  color: #fff;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  margin: 4px;
}

.win-btn.secondary {
  background: #ddd;
  color: #666;
}

.win-btn:active {
  transform: scale(0.96);
}

/* Help overlay */
.help-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
}

.help-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 24px;
  max-width: 340px;
  width: 90%;
  text-align: center;
}

.help-card h3 {
  margin-bottom: 14px;
  color: var(--primary);
}

.help-card ul {
  text-align: left;
  padding-left: 20px;
  line-height: 2;
  color: var(--text-main);
  font-size: 0.95rem;
}
</style>
