<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices } from '../../stores/gameServices'
import {
  createAllPieces, getWorldVertices, pointInPolygon, checkSnap,
  rotateVertices, TANGRAM_DIFFICULTIES, TARGET_PATTERNS,
  type TangramPiece, type TargetPattern,
} from '../../engine/tangram'

const game = useGameStore()
const { speech, sound, addScore, storage } = useGameServices()

const canvas = ref<HTMLCanvasElement | null>(null)
const difficulty = ref('geometry')
const pieces = ref<TangramPiece[]>([])
const target = ref<TargetPattern | null>(null)
const patternIdx = ref(0)
const isComplete = ref(false)
let lastClickTime = 0

const TARGET_MAP: Record<string, TargetPattern[]> = {}
for (const p of TARGET_PATTERNS) {
  if (!TARGET_MAP[p.difficulty]) TARGET_MAP[p.difficulty] = []
  TARGET_MAP[p.difficulty].push(p)
}

function initGame() {
  pieces.value = createAllPieces()
  const list = TARGET_MAP[difficulty.value] || TARGET_MAP.geometry
  patternIdx.value = Math.floor(Math.random() * list.length)
  target.value = list[patternIdx.value]
  isComplete.value = false
}

watch(() => game.currentScreen, (screen) => {
  if (screen === 'tangram-game') {
    const d = storage.getTangramDifficulty()
    if (d) difficulty.value = d
    initGame()
    nextTick(render)
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
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  }
}

function render() {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx || !target.value) return
  const w = 400, h = 600
  canvas.value!.width = w
  canvas.value!.height = h

  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#FFFEF9'
  ctx.fillRect(0, 0, w, h)

  // Target area outline
  ctx.save()
  ctx.strokeStyle = '#DDD'
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  ctx.strokeRect(0, 0, 200, 200)
  ctx.setLineDash([])
  ctx.font = '12px sans-serif'
  ctx.fillStyle = '#999'
  ctx.fillText('目标图案', 5, 195)
  ctx.restore()

  // Draw target shadow
  for (const tp of target.value.pieces) {
    const proto = pieces.value.find(p => p.type === tp.type)
    if (!proto) continue
    const verts = rotateVertices(proto.vertices, tp.rotation, tp.flipped)
    ctx.save()
    ctx.beginPath()
    verts.forEach(([vx, vy], i) => {
      const px = vx + tp.x
      const py = vy + tp.y
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    })
    ctx.closePath()
    ctx.fillStyle = 'rgba(200,200,200,0.25)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(150,150,150,0.3)'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.restore()
  }

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
    ctx.fillStyle = piece.snapped ? piece.color : piece.color
    ctx.globalAlpha = piece.snapped ? 1 : 0.85
    ctx.fill()
    ctx.strokeStyle = piece === dragPiece ? '#333' : 'rgba(0,0,0,0.3)'
    ctx.lineWidth = piece === dragPiece ? 3 : 1.5
    ctx.stroke()
    ctx.restore()
  }

  // Line separator
  ctx.strokeStyle = '#EEE'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, 210)
  ctx.lineTo(w, 210)
  ctx.stroke()

  ctx.font = '12px sans-serif'
  ctx.fillStyle = '#999'
  ctx.fillText('拼板区（拖拽上去）', 5, 225)
}

function findPieceAt(x: number, y: number): TangramPiece | null {
  for (let i = pieces.value.length - 1; i >= 0; i--) {
    const verts = getWorldVertices(pieces.value[i])
    if (pointInPolygon(x, y, verts)) return pieces.value[i]
  }
  return null
}

function onPointerDown(e: MouseEvent | TouchEvent) {
  e.preventDefault()
  const pt = 'touches' in e ? e.touches[0] : e
  const { x, y } = getEventPos(pt)
  const piece = findPieceAt(x, y)
  if (!piece || piece.snapped) return

  const now = Date.now()
  if (now - lastClickTime < 300 && piece === dragPiece) {
    // Double click → flip
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
  if (!dragPiece || !target.value) return
  const pt = 'changedTouches' in e ? (e as TouchEvent).changedTouches[0] : (e as MouseEvent)
  const { x, y } = getEventPos(pt)

  // Check if this was a quick click (no significant movement)
  if (dragStartPos && Math.abs(x - dragStartPos.x) < 5 && Math.abs(y - dragStartPos.y) < 5) {
    // Click → rotate 45°
    dragPiece.rotation = (dragPiece.rotation + 1) % 8
    dragPiece = null
    dragStartPos = null
    render()
    return
  }

  // Check snap
  const snapped = checkSnap(dragPiece, target.value, 20)
  if (snapped) {
    dragPiece.x = snapped.x
    dragPiece.y = snapped.y
    dragPiece.snapped = true
    sound.playTone(500 + pieces.value.filter(p => p.snapped).length * 60, 0.1)

    // Check completion
    if (pieces.value.every(p => p.snapped)) {
      isComplete.value = true
      const score = TANGRAM_DIFFICULTIES[difficulty.value]?.score || 15
      addScore(score)
      sound.playWin()
      speech.speak('拼好啦！', 'zh-CN')
      game.returnScreen = 'tangram-config'
      game.showOverlay('win', { message: '拼图完成！', score })
    }
  } else {
    dragPiece.snapped = false
  }

  dragPiece = null
  render()
}

function nextPattern() {
  const list = TARGET_MAP[difficulty.value] || TARGET_MAP.geometry
  patternIdx.value = (patternIdx.value + 1) % list.length
  target.value = list[patternIdx.value]
  initPieces()
  render()
}

function initPieces() {
  pieces.value = createAllPieces()
  isComplete.value = false
}

function handleBack() {
  game.showConfirm('返回', '确定要退出吗？', () => game.navigateBackToConfig())
}
</script>

<template>
  <div class="game-container">
    <div class="header">
      <button class="header-btn" @click="handleBack">← 返回</button>
      <span class="badge">{{ target?.name || '七巧板' }}</span>
      <span class="badge diff">{{ TANGRAM_DIFFICULTIES[difficulty]?.name }}</span>
      <button class="header-btn" @click="nextPattern">🔄 换图案</button>
    </div>
    <div class="hint">💡 单击旋转 | 双击翻转 | 拖拽移动</div>
    <div ref="canvasWrap" class="canvas-wrap" @mousedown="onPointerDown" @touchstart.prevent="onPointerDown" @mousemove="onPointerMove" @touchmove.prevent="onPointerMove" @mouseup="onPointerUp" @touchend="onPointerUp">
      <canvas ref="canvas" class="game-canvas" />
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
.canvas-wrap { width: 100%; max-width: 400px; touch-action: none; cursor: default; }
.game-canvas { width: 100%; height: auto; display: block; }
</style>
