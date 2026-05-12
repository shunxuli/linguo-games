<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices } from '../../stores/gameServices'
import { TANGRAM_CATEGORIES, TANGRAM_TARGETS } from '../../engine/tangram'

const game = useGameStore()
const { storage } = useGameServices()

const selectedCat = ref<string>('basic')
const selectedTargetIdx = ref(0)

const targets = computed(() => TANGRAM_TARGETS.filter(t => t.category === selectedCat.value))

watch(() => game.currentScreen, (screen) => {
  if (screen === 'tangram-config') {
    const d = storage.getTangramDifficulty()
    if (d) selectedCat.value = d
  }
})

function selectCategory(c: string) {
  selectedCat.value = c
  selectedTargetIdx.value = 0
  storage.setTangramDifficulty(c)
}

function prevTarget() {
  if (selectedTargetIdx.value > 0) selectedTargetIdx.value--
}
function nextTarget() {
  if (selectedTargetIdx.value < targets.value.length - 1) selectedTargetIdx.value++
}

const currentTarget = computed(() => targets.value[selectedTargetIdx.value])

function start() {
  if (!currentTarget.value) return
  storage.setTangramDifficulty(selectedCat.value)
  storage.setTangramTargetIdx(selectedTargetIdx.value)
  game.navigateTo('tangram-game')
}
</script>

<template>
  <div class="config-container">
    <h2 class="config-title">🧩 七巧板</h2>
    <p class="config-desc">对照图片，用 7 块拼板拼出相同的形状！</p>
    <div class="config-section"><label>选择类别</label><div class="mode-grid">
      <button v-for="(c, key) in TANGRAM_CATEGORIES" :key="key" class="mode-btn" :class="{ selected: selectedCat === key }" @click="selectCategory(key)">{{ c.name }}</button>
    </div></div>
    <div v-if="currentTarget" class="config-section">
      <label>选择图案 <span class="pattern-num">{{ selectedTargetIdx + 1 }}/{{ targets.length }}</span></label>
      <img :src="currentTarget.image" class="preview-img" alt="参考图" />
      <div class="pattern-name">{{ currentTarget.name }}</div>
      <div class="pattern-nav">
        <button @click="prevTarget">◀</button>
        <span>{{ selectedTargetIdx + 1 }} / {{ targets.length }}</span>
        <button @click="nextTarget">▶</button>
      </div>
    </div>
    <div class="btn-row">
      <button class="back-btn" @click="game.goToLobby()">← 返回</button>
      <button class="start-btn" @click="start">开始游戏</button>
    </div>
  </div>
</template>

<style scoped>
.config-container { width: 100%; max-width: 500px; padding: 20px; }
.config-title { font-size: 1.8rem; color: var(--primary); text-align: center; margin-bottom: 8px; }
.config-desc { text-align: center; color: var(--text-light); font-size: 0.85rem; margin-bottom: 16px; }
.config-section { margin-bottom: 16px; }
.config-section label { display: block; font-size: 0.95rem; color: var(--text-light); margin-bottom: 8px; }
.pattern-num { float: right; color: var(--text-light); font-size: 0.8rem; }
.mode-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 8px; }
.mode-btn { padding: 8px 6px; border-radius: var(--radius-sm); border: 2px solid #eee; background: var(--card-bg); cursor: pointer; font-family: inherit; font-size: 0.85rem; transition: all 0.2s; }
.mode-btn.selected { border-color: var(--primary); background: #FFF5E6; }
.preview-img { width: 100%; max-height: 160px; object-fit: contain; border-radius: var(--radius-sm); border: 2px solid #eee; }
.pattern-name { text-align: center; font-size: 1rem; font-weight: 600; margin: 6px 0; color: var(--text-main); }
.pattern-nav { display: flex; justify-content: center; align-items: center; gap: 12px; }
.pattern-nav button { padding: 4px 12px; border-radius: var(--radius-sm); border: 2px solid #eee; background: var(--card-bg); cursor: pointer; font-family: inherit; }
.btn-row { display: flex; gap: 12px; margin-top: 16px; }
.back-btn { flex: 1; padding: 12px; border-radius: var(--radius-sm); background: #ddd; border: none; cursor: pointer; font-family: inherit; font-size: 1rem; }
.start-btn { flex: 2; padding: 12px; border-radius: var(--radius-sm); background: var(--primary); color: #fff; border: none; cursor: pointer; font-size: 1rem; font-weight: 600; font-family: inherit; }
</style>
