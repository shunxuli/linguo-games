import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/linguo-games/',
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
  },
})
