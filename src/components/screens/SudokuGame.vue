<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices, gameModes, sudokuDifficulties, type GameMode } from '../../stores/gameServices'
import { SudokuEngine, createSeededRandom } from '../../engine/sudoku'

const game = useGameStore()
const { storage, speech, sound, addScore } = useGameServices()

const engine = new SudokuEngine()

const lastMode = storage.getLastMode() as GameMode | null
const lastSize = storage.getLastSize()

const mode = ref<GameMode>(lastMode || 'number')
const size = ref<number>(lastSize || 4)
const baseScore = computed(() => sudokuDifficulties[size.value as keyof typeof sudokuDifficulties]?.score ?? 10)

const puzzle = ref<number[][]>([])
const solution = ref<number[][]>([])
const userBoard = ref<number[][]>([])
const selectedCell = ref<{ row: number; col: number } | null>(null)
const selectedValue = ref<number | null>(null)
const hintsUsed = ref(0)
const score = ref<number>(baseScore.value)
const isComplete = ref(false)
const history = ref<Array<{ row: number; col: number; oldValue: number; newValue: number }>>([])

const errorCell = ref<{ row: number; col: number } | null>(null)

const boxRows = computed(() => (size.value === 4 ? 2 : size.value === 6 ? 2 : 3))
const boxCols = computed(() => (size.value === 4 ? 2 : size.value === 6 ? 3 : 3))

const difficultyInfo = computed(() => sudokuDifficulties[size.value as keyof typeof sudokuDifficulties])

const modeItems = computed(() => gameModes[mode.value].items.slice(0, size.value))

function isFixed(row: number, col: number): boolean {
  return puzzle.value[row]?.[col] > 0
}

function isRelated(row: number, col: number): boolean {
  if (!selectedCell.value || isComplete.value) return false
  return row === selectedCell.value.row || col === selectedCell.value.col
}

function generatePuzzle() {
  const prng = createSeededRandom(Date.now())
  const result = engine.generatePuzzle(size.value, undefined, prng)
  puzzle.value = result.puzzle
  solution.value = result.solution
  userBoard.value = result.puzzle.map(row => [...row])
  selectedCell.value = null
  selectedValue.value = null
  hintsUsed.value = 0
  score.value = baseScore.value
  isComplete.value = false
  history.value = []
  errorCell.value = null
  game.hideOverlay()
}

function saveState() {
  storage.saveSudoku({
    mode: mode.value,
    size: size.value,
    puzzle: puzzle.value,
    solution: solution.value,
    userBoard: userBoard.value,
    hintsUsed: hintsUsed.value,
    score: score.value,
    history: history.value,
  })
}

function clearSavedState() {
  storage.clearSudoku()
}

function loadSavedState(): boolean {
  const saved = storage.getSudoku() as Record<string, unknown> | null
  if (!saved) return false
  mode.value = (saved.mode as GameMode) || 'number'
  size.value = (saved.size as number) || 4
  puzzle.value = (saved.puzzle as number[][]) || []
  solution.value = (saved.solution as number[][]) || []
  userBoard.value = (saved.userBoard as number[][]) || []
  hintsUsed.value = (saved.hintsUsed as number) || 0
  score.value = (saved.score as number) || baseScore.value
  history.value = (saved.history as Array<{ row: number; col: number; oldValue: number; newValue: number }>) || []
  isComplete.value = false
  selectedCell.value = null
  selectedValue.value = null
  errorCell.value = null
  return true
}

function speakCell(row: number, col: number) {
  const val = puzzle.value[row][col]
  if (val <= 0) return
  const zh = gameModes[mode.value].names.zh[val - 1]
  const en = gameModes[mode.value].names.en[val - 1]
  speech.speak(zh, 'zh-CN')
  setTimeout(() => speech.speak(en, 'en-US'), 600)
}

function handleCellClick(row: number, col: number) {
  if (isComplete.value) return
  if (isFixed(row, col)) {
    speakCell(row, col)
    return
  }
  selectedCell.value = { row, col }
  if (selectedValue.value !== null) {
    fillCell(row, col, selectedValue.value)
  }
}

function handleValueClick(value: number) {
  if (isComplete.value) return
  selectedValue.value = value
  if (selectedCell.value) {
    fillCell(selectedCell.value.row, selectedCell.value.col, value)
  }
}

function fillCell(row: number, col: number, value: number) {
  if (isFixed(row, col)) return
  if (userBoard.value[row][col] === value) return

  const oldValue = userBoard.value[row][col]
  if (engine.checkMove(userBoard.value, solution.value, row, col, value)) {
    userBoard.value[row][col] = value
    history.value.push({ row, col, oldValue, newValue: value })
    sound.playSuccess()
    speech.speak('对了！', 'zh-CN')
    if (engine.isComplete(userBoard.value)) {
      isComplete.value = true
      clearSavedState()
      setTimeout(() => {
        addScore(score.value)
        game.updateScore(game.score + score.value)
        sound.playWin()
        game.showOverlay('win', { message: '恭喜你完成了数独！', score: score.value })
      }, 300)
    }
  } else {
    sound.playError()
    errorCell.value = { row, col }
    setTimeout(() => { errorCell.value = null }, 600)
    game.showOverlay('error', { message: '这个位置不对哦，再想想！' })
  }
}

