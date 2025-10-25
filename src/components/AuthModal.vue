<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    @click="closeModal"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100"
      @click.stop
    >
      <!-- Header -->
      <div class="relative p-6 pb-4">
        <button
          @click="closeModal"
          class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            {{ isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta' }}
          </h2>
          <p class="text-gray-600">
            {{ isLoginMode 
              ? 'Accede a tu cuenta para continuar' 
              : 'Regístrate para obtener acceso premium' 
            }}
          </p>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="px-6 pb-6">
        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-600">{{ success }}</p>
        </div>

        <!-- Name Field (only for register) -->
        <div v-if="!isLoginMode" class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Nombre completo
          </label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            placeholder="Ingresa tu nombre completo"
          />
        </div>

        <!-- Email Field -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            placeholder="tu@email.com"
          />
        </div>

        <!-- Password Field -->
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              required
              :minlength="isLoginMode ? 1 : 6"
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              :placeholder="isLoginMode ? 'Tu contraseña' : 'Mínimo 6 caracteres'"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </button>
          </div>
          <p v-if="!isLoginMode" class="mt-1 text-xs text-gray-500">
            La contraseña debe tener al menos 6 caracteres
          </p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-gradient-to-r from-teal-600 to-cyan-700 text-white py-3 px-4 rounded-lg font-medium hover:from-teal-700 hover:to-cyan-800 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </span>
          <span v-else>
            {{ isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta' }}
          </span>
        </button>

        <!-- Toggle Mode -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            {{ isLoginMode ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
            <button
              type="button"
              @click="toggleMode"
              class="text-teal-600 hover:text-teal-700 font-medium ml-1"
            >
              {{ isLoginMode ? 'Regístrate aquí' : 'Inicia sesión' }}
            </button>
          </p>
        </div>

        <!-- Premium Benefits (only for register) -->
        <div v-if="!isLoginMode" class="mt-6 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-100">
          <h4 class="text-sm font-semibold text-teal-800 mb-2">✨ Beneficios Premium</h4>
          <ul class="text-xs text-teal-700 space-y-1">
            <li>• Consultas ilimitadas con LEGALYTH IA</li>
            <li>• Acceso completo a la calculadora tributaria</li>
            <li>• Soporte prioritario</li>
            <li>• Solo S/ 15.00 PEN</li>
          </ul>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useGlobalAuth } from '../composables/useAuth.js'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  initialMode: {
    type: String,
    default: 'login', // 'login' or 'register'
    validator: (value) => ['login', 'register'].includes(value)
  }
})

// Emits
const emit = defineEmits(['close', 'success'])

// Composables
const { login, register, isLoading, authError, clearAuthError } = useGlobalAuth()

// State
const isLoginMode = ref(props.initialMode === 'login')
const showPassword = ref(false)
const error = ref('')
const success = ref('')

const formData = ref({
  name: '',
  email: '',
  password: ''
})

// Methods
const closeModal = () => {
  clearForm()
  clearMessages()
  emit('close')
}

const clearForm = () => {
  formData.value = {
    name: '',
    email: '',
    password: ''
  }
  showPassword.value = false
}

const clearMessages = () => {
  error.value = ''
  success.value = ''
  clearAuthError()
}

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  clearMessages()
  clearForm()
}

const handleSubmit = async () => {
  clearMessages()

  try {
    if (isLoginMode.value) {
      // Login
      const response = await login({
        email: formData.value.email,
        password: formData.value.password
      })

      if (response.success) {
        success.value = 'Inicio de sesión exitoso'
        
        setTimeout(() => {
          emit('success', { type: 'login', data: response })
          closeModal()
        }, 1000)
      } else {
        error.value = response.message || 'Error al iniciar sesión'
      }

    } else {
      // Register
      const response = await register({
        name: formData.value.name,
        email: formData.value.email,
        password: formData.value.password
      })

      if (response.success) {
        success.value = 'Cuenta creada exitosamente'
        
        setTimeout(() => {
          emit('success', { type: 'register', data: response })
          closeModal()
        }, 1000)
      } else {
        error.value = response.message || 'Error al crear la cuenta'
      }
    }
  } catch (err) {
    error.value = err.message || 'Error inesperado'
  }
}

// Watch for auth errors
watch(authError, (newError) => {
  if (newError) {
    error.value = newError
  }
})

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    clearForm()
    clearMessages()
    isLoginMode.value = props.initialMode === 'login'
  }
})
</script>

<style scoped>
/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Fix para visibilidad del texto en inputs */
input[type="text"],
input[type="email"],
input[type="password"] {
  color: #1f2937 !important;
  background-color: #ffffff !important;
}

input[type="text"]::placeholder,
input[type="email"]::placeholder,
input[type="password"]::placeholder {
  color: #9ca3af !important;
  opacity: 1 !important;
}

/* Asegurar que el texto sea visible en focus */
input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
  color: #1f2937 !important;
  background-color: #ffffff !important;
}

/* Estilos para autocompletado */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  -webkit-text-fill-color: #1f2937 !important;
}
</style>