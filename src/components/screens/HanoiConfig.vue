<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices } from '../../stores/gameServices'
import { hanoiDifficulties } from '../../engine/hanoi'

const game = useGameStore()
const { storage } = useGameServices()

const selectedRings = ref(3)

watch(() => game.currentScreen, (screen) => {
  if (screen === 'hanoi-config') {
    const s = storage.getHanoiRings()
    if (s) selectedRings.value = s
  }
})

function selectRings(r: number) { selectedRings.value = r; storage.setHanoiRings(r) }

function start() {
  storage.setHanoiRings(selectedRings.value)
  game.navigateTo('hanoi-game')
}
</script>

<template>
  <div class="config-container">
    <h2 class="config-title">🗼 汉诺塔</h2>
    <p class="config-desc">把左边的圆环全部移到右边，大环不能压小环！</p>
    <div class="config-section"><label>选择难度</label><div class="mode-grid">
      <button v-for="(d, rings) in hanoiDifficulties" :key="rings" class="mode-btn" :class="{ selected: selectedRings === Number(rings) }" @click="selectRings(Number(rings))">{{ rings }}环 {{ d.name }}</button>
    </div></div>
    <div class="btn-row">
      <button class="back-btn" @click="game.goToLobby()">← 返回</button>
      <button class="start-btn" @click="start">开始游戏</button>
    </div>
  </div>
</template>

<style scoped>
.config-container { width: 100%; max-width: 500px; padding: 20px; }
.config-title { font-size: 1.8rem; color: var(--primary); text-align: center; margin-bottom: 8px; }
.config-desc { text-align: center; color: var(--text-light); font-size: 0.9rem; margin-bottom: 20px; }
.config-section { margin-bottom: 20px; }
.config-section label { display: block; font-size: 0.95rem; color: var(--text-light); margin-bottom: 8px; }
.mode-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 8px; }
.mode-btn { padding: 10px 8px; border-radius: var(--radius-sm); border: 2px solid #eee; background: var(--card-bg); cursor: pointer; font-family: inherit; font-size: 0.9rem; transition: all 0.2s; }
.mode-btn.selected { border-color: var(--primary); background: #FFF5E6; }
.btn-row { display: flex; gap: 12px; margin-top: 24px; }
.back-btn { flex: 1; padding: 12px; border-radius: var(--radius-sm); background: #ddd; border: none; cursor: pointer; font-family: inherit; font-size: 1rem; }
.start-btn { flex: 2; padding: 12px; border-radius: var(--radius-sm); background: var(--primary); color: #fff; border: none; cursor: pointer; font-size: 1rem; font-weight: 600; font-family: inherit; }
</style>
