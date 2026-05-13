<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices } from '../../stores/gameServices'
import { hanziDifficulties, type HanziMode } from '../../engine/hanzi'

const game = useGameStore()
const { storage } = useGameServices()
const selectedDiff = ref(1)
const selectedMode = ref<HanziMode>('picture')

const modes: Array<{ key: HanziMode; icon: string; name: string }> = [
  { key: 'picture', icon: '🖼️', name: '看图识字' },
  { key: 'oracle', icon: '🏺', name: '象形识字' },
  { key: 'audio', icon: '🔊', name: '听音识字' },
]

watch(() => game.currentScreen, (screen) => {
  if (screen === 'hanzi-config') {
    const d = storage.getHanziDifficulty()
    if (d) selectedDiff.value = d
    const m = storage.getHanziMode()
    if (m) selectedMode.value = m as HanziMode
  }
})
function selectDifficulty(d: number) { selectedDiff.value = d; storage.setHanziDifficulty(d) }
function selectMode(m: HanziMode) { selectedMode.value = m; storage.setHanziMode(m) }
function start() {
  storage.setHanziDifficulty(selectedDiff.value)
  storage.setHanziMode(selectedMode.value)
  game.navigateTo('hanzi-game')
}
</script>

<template>
  <div class="config-container">
    <h2 class="config-title">📖 识字</h2>
    <p class="config-desc">选择学习模式，选出正确的汉字！</p>
    <div class="config-section"><label>选择模式</label><div class="mode-grid">
      <button v-for="m in modes" :key="m.key" class="mode-btn" :class="{ selected: selectedMode === m.key }" @click="selectMode(m.key)">{{ m.icon }} {{ m.name }}</button>
    </div></div>
    <div class="config-section"><label>选择难度</label><div class="mode-grid">
      <button v-for="(d, v) in hanziDifficulties" :key="v" class="mode-btn" :class="{ selected: selectedDiff === Number(v) }" @click="selectDifficulty(Number(v))">{{ d.name }} · {{ d.count }}字</button>
    </div></div>
    <div class="btn-row">
      <button class="back-btn" @click="game.goToLobby()">← 返回</button>
      <button class="start-btn" @click="start">开始学习</button>
    </div>
  </div>
</template>

<style scoped>
.config-container { width: 100%; max-width: 500px; padding: 20px; }
.config-title { font-size: 1.8rem; color: var(--primary); text-align: center; margin-bottom: 8px; }
.config-desc { text-align: center; color: var(--text-light); font-size: 0.85rem; margin-bottom: 20px; }
.config-section { margin-bottom: 20px; }
.config-section label { display: block; font-size: 0.95rem; color: var(--text-light); margin-bottom: 8px; }
.mode-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 8px; }
.mode-btn { padding: 10px 8px; border-radius: var(--radius-sm); border: 2px solid #eee; background: var(--card-bg); cursor: pointer; font-family: inherit; font-size: 0.9rem; transition: all 0.2s; }
.mode-btn.selected { border-color: var(--primary); background: #FFF5E6; }
.btn-row { display: flex; gap: 12px; margin-top: 24px; }
.back-btn { flex: 1; padding: 12px; border-radius: var(--radius-sm); background: #ddd; border: none; cursor: pointer; font-family: inherit; font-size: 1rem; }
.start-btn { flex: 2; padding: 12px; border-radius: var(--radius-sm); background: var(--primary); color: #fff; border: none; cursor: pointer; font-size: 1rem; font-weight: 600; font-family: inherit; }
</style>
