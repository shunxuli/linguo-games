<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices } from '../../stores/gameServices'
import { sortThemes, sortSizes, generateSortItems, isSorted, type SortItem } from '../../engine/sort'
import { createSeededRandom } from '../../engine/random'

type ThemeKey = keyof typeof sortThemes

const game = useGameStore()
const { speech, sound, addScore, storage } = useGameServices()

const themeKey = ref<ThemeKey>('size')
const difficulty = ref(2)
const baseScore = computed(() => sortSizes[difficulty.value]?.score || 10)

const items = ref<SortItem[]>([])
const selectedIdx = ref<number | null>(null)
const score = ref(0)
const swaps = ref(0)
const isComplete = ref(false)

function initGame() {
  const info = sortSizes[difficulty.value]
  const prng = createSeededRandom(Date.now())
  items.value = generateSortItems(themeKey.value, info.count, prng)
  selectedIdx.value = null
  swaps.value = 0
  score.value = info.score
  isComplete.value = false
}

watch(() => game.currentScreen, (screen) => {
  if (screen === 'sort-game') {
    const t = storage.getSortTheme()
    if (t) themeKey.value = t as ThemeKey
    const s = storage.getSortSize()
    if (s) difficulty.value = s
    initGame()
  }
})

function selectItem(index: number) {
  if (isComplete.value || dragMoved.value) return
  if (selectedIdx.value === null) {
    selectedIdx.value = index
  } else if (selectedIdx.value === index) {
    selectedIdx.value = null
  } else {
    doSwap(selectedIdx.value, index)
  }
}

function doSwap(i1: number, i2: number) {
  if (i1 === i2) return;
  [items.value[i1], items.value[i2]] = [items.value[i2], items.value[i1]]
  selectedIdx.value = null
  swaps.value++
  score.value = Math.max(0, baseScore.value - swaps.value)

  if (isSorted(items.value)) {
    isComplete.value = true
    addScore(score.value)
    sound.playWin()
    speech.speak('排序完成！', 'zh-CN')
    game.returnScreen = 'sort-config'
    game.showOverlay('win', { message: '排列正确！', score: score.value })
  }
}

// Drag support
const dragMoved = ref(false)
const dragSource = ref<number | null>(null)
let dragSortEl: HTMLElement | null = null
let dragSortStartX = 0
let dragSortStartY = 0
let dragSortHasMoved = false

function onSortDragStart(e: MouseEvent | TouchEvent, index: number) {
  if (isComplete.value) return
  e.preventDefault()
  dragSource.value = index
  dragSortHasMoved = false
  dragMoved.value = false
  const pt = 'touches' in e ? e.touches[0] : e
  dragSortStartX = pt.clientX
  dragSortStartY = pt.clientY
}

function onSortDragMove(e: MouseEvent | TouchEvent) {
  if (dragSource.value === null) return
  const pt = 'touches' in e ? e.touches[0] : e
  if (!dragSortHasMoved && (Math.abs(pt.clientX - dragSortStartX) > 8 || Math.abs(pt.clientY - dragSortStartY) > 8)) {
    dragSortHasMoved = true
    dragMoved.value = true
    const item = items.value[dragSource.value]
    dragSortEl = document.createElement('div')
    dragSortEl.style.cssText = `position:fixed;pointer-events:none;z-index:200;padding:8px;border-radius:var(--radius-sm);background:var(--card-bg);border:3px solid var(--secondary);display:flex;flex-direction:column;align-items:center;gap:4px;font-size:2rem;transform:translate(-50%,-50%);box-shadow:0 8px 24px rgba(0,0,0,0.2);`
    dragSortEl.innerHTML = `<span style="font-size:2rem">${item.emoji}</span><span style="font-size:0.7rem;color:#888">${item.label}</span>`
    document.body.appendChild(dragSortEl)
  }
  if (dragSortEl) {
    dragSortEl.style.left = pt.clientX + 'px'
    dragSortEl.style.top = pt.clientY + 'px'
  }
}

function onSortDragEnd(e: MouseEvent | TouchEvent) {
  if (dragSource.value === null) return
  if (dragSortEl) {
    const pt = 'changedTouches' in e ? (e as TouchEvent).changedTouches[0] : (e as MouseEvent)
    const el = document.elementFromPoint(pt.clientX, pt.clientY)
    if (el) {
      const itemEl = el.closest('.sort-item') as HTMLElement | null
      if (itemEl) {
        const allItems = document.querySelectorAll('.sort-item')
        const targetIdx = Array.from(allItems).indexOf(itemEl)
        if (targetIdx >= 0 && targetIdx !== dragSource.value) {
          doSwap(dragSource.value, targetIdx)
        }
      }
    }
    dragSortEl.remove()
    dragSortEl = null
  }
  dragSource.value = null
  dragSortHasMoved = false
  setTimeout(() => { dragMoved.value = false }, 50)
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
      <span class="badge">{{ sortThemes[themeKey]?.name }}</span>
      <span class="badge diff">{{ items.length }}个 {{ sortSizes[difficulty]?.name }}</span>
      <span class="score">⭐ {{ score }}</span>
    </div>
    <p class="prompt">
      从小到大排好序 （点击或拖动交换）
    </p>
    <div
      class="sort-row"
      @mousemove="onSortDragMove"
      @touchmove.prevent="onSortDragMove"
      @mouseup="onSortDragEnd"
      @touchend="onSortDragEnd"
    >
      <div
        v-for="(item, i) in items"
        :key="item.id"
        class="sort-item"
        :class="{
          selected: selectedIdx === i,
          correct: isComplete,
        }"
        @click="selectItem(i)"
        @mousedown="onSortDragStart($event, i)"
        @touchstart="onSortDragStart($event, i)"
      >
        <span class="item-emoji">{{ item.emoji }}</span>
        <span class="item-label">{{ item.label }}</span>
      </div>
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
.prompt { font-size: 1rem; color: var(--text-light); }
.sort-row { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.sort-item { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 12px 10px; border-radius: var(--radius-sm); border: 3px solid #eee; background: var(--card-bg); cursor: pointer; transition: all 0.2s; min-width: 64px; }
.sort-item.selected { border-color: var(--secondary); background: #E8F0FE; transform: scale(1.05); }
.sort-item.correct { border-color: var(--success); background: #E8F5E9; }
.item-emoji { font-size: 2rem; }
.item-label { font-size: 0.8rem; color: var(--text-light); }
</style>