function handleHint() {
  if (isComplete.value) return
  let target: { row: number; col: number } | null = null
  if (selectedCell.value && !isFixed(selectedCell.value.row, selectedCell.value.col) && userBoard.value[selectedCell.value.row][selectedCell.value.col] === 0) {
    target = selectedCell.value
  } else {
    const empties: Array<{ row: number; col: number }> = []
    for (let r = 0; r < size.value; r++) {
      for (let c = 0; c < size.value; c++) {
        if (!isFixed(r, c) && userBoard.value[r][c] === 0) empties.push({ row: r, col: c })
      }
    }
    if (empties.length === 0) return
    target = empties[Math.floor(Math.random() * empties.length)]
  }
  if (!target) return
  const answer = solution.value[target.row][target.col]
  const emoji = gameModes[mode.value].items[answer - 1]
  userBoard.value[target.row][target.col] = answer
  history.value.push({ row: target.row, col: target.col, oldValue: 0, newValue: answer })
  selectedCell.value = target
  score.value = Math.max(0, score.value - 5)
  hintsUsed.value++
  speech.speak(emoji, 'zh-CN')
  game.showOverlay('hint', { message: `答案是 ${emoji}`, display: emoji })
}

function handleUndo() {
  if (isComplete.value || history.value.length === 0) return
  const last = history.value.pop()!
  userBoard.value[last.row][last.col] = last.oldValue
  errorCell.value = null
}

function handleNewGame() {
  game.showConfirm('新游戏', '确定要开始新游戏吗？当前进度会丢失。', () => {
    clearSavedState()
    generatePuzzle()
  })
}

function handleBack() {
  if (isComplete.value) {
    game.goToLobby()
    return
  }
  game.showConfirm('退出', '确定要退出吗？当前进度将会保存。', () => {
    saveState()
    game.goToLobby()
  })
}

// -- Drag and drop support --

const dragging = ref(false)
const dragValue = ref<number | null>(null)
const dragEmoji = ref('')
let dragEl: HTMLElement | null = null
let dragStartX = 0
let dragStartY = 0
let hasMoved = false

function onDragStart(e: MouseEvent | TouchEvent, value: number) {
  if (isComplete.value) return
  e.preventDefault()
  dragging.value = true
  dragValue.value = value
  dragEmoji.value = gameModes[mode.value].items[value - 1]
  hasMoved = false
  const pt = 'touches' in e ? e.touches[0] : e
  dragStartX = pt.clientX
  dragStartY = pt.clientY
}

function onDragMove(e: MouseEvent | TouchEvent) {
  if (!dragging.value) return
  const pt = 'touches' in e ? e.touches[0] : e
  if (!hasMoved && (Math.abs(pt.clientX - dragStartX) > 8 || Math.abs(pt.clientY - dragStartY) > 8)) {
    hasMoved = true
    dragEl = document.createElement('div')
    dragEl.className = 'drag-floating'
    dragEl.textContent = dragEmoji.value
    dragEl.style.cssText = 'position:fixed;pointer-events:none;z-index:200;font-size:2.5rem;transform:translate(-50%,-50%);'
    document.body.appendChild(dragEl)
  }
  if (dragEl) {
    dragEl.style.left = pt.clientX + 'px'
    dragEl.style.top = pt.clientY + 'px'
  }
}

function onDragEnd(e: MouseEvent | TouchEvent) {
  if (!dragging.value) return
  dragging.value = false
  dragValue.value = null
  if (dragEl) {
    const pt = 'changedTouches' in e ? (e as TouchEvent).changedTouches[0] : (e as MouseEvent)
    const el = document.elementFromPoint(pt.clientX, pt.clientY)
    if (el) {
      const cell = el.closest('[data-cell]') as HTMLElement | null
      if (cell) {
        const row = parseInt(cell.dataset.cellRow || '')
        const col = parseInt(cell.dataset.cellCol || '')
        if (!isNaN(row) && !isNaN(col) && dragValue.value !== null) {
          selectedCell.value = { row, col }
          fillCell(row, col, dragValue.value)
        }
      }
    }
    dragEl.remove()
    dragEl = null
  }
  hasMoved = false
}

onMounted(() => {
  sound.initFromStorage()
  speech.initFromStorage()
  const restored = loadSavedState()
  if (!restored || puzzle.value.length === 0 || puzzle.value.length !== size.value) {
    generatePuzzle()
  }
})
</script>

