<script setup lang="ts">
import { useGameStore } from '../../stores/game'

const game = useGameStore()
</script>

<template>
  <div
    class="modal-overlay"
    :class="{ active: game.activeOverlay === 'win' }"
  >
    <div class="modal-content win-content">
      <div class="win-icon">
        🎉
      </div>
      <h3>{{ game.overlayData.message || '太棒了！' }}</h3>
      <p class="win-score">
        +{{ game.overlayData.score || 0 }} 分
      </p>
      <button
        class="modal-btn"
        @click="game.goToLobby()"
      >
        返回大厅
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; justify-content: center; align-items: center; }
.modal-overlay.active { display: flex; }
.modal-content { background: var(--card-bg); border-radius: var(--radius-lg); padding: 24px; max-width: 360px; width: 90%; text-align: center; }
.win-content { border: 3px solid var(--success); }
.win-icon { font-size: 4rem; margin-bottom: 12px; animation: bounce 0.6s infinite alternate; }
@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-10px); } }
h3 { color: var(--primary); margin-bottom: 8px; }
.win-score { font-size: 1.5rem; color: var(--success); font-weight: 700; margin-bottom: 16px; }
.modal-btn { padding: 10px 32px; border-radius: var(--radius-sm); background: var(--primary); color: #fff; border: none; font-size: 1rem; cursor: pointer; font-family: inherit; }
</style>
