<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices } from '../../stores/gameServices'
import {
  createAllPieces, getWorldVertices, pointInPolygon,
  TANGRAM_CATEGORIES, TANGRAM_TARGETS,
  type TangramPiece,
} from '../../engine/tangram'

const game = useGameStore()
const { speech, sound, addScore, storage } = useGameServices()

const canvas = ref<HTMLCanvasElement | null>(null)
const category = ref('basic')
const targetIdx = ref(0)
const pieces = ref<TangramPiece[]>([])
const isComplete = ref(false)

const target = ref(TANGRAM_TARGETS[0])
const catTargets = ref(TANGRAM_TARGETS.filter(t => t.category === 'basic'))

let refImage: HTMLImageElement | null = null

function initGame() {
  pieces.value = createAllPieces()
  catTargets.value = TANGRAM_TARGETS.filter(t => t.category === category.value)
  if (targetIdx.value >= catTargets.value.length) targetIdx.value = 0
  target.value = catTargets.value[targetIdx.value] || TANGRAM_TARGETS[0]
  isComplete.value = false
  refImage = null
  // Load reference image
  const img = new Image()
  img.src = target.value.image
  img.onload = () => {
    refImage = img
    nextTick(render)
  }
}

watch(() => game.currentScreen, (screen) => {
  if (screen === 'tangram-game') {
    const d = storage.getTangramDifficulty()
    if (d) category.value = d
    const ti = storage.getTangramTargetIdx()
    if (ti !== null) targetIdx.value = ti
    initGame()
  }
})

// Canvas state
let dragPiece: TangramPiece | null = null
let dragOffsetX = 0
let dragOffsetY = 0
let dragStartPos: { x: number; y: number } | null = null

function getEventPos(e: MouseEvent | Touch): { x: number; y: number } {
  const rect = canvas.value!.getBoundingClientRect()
  const scaleX = canvas.value!.width / rect.width
  const scaleY = canvas.value!.height / rect.height
  return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
}

function render() {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  const w = 400, h = 600
  canvas.value!.width = w
  canvas.value!.height = h

  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#FFFEF9'
  ctx.fillRect(0, 0, w, h)

  // Target area with reference image
  ctx.save()
  ctx.strokeStyle = '#DDD'
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  ctx.strokeRect(0, 0, 200, 200)
  ctx.setLineDash([])
  ctx.font = '12px sans-serif'
  ctx.fillStyle = '#999'
  ctx.fillText('目标图案', 5, 195)

  if (refImage) {
    ctx.globalAlpha = 0.35
    // Fit image into 200×200 area
    const scale = Math.min(200 / refImage.width, 200 / refImage.height)
    const iw = refImage.width * scale
    const ih = refImage.height * scale
    const ix = (200 - iw) / 2
    const iy = (200 - ih) / 2
    ctx.drawImage(refImage, ix, iy, iw, ih)
    ctx.globalAlpha = 1
  }
  ctx.restore()

  // Draw pieces
  for (const piece of pieces.value) {
    const verts = getWorldVertices(piece)
    ctx.save()
    ctx.beginPath()
    verts.forEach(([vx, vy], i) => {
      if (i === 0) ctx.moveTo(vx, vy)
      else ctx.lineTo(vx, vy)
    })
    ctx.closePath()
    ctx.fillStyle = piece.color
    ctx.globalAlpha = 0.85
    ctx.fill()
    ctx.strokeStyle = piece === dragPiece ? '#333' : 'rgba(0,0,0,0.3)'
    ctx.lineWidth = piece === dragPiece ? 3 : 1.5
    ctx.stroke()
    ctx.restore()
  }

  // Separator line
  ctx.strokeStyle = '#EEE'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(0, 210); ctx.lineTo(w, 210); ctx.stroke()
  ctx.font = '12px sans-serif'
  ctx.fillStyle = '#999'
  ctx.fillText('拼板区（对照上图拼摆）', 5, 225)
}

function findPieceAt(x: number, y: number): TangramPiece | null {
  for (let i = pieces.value.length - 1; i >= 0; i--) {
    if (pointInPolygon(x, y, getWorldVertices(pieces.value[i]))) return pieces.value[i]
  }
  return null
}

