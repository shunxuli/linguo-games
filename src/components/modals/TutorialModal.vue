<script setup lang="ts">
import { useGameStore } from '../../stores/game'

const game = useGameStore()

defineProps<{ title?: string; message?: string }>()
</script>

<template>
  <div
    class="modal-overlay"
    :class="{ active: game.activeOverlay === 'tutorial' }"
  >
    <div class="modal-content">
      <h3>📖 玩法说明</h3>
      <slot />
      <button
        class="modal-btn"
        @click="game.hideOverlay()"
      >
        知道了！
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; justify-content: center; align-items: center; }
.modal-overlay.active { display: flex; }
.modal-content { background: var(--card-bg); border-radius: var(--radius-lg); padding: 24px; max-width: 360px; width: 90%; text-align: center; }
h3 { margin-bottom: 16px; color: var(--primary); }
.modal-btn { margin-top: 16px; padding: 10px 32px; border-radius: var(--radius-sm); background: var(--primary); color: #fff; border: none; font-size: 1rem; cursor: pointer; font-family: inherit; }
</style>
