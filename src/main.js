import { createApp } from 'vue'
import pinia from '@/stores/index.js'
import persist from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import '@/assets/main.scss'

const app = createApp(App)

app.use(pinia.use(persist))
app.use(router)
app.mount('#app')