<template>
  <div
    class="game-container"
    @mousemove="onDragMove"
    @touchmove.prevent="onDragMove"
    @mouseup="onDragEnd"
    @touchend="onDragEnd"
  >
    <!-- Header -->
    <div class="game-header">
      <button
        class="header-btn back-btn"
        @click="handleBack"
      >
        ← 返回
      </button>
      <div class="header-info">
        <span class="mode-badge">{{ gameModes[mode].icon }} {{ gameModes[mode].name }}</span>
        <span class="diff-badge">{{ difficultyInfo.name }}</span>
      </div>
      <div class="header-actions">
        <button
          class="header-btn hint-btn"
          :disabled="isComplete"
          @click="handleHint"
        >
          💡
        </button>
        <button
          class="header-btn undo-btn"
          :disabled="isComplete || history.length === 0"
          @click="handleUndo"
        >
          ↩
        </button>
        <button
          class="header-btn new-btn"
          @click="handleNewGame"
        >
          🔄
        </button>
      </div>
    </div>

    <!-- Score -->
    <div class="score-bar">
      <span>⭐ {{ score }}</span>
      <span v-if="hintsUsed > 0">💡 {{ hintsUsed }}</span>
    </div>

    <!-- Board -->
    <div
      class="board"
      :style="{ gridTemplateColumns: `repeat(${size}, 1fr)` }"
    >
      <template
        v-for="r in size"
        :key="'row' + r"
      >
        <div
          v-for="c in size"
          :key="'cell' + (r - 1) * size + (c - 1)"
          class="cell"
          :class="{
            fixed: isFixed(r - 1, c - 1),
            user: !isFixed(r - 1, c - 1) && userBoard[r - 1]?.[c - 1] > 0,
            selected: selectedCell?.row === r - 1 && selectedCell?.col === c - 1,
            related: isRelated(r - 1, c - 1),
            'error-shake': errorCell?.row === r - 1 && errorCell?.col === c - 1,
            'box-right': (c) % boxCols === 0 && c < size,
            'box-bottom': (r) % boxRows === 0 && r < size,
          }"
          :data-cell-row="r - 1"
          :data-cell-col="c - 1"
          @click="handleCellClick(r - 1, c - 1)"
        >
          <span
            v-if="userBoard[r - 1]?.[c - 1] > 0"
            class="cell-value"
          >
            {{ gameModes[mode].items[userBoard[r - 1][c - 1] - 1] }}
          </span>
        </div>
      </template>
    </div>

    <!-- Input pad -->
    <div class="input-pad">
      <button
        v-for="(item, idx) in modeItems"
        :key="idx"
        class="input-btn"
        :class="{ 'selected-value': selectedValue === idx + 1 }"
        @mousedown="onDragStart($event, idx + 1)"
        @touchstart="onDragStart($event, idx + 1)"
        @click="handleValueClick(idx + 1)"
      >
        {{ item }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  width: 100%;
  max-width: 500px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  user-select: none;
  -webkit-user-select: none;
  min-height: 100%;
}

.game-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.header-btn {
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  border: none;
  background: var(--card-bg);
  font-size: 1.1rem;
  cursor: pointer;
  font-family: inherit;
  box-shadow: var(--shadow-soft);
  transition: transform 0.15s;
}
.header-btn:active { transform: scale(0.94); }
.header-btn:disabled { opacity: 0.4; cursor: default; }

.back-btn { font-size: 1rem; }

.header-info {
  display: flex;
  gap: 6px;
  align-items: center;
}

.mode-badge, .diff-badge {
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 600;
}
.mode-badge { background: #FFF5E6; color: var(--primary); }
.diff-badge { background: #EEE; color: var(--text-light); }

.header-actions { display: flex; gap: 6px; }

.score-bar {
  display: flex;
  gap: 16px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary);
}

.board {
  display: grid;
  gap: 0;
  width: 100%;
  max-width: 380px;
  aspect-ratio: 1;
  background: #333;
  border: 3px solid #333;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-bg);
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}

.cell.box-right { border-right: 3px solid #333; }
.cell.box-bottom { border-bottom: 3px solid #333; }

.cell.fixed { background: #F0F4FF; }
.cell.fixed .cell-value { font-weight: 700; }

.cell.user { background: #FFFBE6; }
.cell.user .cell-value { color: var(--secondary); }

.cell.selected {
  background: #E8F0FE;
  box-shadow: inset 0 0 0 3px var(--secondary);
}

.cell.related { background: #F5F5FF; }

.cell.error-shake {
  animation: shake 0.4s ease;
  background: #FFEBEE;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
}

.cell-value {
  font-size: clamp(1rem, 5vw, 2rem);
  pointer-events: none;
}

.input-pad {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  padding: 4px 0;
}

.input-btn {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  border: 2px solid #eee;
  background: var(--card-bg);
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  font-family: inherit;
  box-shadow: var(--shadow-soft);
}

.input-btn:active { transform: scale(0.92); }

.input-btn.selected-value {
  border-color: var(--primary);
  background: #FFF5E6;
  transform: scale(1.1);
}
</style>
