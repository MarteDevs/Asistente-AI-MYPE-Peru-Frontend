<template>
  <div class="max-w-5xl mx-auto p-4 lg:p-8">
    <!-- Chat Container -->
    <div
      class="bg-white rounded-2xl shadow-xl border border-gray-100 h-[700px] lg:h-[800px] flex flex-col overflow-hidden"
    >
      <!-- Chat Header -->
      <div class="bg-gradient-to-r from-teal-600 to-cyan-700 px-6 lg:px-8 py-6 lg:py-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div
              class="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <svg
                class="w-7 h-7 lg:w-8 lg:h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-xl lg:text-2xl font-bold text-white">LEGALYTH IA</h3>
              <p class="text-teal-100 text-sm lg:text-base">
                Asistente legal y tributario para MYPE • En línea
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <button
              v-if="hasMessages"
              @click="clearChat"
              class="p-2 lg:p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              title="Limpiar chat"
            >
              <svg
                class="w-5 h-5 lg:w-6 lg:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>

            <!-- Indicador de intentos restantes -->
            <div 
              v-if="!trialStatus.isAuthenticated && trialStatus.remainingAttempts >= 0"
              class="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
              :class="{
                'bg-yellow-500/20': trialStatus.remainingAttempts <= 2,
                'bg-red-500/20': trialStatus.remainingAttempts === 0
              }"
            >
              <span class="text-sm lg:text-base text-white font-medium">
                {{ trialStatus.remainingAttempts === 0 ? 'Sin intentos' : `${trialStatus.remainingAttempts} intentos restantes` }}
              </span>
            </div>

            <div class="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span class="text-sm lg:text-base text-white font-medium">
                {{ messageCount }} mensajes
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages Area -->
      <div
        ref="chatContainer"
        class="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 custom-scrollbar bg-gray-50"
      >
        <!-- Welcome message o mensajes existentes -->
        <div v-if="!hasMessages" class="text-center py-12 lg:py-16">
          <div
            class="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <svg
              class="w-10 h-10 lg:w-12 lg:h-12 text-teal-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            ¡Hola! Soy LEGALYTH IA
          </h3>
          <p class="text-lg lg:text-xl text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
            Estoy aquí para ayudarte con información sobre regímenes tributarios, formalización de
            empresas, beneficios MYPE y mucho más.
          </p>

          <!-- Información de intentos gratuitos -->
          <div 
            v-if="!trialStatus.isAuthenticated"
            class="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl max-w-2xl mx-auto"
          >
            <div class="flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-blue-800 font-semibold">Prueba gratuita</span>
            </div>
            <p class="text-blue-700 text-sm">
              Tienes <strong>{{ trialStatus.remainingAttempts }} de {{ trialStatus.maxAttempts }}</strong> consultas gratuitas restantes.
              <br>
              <span class="text-blue-600">Regístrate para obtener acceso ilimitado por solo S/15.00 PEN</span>
            </p>
          </div>

          <!-- Mensajes sugeridos -->
          <div class="space-y-6">
            <p class="text-base lg:text-lg font-semibold text-gray-800 mb-4">
              💡 Puedes empezar con una de estas preguntas:
            </p>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 max-w-4xl mx-auto"
            >
              <button
                v-for="suggestion in suggestedMessages"
                :key="suggestion"
                @click="sendSuggestedMessage(suggestion)"
                class="p-4 lg:p-5 bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-sm lg:text-base rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                :disabled="loading"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>

        <!-- Botones de acceso rápido (siempre visibles) -->
        <div v-if="hasMessages" class="mb-6">
          <div class="flex flex-wrap gap-2 justify-center">
            <button
              v-for="quickButton in quickActionButtons"
              :key="quickButton.text"
              @click="sendSuggestedMessage(quickButton.message)"
              class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm rounded-full border border-blue-300 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 font-medium"
              :disabled="loading"
            >
              {{ quickButton.text }}
            </button>
          </div>
        </div>

        <!-- Mensajes del chat -->
        <div
          v-for="message in messages"
          :key="message.id"
          class="flex"
          :class="message.type === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-[85%] lg:max-w-[75%] rounded-2xl px-6 lg:px-8 py-4 lg:py-6 shadow-sm"
            :class="getMessageClasses(message.type)"
          >
            <!-- Mensaje del usuario -->
            <div v-if="message.type === 'user'" class="text-base lg:text-lg leading-relaxed">
              {{ message.content }}
            </div>

            <!-- Mensaje del asistente -->
            <div v-else-if="message.type === 'assistant'" class="text-gray-800">
              <div v-if="message.typing" class="flex items-center">
                <div class="flex space-x-1">
                  <div class="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    class="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                    style="animation-delay: 0.1s"
                  ></div>
                  <div
                    class="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                    style="animation-delay: 0.2s"
                  ></div>
                </div>
                <span class="text-sm lg:text-base text-gray-500 ml-2">Escribiendo...</span>
              </div>
              <div
                v-else
                class="whitespace-pre-wrap text-base lg:text-lg leading-relaxed assistant-message"
                v-html="formatAssistantMessage(message.content)"
              ></div>
            </div>

            <!-- Mensaje de error -->
            <div
              v-else-if="message.type === 'error'"
              class="bg-red-50 border border-red-200 rounded-xl p-4 lg:p-6"
            >
              <div
                class="text-red-800 text-base lg:text-lg leading-relaxed whitespace-pre-line"
                v-html="formatErrorMessage(message.content)"
              ></div>
            </div>

            <!-- Mensaje de límite alcanzado -->
            <div
              v-else-if="message.type === 'limit'"
              class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 lg:p-6"
            >
              <div
                class="text-yellow-800 text-base lg:text-lg leading-relaxed whitespace-pre-line"
                v-html="formatAssistantMessage(message.content)"
              ></div>
              <div class="mt-4 flex justify-center">
                <button
                  @click="$emit('showPaymentModal')"
                  class="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  💎 Obtener Acceso Premium
                </button>
              </div>
            </div>

            <!-- Timestamp -->
            <div class="text-xs lg:text-sm mt-2 opacity-70">
              {{ formatMessageTime(message.timestamp) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="border-t border-gray-200 bg-white p-6 lg:p-8">
        <!-- Error global -->
        <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div class="flex items-center justify-between">
            <p class="text-sm lg:text-base text-red-700">{{ error }}</p>
            <button @click="clearError" class="text-red-400 hover:text-red-600 p-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form @submit.prevent="handleSendMessage" class="flex gap-3 lg:gap-4">
          <div class="flex-1">
            <div class="relative">
              <textarea
                v-model="currentMessage"
                placeholder="Escribe tu pregunta sobre regímenes tributarios, formalización, beneficios MYPE..."
                rows="2"
                class="w-full px-5 lg:px-6 py-4 text-base lg:text-lg bg-white text-gray-900 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 placeholder-gray-400 shadow-sm hover:border-gray-400 focus:shadow-md disabled:bg-gray-50 disabled:text-gray-500"
                :class="{
                  'border-red-400 focus:ring-red-500 focus:border-red-500': messageValidationError,
                }"
                @keydown.enter.prevent="handleKeyDown"
                @input="adjustTextareaHeight"
                ref="messageInput"
                :disabled="loading || !canUseChat"
                :placeholder="!canUseChat ? 'Regístrate para continuar chateando...' : 'Escribe tu pregunta sobre regímenes tributarios, formalización, beneficios MYPE...'"
                style="min-height: 60px; max-height: 200px"
              ></textarea>

              <!-- Contador de caracteres flotante -->
              <div
                class="absolute bottom-2 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded"
              >
                {{ currentMessage.length }}/1000
              </div>
            </div>

            <!-- Información y errores debajo del textarea -->
            <div class="flex justify-between items-center mt-2 px-1">
              <div class="flex-1">
                <p
                  v-if="messageValidationError"
                  class="text-sm text-red-600 font-medium flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ messageValidationError }}
                </p>
                <p v-else class="text-sm text-gray-500 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Presiona
                  <kbd
                    class="mx-1 px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono"
                    >Enter</kbd
                  >
                  para enviar
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || !isValidMessage || !canUseChat"
            class="self-start flex-shrink-0 px-6 lg:px-7 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-sm transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            <span v-else class="flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </span>
          </button>
        </form>
      </div>
    </div>

    <!-- Información del asistente -->
    <div v-if="assistantInfo" class="mt-6 card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-gray-900">Sobre el asistente</h3>
      </div>
      <div class="card-body">
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">{{ assistantDisplayName }}</h4>
            <p class="text-gray-600 mb-4">{{ assistantDescription }}</p>
            <div class="flex items-center space-x-2">
              <span v-if="assistantInfo.model" class="badge badge-info">{{ assistantInfo.model }}</span>
              <span v-if="assistantInfo.version" class="badge badge-success">v{{ assistantInfo.version }}</span>
              <span v-if="availabilityLabel" class="badge" :class="assistantInfo.available ? 'badge-success' : 'badge-info'">{{ availabilityLabel }}</span>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">Especialidades y capacidades</h4>
            <ul class="text-gray-600 space-y-1">
              <li v-for="specialty in assistantSpecialties" :key="specialty">
                • {{ specialty }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useChat } from '../composables/useChat.js'

// Composables
const {
  messages,
  currentMessage,
  assistantInfo,
  chatContainer,
  loading,
  error,
  sendMessage,
  getChatHistory,
  clearChat,
  clearError,
  fetchAssistantInfo,
  scrollToBottom,
  formatMessageTime,
  validateMessage,
  trialStatus,
  canUseChat,
} = useChat()

// Mensajes sugeridos
const suggestedMessages = ref([
  '¿Qué régimen tributario me conviene?',
  '¿Cómo formalizo mi empresa?',
  '¿Cuáles son los beneficios MYPE?',
  '¿Qué es el Nuevo RUS?',
  '¿Cómo cambio de régimen?',
  '¿Qué documentos necesito para formalizar?',
  '¿Cuánto debo pagar de impuestos?',
  '¿Qué es el Régimen Especial?',
  '¿Cómo emito comprobantes de pago?',
  '¿Qué obligaciones tengo como MYPE?',
  '¿Cómo accedo a programas de apoyo?',
  '¿Qué es la Planilla Electrónica?'
])

// Botones de acceso rápido que aparecen siempre
const quickActionButtons = ref([
  {
    text: '📊 Calcular impuestos',
    message: '¿Puedes ayudarme a calcular cuánto debo pagar de impuestos según mi régimen tributario?'
  },
  {
    text: '📋 Formalizar empresa',
    message: '¿Cuáles son los pasos completos para formalizar mi empresa como MYPE?'
  },
  {
    text: '💰 Beneficios MYPE',
    message: '¿Qué beneficios específicos puedo obtener al ser una MYPE formalizada?'
  },
  {
    text: '📄 Documentos necesarios',
    message: '¿Qué documentos necesito tener al día para cumplir con mis obligaciones tributarias?'
  }
])

// Computed properties
const hasMessages = computed(() => messages.value.length > 0)
const messageCount = computed(() => messages.value.length)
const isValidMessage = computed(() => {
  const validation = validateMessage(currentMessage.value)
  return validation.valid
})

// Referencias locales
const messageInput = ref(null)
const messageValidationError = ref('')

// Información del asistente con valores actuales y fallbacks
const assistantDisplayName = computed(() => {
  const name = assistantInfo.value?.name
  if (!name || /AI-MYPE/i.test(name)) return 'LEGALYTH IA'
  return name
})

const assistantDescription = computed(() => {
  const desc = assistantInfo.value?.description
  return (
    desc ||
    'Asistente virtual especializado en ayudar a emprendedores peruanos a formalizarse y gestionar obligaciones tributarias con información actualizada.'
  )
})

const assistantSpecialties = computed(() => {
  const specs = assistantInfo.value?.specialties || assistantInfo.value?.capabilities
  if (Array.isArray(specs) && specs.length > 0) return specs
  return [
    'Información sobre regímenes tributarios',
    'Asesoría en formalización de empresas',
    'Orientación sobre beneficios y obligaciones MYPE',
    'Consejos de gestión empresarial',
    'Programas de apoyo gubernamental',
  ]
})

const availabilityLabel = computed(() => {
  if (assistantInfo.value?.available === true) return 'Disponible'
  if (assistantInfo.value?.available === false) return 'No disponible'
  return ''
})

// Métodos
const handleSendMessage = async () => {
  const validation = validateMessage(currentMessage.value)
  if (!validation.valid) {
    messageValidationError.value = validation.message
    return
  }

  messageValidationError.value = ''

  try {
    await sendMessage()
    // Limpiar, resetear altura y enfocar el input
    await nextTick()
    if (messageInput.value) {
      messageInput.value.style.height = '60px'
      messageInput.value.focus()
    }
  } catch (err) {
    console.error('Error enviando mensaje:', err)
  }
}

const sendSuggestedMessage = async (message) => {
  currentMessage.value = message
  await handleSendMessage()
}

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSendMessage()
  }
}

