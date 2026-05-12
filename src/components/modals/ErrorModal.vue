<script setup lang="ts">
import { useGameStore } from '../../stores/game'

const game = useGameStore()
</script>

<template>
  <div
    class="modal-overlay"
    :class="{ active: game.activeOverlay === 'error' }"
    @click.self="game.hideOverlay()"
  >
    <div class="modal-content error-content">
      <div class="error-icon">
        😅
      </div>
      <p class="error-msg">
        {{ game.overlayData.message || '再试一次吧！' }}
      </p>
      <button
        class="modal-btn"
        @click="game.hideOverlay()"
      >
        好的
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; justify-content: center; align-items: center; }
.modal-overlay.active { display: flex; }
.modal-content { background: var(--card-bg); border-radius: var(--radius-lg); padding: 24px; max-width: 360px; width: 90%; text-align: center; }
.error-content { border: 3px solid var(--danger); }
.error-icon { font-size: 3rem; margin-bottom: 12px; }
.error-msg { font-size: 1.1rem; color: var(--text-main); margin-bottom: 16px; }
.modal-btn { padding: 10px 32px; border-radius: var(--radius-sm); background: var(--danger); color: #fff; border: none; font-size: 1rem; cursor: pointer; font-family: inherit; }
</style>
