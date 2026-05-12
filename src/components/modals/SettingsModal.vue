<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../../stores/game'
import { useGameServices } from '../../stores/gameServices'

const game = useGameStore()
const { storage, speech, sound } = useGameServices()

const voiceEnabled = ref(storage.getVoiceEnabled())
const soundEnabled = ref(storage.getSoundEnabled())

function toggleVoice() {
  voiceEnabled.value = !voiceEnabled.value
  storage.setVoiceEnabled(voiceEnabled.value)
  speech.setEnabled(voiceEnabled.value)
}
function toggleSound() {
  soundEnabled.value = !soundEnabled.value
  storage.setSoundEnabled(soundEnabled.value)
  sound.setEnabled(soundEnabled.value)
}
</script>

<template>
  <div
    class="modal-overlay"
    :class="{ active: game.activeOverlay === 'settings' }"
    @click.self="game.hideOverlay()"
  >
    <div class="modal-content">
      <h3>⚙️ 设置</h3>
      <div
        class="setting-row"
        @click="toggleVoice"
      >
        <span>🔊 语音提示</span>
        <span
          class="toggle"
          :class="{ active: voiceEnabled }"
        >{{ voiceEnabled ? '开' : '关' }}</span>
      </div>
      <div
        class="setting-row"
        @click="toggleSound"
      >
        <span>🔔 音效</span>
        <span
          class="toggle"
          :class="{ active: soundEnabled }"
        >{{ soundEnabled ? '开' : '关' }}</span>
      </div>
      <button
        class="modal-btn"
        @click="game.hideOverlay()"
      >
        关闭
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; justify-content: center; align-items: center; }
.modal-overlay.active { display: flex; }
.modal-content { background: var(--card-bg); border-radius: var(--radius-lg); padding: 24px; max-width: 360px; width: 90%; text-align: center; }
h3 { margin-bottom: 16px; color: var(--text-main); }
.setting-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee; cursor: pointer; }
.toggle { padding: 4px 16px; border-radius: 20px; background: #ddd; color: #666; font-size: 0.9rem; transition: all 0.2s; }
.toggle.active { background: var(--success); color: #fff; }
.modal-btn { margin-top: 16px; padding: 10px 32px; border-radius: var(--radius-sm); background: var(--secondary); color: #fff; border: none; font-size: 1rem; cursor: pointer; font-family: inherit; }
</style>
