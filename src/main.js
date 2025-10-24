import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { validateEnvConfig } from './config/env.js'
import { useGlobalAuth } from './composables/useAuth.js'

// Validar configuración de entorno al iniciar
validateEnvConfig()

const app = createApp(App)

// Inicializar autenticación global al montar la aplicación
app.mount('#app')

// Inicializar autenticación después de montar
const { initAuth } = useGlobalAuth()
initAuth()