const adjustTextareaHeight = () => {
  const textarea = messageInput.value
  if (textarea) {
    // Resetear altura para calcular correctamente
    textarea.style.height = '60px'

    // Calcular nueva altura entre min (60px) y max (200px)
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 60), 200)
    textarea.style.height = newHeight + 'px'
  }
}

const getMessageClasses = (type) => {
  switch (type) {
    case 'user':
      return 'bg-primary-600 text-white ml-auto'
    case 'assistant':
      return 'bg-gray-100 text-gray-800'
    case 'error':
      return 'bg-red-100 text-red-800 border border-red-200'
    case 'limit':
      return 'bg-yellow-50 text-yellow-800 border border-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatAssistantMessage = (content) => {
  if (!content) return ''

  return (
    content
      // Negrita **texto**
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      // Bullets * al inicio de línea
      .replace(
        /^\*\s+(.+)$/gm,
        '<span class="flex items-start my-1"><span class="mr-2 text-blue-600 font-bold">•</span><span class="flex-1">$1</span></span>',
      )
      // Código `texto`
      .replace(
        /`(.*?)`/g,
        '<code class="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono text-blue-700">$1</code>',
      )
      // Enlaces markdown [texto](url)
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>',
      )
  )
}

const formatErrorMessage = (content) => {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code class="bg-red-100 px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/•/g, '&bull;')
}

