<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices, mathRanges } from '../../stores/gameServices'

const game = useGameStore()
const { storage } = useGameServices()

type Op = 'add' | 'sub' | 'mix'
const selectedOp = ref<Op>((storage.getLastOp() as Op) || 'add')
const selectedRange = ref<number>(storage.getLastRange() || 10)

const canStart = computed(() => selectedOp.value && selectedRange.value)

const ops = [
  { key: 'add' as const, name: '➕ 加法', icon: '➕' },
  { key: 'sub' as const, name: '➖ 减法', icon: '➖' },
  { key: 'mix' as const, name: '± 混合', icon: '±' },
]

function selectOp(o: Op) { selectedOp.value = o; storage.setLastOp(o) }
function selectRange(r: number) { selectedRange.value = r; storage.setLastRange(r) }

function start() {
  if (!canStart.value) return
  game.navigateTo('math-game')
}
</script>

<template>
  <div class="config-container">
    <h2 class="config-title">
      🧮 数学
    </h2>
    <div class="config-section">
      <label>选择运算</label>
      <div class="mode-grid">
        <button
          v-for="o in ops"
          :key="o.key"
          class="mode-btn"
          :class="{ selected: selectedOp === o.key }"
          @click="selectOp(o.key)"
        >
          {{ o.icon }} {{ o.name }}
        </button>
      </div>
    </div>
    <div class="config-section">
      <label>选择范围</label>
      <div class="mode-grid">
        <button
          v-for="(_score, range) in mathRanges"
          :key="range"
          class="mode-btn"
          :class="{ selected: selectedRange === Number(range) }"
          @click="selectRange(Number(range))"
        >
          {{ range }}以内
        </button>
      </div>
    </div>
    <div class="btn-row">
      <button
        class="back-btn"
        @click="game.goToLobby()"
      >
        ← 返回
      </button>
      <button
        class="start-btn"
        :disabled="!canStart"
        @click="start"
      >
        开始游戏
      </button>
    </div>
  </div>
</template>

<style scoped>
.config-container { width: 100%; max-width: 500px; padding: 20px; }
.config-title { font-size: 1.8rem; color: var(--primary); text-align: center; margin-bottom: 20px; }
.config-section { margin-bottom: 20px; }
.config-section label { display: block; font-size: 0.95rem; color: var(--text-light); margin-bottom: 8px; }
.mode-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 8px; }
.mode-btn { padding: 10px 8px; border-radius: var(--radius-sm); border: 2px solid #eee; background: var(--card-bg); cursor: pointer; font-family: inherit; font-size: 0.9rem; transition: all 0.2s; }
.mode-btn.selected { border-color: var(--primary); background: #FFF5E6; }
.btn-row { display: flex; gap: 12px; margin-top: 24px; }
.back-btn { flex: 1; padding: 12px; border-radius: var(--radius-sm); background: #ddd; border: none; cursor: pointer; font-family: inherit; font-size: 1rem; }
.start-btn { flex: 2; padding: 12px; border-radius: var(--radius-sm); background: var(--primary); color: #fff; border: none; cursor: pointer; font-size: 1rem; font-weight: 600; font-family: inherit; }
.start-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
