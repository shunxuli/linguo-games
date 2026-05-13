import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/variables.css'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.config.errorHandler = (err, _instance, info) => {
  console.error('App error:', err, info)
  // Prevent app crash — silently handle rendering errors
}
app.mount('#app')
