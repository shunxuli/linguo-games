<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices } from '../../stores/gameServices'
import { patternThemes, patternSizes, getPatternRulesForSize, type PatternRule } from '../../engine/pattern'

const game = useGameStore()
const { storage } = useGameServices()

type ThemeKey = keyof typeof patternThemes
const selectedTheme = ref<ThemeKey>('fruit')
const selectedSize = ref<number>(2)
const selectedRule = ref<PatternRule>('AB')

const rules = computed(() => getPatternRulesForSize(selectedSize.value))
const canStart = computed(() => selectedTheme.value && selectedSize.value && selectedRule.value)

watch(() => game.currentScreen, (screen) => {
  if (screen === 'pattern-config') {
    const t = storage.getPatternTheme()
    if (t) selectedTheme.value = t as ThemeKey
    const s = storage.getPatternSize()
    if (s) selectedSize.value = s
  }
})

function selectTheme(t: ThemeKey) { selectedTheme.value = t; storage.setPatternTheme(t) }
function selectSize(s: number) { selectedSize.value = s; storage.setPatternSize(s) }
function selectRule(r: PatternRule) { selectedRule.value = r }

function start() {
  if (!canStart.value) return
  storage.setPatternTheme(selectedTheme.value)
  storage.setPatternSize(selectedSize.value)
  game.navigateTo('pattern-game')
}
</script>

<template>
  <div class="config-container">
    <h2 class="config-title">
      🔮 找规律
    </h2>
    <div class="config-section">
      <label>选择主题</label><div class="mode-grid">
        <button
          v-for="(t, key) in patternThemes"
          :key="key"
          class="mode-btn"
          :class="{ selected: selectedTheme === key }"
          @click="selectTheme(key as ThemeKey)"
        >
          {{ t.icon }} {{ t.name }}
        </button>
      </div>
    </div>
    <div class="config-section">
      <label>选择难度</label><div class="mode-grid">
        <button
          v-for="(d, size) in patternSizes"
          :key="size"
          class="mode-btn"
          :class="{ selected: selectedSize === Number(size) }"
          @click="selectSize(Number(size))"
        >
          {{ size }}级 {{ d.name }}
        </button>
      </div>
    </div>
    <div class="config-section">
      <label>选择规律</label><div class="mode-grid">
        <button
          v-for="r in rules"
          :key="r"
          class="mode-btn"
          :class="{ selected: selectedRule === r }"
          @click="selectRule(r)"
        >
          {{ r }} 规律
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
