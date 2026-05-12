<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices } from '../../stores/gameServices'
import { TANGRAM_DIFFICULTIES, TARGET_PATTERNS } from '../../engine/tangram'

const game = useGameStore()
const { storage } = useGameServices()

const selectedDiff = ref<string>('geometry')
const patterns = ref(TARGET_PATTERNS.filter(p => p.difficulty === 'geometry'))

watch(() => game.currentScreen, (screen) => {
  if (screen === 'tangram-config') {
    const d = storage.getTangramDifficulty()
    if (d) selectedDiff.value = d
  }
})

function selectDifficulty(d: string) {
  selectedDiff.value = d
  patterns.value = TARGET_PATTERNS.filter(p => p.difficulty === d)
  storage.setTangramDifficulty(d)
}

function start() {
  storage.setTangramDifficulty(selectedDiff.value)
  game.navigateTo('tangram-game')
}
</script>

<template>
  <div class="config-container">
    <h2 class="config-title">🧩 七巧板</h2>
    <p class="config-desc">把 7 块拼板拖到正确位置，拼出图案！</p>
    <div class="config-section"><label>选择难度</label><div class="mode-grid">
      <button v-for="(d, key) in TANGRAM_DIFFICULTIES" :key="key" class="mode-btn" :class="{ selected: selectedDiff === key }" @click="selectDifficulty(key)">{{ d.name }}</button>
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
