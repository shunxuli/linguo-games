<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices, puzzleSizes } from '../../stores/gameServices'
import { PATTERNS, drawPattern } from '../../engine/puzzle'

const game = useGameStore()
const { storage } = useGameServices()

const patternIndex = ref(storage.getPuzzleLastPatternIndex() ?? 0)
const selectedSize = ref<number>(storage.getPuzzleLastSize() || 3)
const previewUrl = ref('')

const pattern = computed(() => PATTERNS[patternIndex.value])
const canStart = computed(() => selectedSize.value > 0)

function renderPreview() {
  const canvas = document.createElement('canvas')
  canvas.width = 300
  canvas.height = 300
  const ctx = canvas.getContext('2d')
  if (ctx) {
    drawPattern(ctx, 300, 300, pattern.value, Math.random)
  }
  previewUrl.value = canvas.toDataURL()
}

watchEffect(() => {
  void pattern.value
  renderPreview()
})

function prev() { patternIndex.value = (patternIndex.value - 1 + PATTERNS.length) % PATTERNS.length; storage.setPuzzleLastPatternIndex(patternIndex.value) }
function next() { patternIndex.value = (patternIndex.value + 1) % PATTERNS.length; storage.setPuzzleLastPatternIndex(patternIndex.value) }
function randomPat() { patternIndex.value = Math.floor(Math.random() * PATTERNS.length); storage.setPuzzleLastPatternIndex(patternIndex.value) }
function selectSize(s: number) { selectedSize.value = s; storage.setPuzzleLastSize(s) }
function start() { if (canStart.value) game.navigateTo('puzzle-game') }
</script>

<template>
  <div class="config-container">
    <h2 class="config-title">
      🧩 拼图
    </h2>
    <div class="config-section">
      <label>选择图案 <span class="pattern-num">{{ patternIndex + 1 }}/{{ PATTERNS.length }}</span></label>
      <div
        class="pattern-preview"
        :style="{ backgroundImage: `url(${previewUrl})` }"
      />
      <div class="pattern-name">
        {{ pattern.name }}
      </div>
      <div class="pattern-nav">
        <button @click="prev">
          ◀
        </button>
        <button @click="randomPat">
          🎲 随机
        </button>
        <button @click="next">
          ▶
        </button>
      </div>
    </div>
    <div class="config-section">
      <label>选择难度</label>
      <div class="mode-grid">
        <button
          v-for="(d, size) in puzzleSizes"
          :key="size"
          class="mode-btn"
          :class="{ selected: selectedSize === Number(size) }"
          @click="selectSize(Number(size))"
        >
          {{ size }}×{{ size }} {{ d.name }}
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
.pattern-num { float: right; color: var(--text-light); font-size: 0.85rem; }
.pattern-preview { width: 200px; height: 200px; margin: 0 auto 8px; border-radius: var(--radius-md); background-size: cover; border: 3px solid #eee; }
.pattern-name { text-align: center; font-size: 1rem; color: var(--text-main); margin-bottom: 8px; font-weight: 600; }
.pattern-nav { display: flex; gap: 8px; justify-content: center; }
.pattern-nav button { padding: 6px 16px; border-radius: var(--radius-sm); background: var(--card-bg); border: 2px solid #eee; cursor: pointer; font-family: inherit; font-size: 0.9rem; }
.mode-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 8px; }
.mode-btn { padding: 10px 8px; border-radius: var(--radius-sm); border: 2px solid #eee; background: var(--card-bg); cursor: pointer; font-family: inherit; font-size: 0.9rem; transition: all 0.2s; }
.mode-btn.selected { border-color: var(--primary); background: #FFF5E6; }
.btn-row { display: flex; gap: 12px; margin-top: 24px; }
.back-btn { flex: 1; padding: 12px; border-radius: var(--radius-sm); background: #ddd; border: none; cursor: pointer; font-family: inherit; font-size: 1rem; }
.start-btn { flex: 2; padding: 12px; border-radius: var(--radius-sm); background: var(--primary); color: #fff; border: none; cursor: pointer; font-size: 1rem; font-weight: 600; font-family: inherit; }
.start-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
