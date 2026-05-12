<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices } from '../../stores/gameServices'
import { spotSizes } from '../../engine/spot'

const game = useGameStore()
const { storage } = useGameServices()

const selectedSize = ref<number>(2)
const canStart = computed(() => selectedSize.value > 0)

watch(() => game.currentScreen, (screen) => {
  if (screen === 'spot-config') {
    const s = storage.getSpotSize()
    if (s) selectedSize.value = s
  }
})

function selectSize(s: number) { selectedSize.value = s; storage.setSpotSize(s) }

function start() {
  if (!canStart.value) return
  storage.setSpotSize(selectedSize.value)
  game.navigateTo('spot-game')
}
</script>

<template>
  <div class="config-container">
    <h2 class="config-title">
      🔍 找不同
    </h2>
    <div class="config-section">
      <label>选择难度</label><div class="mode-grid">
        <button
          v-for="(d, size) in spotSizes"
          :key="size"
          class="mode-btn"
          :class="{ selected: selectedSize === Number(size) }"
          @click="selectSize(Number(size))"
        >
          {{ size }}级 {{ d.name }}
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
