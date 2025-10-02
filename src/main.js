import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { validateEnvConfig } from './config/env.js'

// Validar configuración de entorno al iniciar
validateEnvConfig()

createApp(App).mount('#app')