// Lifecycle
onMounted(async () => {
  try {
    // Cargar información del asistente
    await fetchAssistantInfo()
    
    // Cargar historial de chat si el usuario está autenticado
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        await getChatHistory()
      } catch (historyError) {
        console.error('Error cargando historial de chat:', historyError)
        // Si hay error cargando historial, mostrar mensaje de bienvenida
        if (messages.value.length === 0) {
          const welcomeMessage = {
            id: 0,
            type: 'assistant',
            content: '¡Hola! Soy tu asistente especializado en micro y pequeñas empresas en Perú. Puedo ayudarte con información sobre regímenes tributarios, formalización de empresas, beneficios MYPE y mucho más. ¿En qué puedo ayudarte hoy?',
            timestamp: new Date(),
          }
          messages.value.push(welcomeMessage)
        }
      }
    } else {
      // Usuario no autenticado, mostrar mensaje de bienvenida
      if (messages.value.length === 0) {
        const welcomeMessage = {
          id: 0,
          type: 'assistant',
          content: '¡Hola! Soy tu asistente especializado en micro y pequeñas empresas en Perú. Puedo ayudarte con información sobre regímenes tributarios, formalización de empresas, beneficios MYPE y mucho más. ¿En qué puedo ayudarte hoy?',
          timestamp: new Date(),
        }
        messages.value.push(welcomeMessage)
      }
    }
  } catch (err) {
    console.error('Error cargando información del asistente:', err)
  }
})
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.bg-primary-600 {
  background-color: #2563eb;
}

