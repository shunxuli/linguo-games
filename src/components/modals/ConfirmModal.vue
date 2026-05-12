<script setup lang="ts">
import { useGameStore } from '../../stores/game'

const game = useGameStore()
</script>

<template>
  <div
    class="modal-overlay"
    :class="{ active: game.activeOverlay === 'confirm' }"
  >
    <div class="modal-content">
      <h3>{{ game.overlayData.title || '确认' }}</h3>
      <p>{{ game.overlayData.message || '确定吗？' }}</p>
      <div class="confirm-btns">
        <button
          class="modal-btn cancel"
          @click="game.onConfirmNo()"
        >
          取消
        </button>
        <button
          class="modal-btn confirm"
          @click="game.onConfirmYes()"
        >
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; justify-content: center; align-items: center; }
.modal-overlay.active { display: flex; }
.modal-content { background: var(--card-bg); border-radius: var(--radius-lg); padding: 24px; max-width: 360px; width: 90%; text-align: center; }
h3 { margin-bottom: 12px; color: var(--text-main); }
p { color: var(--text-light); margin-bottom: 20px; }
.confirm-btns { display: flex; gap: 12px; justify-content: center; }
.modal-btn { padding: 10px 28px; border-radius: var(--radius-sm); border: none; font-size: 1rem; cursor: pointer; font-family: inherit; }
.cancel { background: #ddd; color: #666; }
.confirm { background: var(--primary); color: #fff; }
</style>
