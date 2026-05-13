<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../../stores/game'

const game = useGameStore()

const imgFiles = ref<string[]>([])
const currentIdx = ref(0)
const loaded = ref(false)

const currentImg = computed(() => imgFiles.value[currentIdx.value] || '')
const hasPrev = computed(() => currentIdx.value > 0)
const hasNext = computed(() => currentIdx.value < imgFiles.value.length - 1)

function initImages() {
  // List of all images from browse directory
  const files = [
    '13420631487449290.jpeg', '13420631507716150.jpeg', '13420631520416613.jpeg', '13420631530817498.jpeg', '13420631543595438.jpeg',
    '13420631558865811.jpeg', '13420631569204896.jpeg', '13420631578300429.jpeg', '13420631591950345.jpeg', '13420631601963095.jpeg',
    '13420631612406452.jpeg', '13420631628283056.jpeg', '13420631639547790.jpeg', '13420631649870795.jpeg', '13420631663018209.jpeg',
    '13420631674398757.jpeg', '13420631684550291.jpeg', '13420631694758349.jpeg', '13421751175700809.jpeg', '13421751191017596.jpeg',
    '13421751205426598.jpeg', '13421751217188658.jpeg', '13421751227750793.jpeg', '13421751238726301.jpeg', '13421751249617406.jpeg',
    '13421751259212305.jpeg', '13421751269231781.jpeg', '13421751280954542.jpeg', '13421751290460779.jpeg', '13421751301159437.jpeg',
    '13421751311642184.jpeg', '13421751321288206.jpeg', '13421751330664209.jpeg', '13421751339875174.jpeg', '13421751349813092.jpeg',
    '13421751361318271.jpeg', '13421751372365388.jpeg', '13421751382286820.jpeg', '13421751392209972.jpeg', '13421751403121445.jpeg',
    '13421751414401711.jpeg', '13421751424002058.jpeg', '13421751435101106.jpeg', '13421751445330086.jpeg', '13421751472247172.jpeg',
    '13421751487712683.jpeg', '13421751498478396.jpeg', '13421751508972234.jpeg', '13421751520530624.jpeg', '13421751532897142.jpeg',
  ]
  imgFiles.value = files
  loaded.value = true
}

watch(() => game.currentScreen, (screen) => {
  if (screen === 'browse') {
    if (!loaded.value) initImages()
    currentIdx.value = 0
  }
}, { immediate: true })

function goPrev() {
  if (hasPrev.value) currentIdx.value--
}
function goNext() {
  if (hasNext.value) currentIdx.value++
}

function handleKey(e: KeyboardEvent) {
  if (game.currentScreen !== 'browse') return
  if (e.key === 'ArrowLeft') goPrev()
  if (e.key === 'ArrowRight') goNext()
  if (e.key === 'Escape') game.goToLobby()
}

onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => window.removeEventListener('keydown', handleKey))
</script>

<template>
  <div class="browse-container">
    <div class="browse-header">
      <button class="header-btn" @click="game.goToLobby()">← 返回</button>
      <span class="page-info">{{ currentIdx + 1 }} / {{ imgFiles.length }}</span>
    </div>
    <div class="image-area" @click="goNext">
      <img v-if="currentImg" :src="'browse/' + currentImg" class="main-image" alt="浏览图片" />
    </div>
    <div class="nav-bar">
      <button class="nav-btn" :disabled="!hasPrev" @click="goPrev">◀ 上一张</button>
      <button class="nav-btn" :disabled="!hasNext" @click="goNext">下一张 ▶</button>
    </div>
  </div>
</template>

<style scoped>
.browse-container { width: 100%; height: 100%; display: flex; flex-direction: column; background: #1a1a2e; }
.browse-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(0,0,0,0.3); }
.header-btn { padding: 8px 16px; border-radius: var(--radius-sm); border: none; background: rgba(255,255,255,0.15); color: #fff; cursor: pointer; font-family: inherit; font-size: 0.9rem; }
.page-info { color: rgba(255,255,255,0.6); font-size: 0.9rem; }
.image-area { flex: 1; display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; padding: 16px; }
.main-image { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px; }
.nav-bar { display: flex; gap: 12px; justify-content: center; padding: 12px 16px; background: rgba(0,0,0,0.3); }
.nav-btn { padding: 10px 24px; border-radius: var(--radius-sm); border: none; background: rgba(255,255,255,0.15); color: #fff; cursor: pointer; font-family: inherit; font-size: 1rem; }
.nav-btn:disabled { opacity: 0.3; cursor: default; }
.nav-btn:active:not(:disabled) { background: rgba(255,255,255,0.25); }
</style>