.card {
  @apply bg-white rounded-xl shadow-lg border border-gray-100;
}

.card-header {
  @apply px-6 py-4 border-b border-gray-100;
}

.card-body {
  @apply p-6;
}

.badge {
  @apply px-3 py-1 rounded-full text-sm font-medium;
}

.badge-info {
  @apply bg-blue-100 text-blue-800;
}

.badge-success {
  @apply bg-green-100 text-green-800;
}

/* Estilos adicionales para el textarea */
textarea {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.5;
}

textarea::placeholder {
  opacity: 0.6;
}

textarea:focus {
  outline: none;
}

/* Estilos para el elemento kbd */
kbd {
  font-family:
    ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono',
    'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro', 'Fira Mono',
    'Droid Sans Mono', 'Courier New', monospace;
}

/* Estilos para mensajes del asistente */
.assistant-message {
  color: #1f2937;
}

.assistant-message strong {
  font-weight: 700;
  color: #111827;
}

.assistant-message code {
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, 'Cascadia Mono', monospace;
}

.assistant-message a {
  transition: color 0.2s ease;
}

.assistant-message a:hover {
  text-decoration: underline;
}

/* Espaciado para párrafos y secciones */
.assistant-message :deep(p) {
  margin-bottom: 0.75rem;
}

.assistant-message :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