function onPointerDown(e: MouseEvent | TouchEvent) {
  e.preventDefault()
  const pt = 'touches' in e ? e.touches[0] : e
  const { x, y } = getEventPos(pt)
  const piece = findPieceAt(x, y)
  if (!piece) return

  // Double click detection
  const now = Date.now()
  if (now - lastClickTime < 300 && piece === dragPiece) {
    piece.flipped = !piece.flipped
    lastClickTime = 0
    render()
    return
  }
  lastClickTime = now

  dragPiece = piece
  dragOffsetX = piece.x - x
  dragOffsetY = piece.y - y
  dragStartPos = { x, y }
  render()
}

let lastClickTime = 0

function onPointerMove(e: MouseEvent | TouchEvent) {
  e.preventDefault()
  if (!dragPiece) return
  const pt = 'touches' in e ? e.touches[0] : e
  const { x, y } = getEventPos(pt)
  dragPiece.x = x + dragOffsetX
  dragPiece.y = y + dragOffsetY
  render()
}

function onPointerUp(e: MouseEvent | TouchEvent) {
  if (!dragPiece) return
  const pt = 'changedTouches' in e ? (e as TouchEvent).changedTouches[0] : (e as MouseEvent)
  const { x, y } = getEventPos(pt)

  // Quick click → rotate
  if (dragStartPos && Math.abs(x - dragStartPos.x) < 5 && Math.abs(y - dragStartPos.y) < 5) {
    dragPiece.rotation = (dragPiece.rotation + 1) % 8
  }
  dragPiece = null
  dragStartPos = null
  render()
}

function confirmComplete() {
  isComplete.value = true
  const score = TANGRAM_CATEGORIES[category.value]?.score || 10
  addScore(score)
  sound.playWin()
  speech.speak('太棒了！', 'zh-CN')
  game.returnScreen = 'tangram-config'
  game.showOverlay('win', { message: '拼图完成！', score })
}

function resetPieces() {
  pieces.value = createAllPieces()
  isComplete.value = false
  render()
}

function nextPattern() {
  targetIdx.value = (targetIdx.value + 1) % catTargets.value.length
  initGame()
}

function handleBack() {
  game.showConfirm('返回', '确定要退出吗？', () => game.navigateBackToConfig())
}
</script>

<template>
  <div class="game-container">
    <div class="header">
      <button class="header-btn" @click="handleBack">← 返回</button>
      <span class="badge">{{ target.name }}</span>
      <span class="badge diff">{{ TANGRAM_CATEGORIES[category]?.name }}</span>
      <button class="header-btn" @click="nextPattern">🔄</button>
    </div>
    <div class="hint">💡 单击旋转 | 双击翻转 | 拖拽移动</div>
    <div class="canvas-wrap" @mousedown="onPointerDown" @touchstart.prevent="onPointerDown" @mousemove="onPointerMove" @touchmove.prevent="onPointerMove" @mouseup="onPointerUp" @touchend="onPointerUp">
      <canvas ref="canvas" class="game-canvas" />
    </div>
    <div class="bottom-bar">
      <button class="act-btn" @click="resetPieces">🔄 重置</button>
      <button class="act-btn primary" :disabled="isComplete" @click="confirmComplete">✅ 完成啦</button>
    </div>
  </div>
</template>

<style scoped>
.game-container { width: 100%; max-width: 500px; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 8px; min-height: 100%; }
.header { width: 100%; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.header-btn { padding: 8px 12px; border-radius: var(--radius-sm); border: none; background: var(--card-bg); cursor: pointer; font-family: inherit; font-size: 0.9rem; box-shadow: var(--shadow-soft); }
.badge { padding: 4px 10px; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; background: #FFF5E6; color: var(--primary); }
.badge.diff { background: #EEE; color: var(--text-light); }
.hint { font-size: 0.8rem; color: var(--text-light); }
.canvas-wrap { width: 100%; max-width: 400px; touch-action: none; }
.game-canvas { width: 100%; height: auto; display: block; }
.bottom-bar { display: flex; gap: 12px; width: 100%; max-width: 400px; }
.act-btn { flex: 1; padding: 12px; border-radius: var(--radius-sm); border: 2px solid #eee; background: var(--card-bg); cursor: pointer; font-family: inherit; font-size: 1rem; }
.act-btn.primary { background: var(--success); color: #fff; border-color: var(--success); font-weight: 600; }
.act-btn:disabled { opacity: 0.5; cursor: default; }
</style>
