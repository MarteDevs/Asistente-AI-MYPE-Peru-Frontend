<template>
  <!-- Payment Confirmation Modal -->
  <PaymentConfirmation
    :is-open="showConfirmation"
    @close="closeConfirmation"
    @confirm="confirmPayment"
  />

  <!-- Payment Success Modal -->
  <PaymentSuccess
    :is-open="showSuccess"
    @close="closeSuccess"
    @continue="handleSuccessContinue"
  />

  <div
    v-if="isOpen && !userAlreadyHasPremium"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    @click="closeModal"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100"
      @click.stop
    >
      <!-- Header -->
      <div class="relative p-6 pb-4 bg-gradient-to-r from-teal-600 to-cyan-700 rounded-t-2xl">
        <button
          @click="closeModal"
          class="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="text-center text-white">
          <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold mb-2">Acceso Premium</h2>
          <p class="text-teal-100">
            Desbloquea todas las funcionalidades
          </p>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-600">{{ success }}</p>
        </div>

        <!-- Payment Steps -->
        <div v-if="!paymentOrder" class="space-y-6">
          <!-- Premium Benefits -->
          <div class="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
            <h3 class="text-lg font-semibold text-teal-800 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ¿Qué incluye Premium?
            </h3>
            <ul class="space-y-3 text-teal-700">
              <li class="flex items-start">
                <svg class="w-5 h-5 mr-3 mt-0.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Consultas ilimitadas</strong> con LEGALYTH IA</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 mr-3 mt-0.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Calculadora tributaria</strong> completa</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 mr-3 mt-0.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Soporte prioritario</strong> y actualizaciones</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 mr-3 mt-0.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Historial completo</strong> de consultas</span>
              </li>
            </ul>
          </div>

          <!-- Pricing -->
          <div class="text-center">
            <div class="inline-flex items-baseline">
              <span class="text-4xl font-bold text-gray-900">S/ 15</span>
              <span class="text-lg text-gray-500 ml-1">.00 PEN</span>
            </div>
            <p class="text-sm text-gray-600 mt-1">15 soles por suscripción mensual</p>
          </div>

          <!-- Current Usage -->
          <div v-if="queryLimits" class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Tu uso actual:</h4>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Consultas gratuitas usadas:</span>
              <span class="font-medium text-gray-900">
                {{ queryLimits.freeQueriesUsed }} / {{ queryLimits.freeQueriesLimit }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                class="bg-gradient-to-r from-teal-500 to-cyan-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${(queryLimits.freeQueriesUsed / queryLimits.freeQueriesLimit) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Payment Button -->
          <div class="space-y-3">
            <!-- Botón principal de pago para usuarios autenticados -->
            <button
              v-if="isAuthenticated"
              @click="showPaymentConfirmation"
              :disabled="isLoading"
              class="w-full bg-gradient-to-r from-teal-600 to-cyan-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-cyan-800 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <span v-if="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </span>
              <span v-else class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Obtener Acceso Premium
              </span>
            </button>

            <!-- Botones para usuarios no autenticados -->
            <div v-else class="space-y-3">
              <!-- Botón de iniciar sesión -->
              <button
                @click="openAuthModal('login')"
                class="w-full bg-gradient-to-r from-teal-600 to-cyan-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-cyan-800 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 shadow-lg"
              >
                <span class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Iniciar Sesión y Obtener Premium
                </span>
              </button>

              <!-- Botón de registro -->
              <button
                @click="openAuthModal('register')"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg"
              >
                <span class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Crear Cuenta y Obtener Premium
                </span>
              </button>

              <!-- Separador -->
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white text-gray-500">¿Ya tienes cuenta?</span>
                </div>
              </div>

              <!-- Texto informativo -->
              <div class="text-center">
                <p class="text-sm text-gray-600">
                  Necesitas una cuenta para acceder a las funciones premium.
                  <br>
                  <span class="font-medium text-teal-600">¡Es rápido y fácil!</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Security Notice -->
          <div class="text-center">
            <p class="text-xs text-gray-500 flex items-center justify-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Pago seguro procesado por nuestra pasarela de pagos
            </p>
          </div>
        </div>

        <!-- Payment Completed Successfully -->
        <div v-else-if="paymentOrder && paymentOrder.status === 'COMPLETED'" class="space-y-6">
          <div class="text-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-green-600 mb-2">¡Pago Completado!</h3>
            <p class="text-gray-600 mb-4">Tu acceso Premium ha sido activado exitosamente</p>
            
            <!-- Success Details -->
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">ID de Transacción:</span>
                  <span class="font-mono text-green-700">{{ paymentOrder.transactionId }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Estado:</span>
                  <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    COMPLETADO
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Monto:</span>
                  <span class="font-semibold text-green-700">S/ {{ Number(paymentOrder.amount).toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Premium Features Activated -->
            <div class="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-200">
              <h4 class="text-lg font-semibold text-teal-800 mb-3">🎉 Funciones Premium Activadas</h4>
              <ul class="text-sm text-teal-700 space-y-1">
                <li>✅ Consultas ilimitadas con LEGALYTH IA</li>
                <li>✅ Calculadora tributaria completa</li>
                <li>✅ Soporte prioritario</li>
                <li>✅ Historial completo de consultas</li>
              </ul>
            </div>

            <!-- Action Button -->
            <button
              @click="closeModal"
              class="w-full bg-gradient-to-r from-teal-600 to-cyan-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-800 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
            >
              Comenzar a Usar Premium
            </button>
          </div>
        </div>

        <!-- Payment Order Created (Pending) -->
        <div v-else class="space-y-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Orden de Pago Creada</h3>
            <p class="text-gray-600">Tu orden ha sido generada exitosamente</p>
          </div>

          <!-- QR Code Section -->
          <div v-if="paymentOrder.qrCode" class="text-center bg-white border-2 border-gray-200 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Escanea para Pagar</h4>
            <div class="flex justify-center mb-4">
              <QRCode 
                :data="paymentOrder.qrCode"
                :size="192"
                alt-text="Código QR para pago"
                caption="Escanea este código QR con tu aplicación de pagos favorita"
                image-class="w-48 h-48"
              />
            </div>
          </div>

          <!-- Order Details -->
          <div class="bg-gray-50 rounded-lg p-4 space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">ID de Orden:</span>
              <span class="text-sm font-mono text-gray-900">{{ paymentOrder.orderId }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Monto:</span>
              <span class="text-sm font-semibold text-gray-900">
                S/ {{ Number(paymentOrder.amount).toFixed(2) }} {{ paymentOrder.currency }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Estado:</span>
              <span class="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                {{ getStatusText(paymentOrder.status) }}
              </span>
            </div>
          </div>

          <!-- Payment Actions -->
          <div class="space-y-3">
            <button
              @click="checkPaymentStatus"
              :disabled="isLoading"
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando...
              </span>
              <span v-else>Verificar Estado del Pago</span>
            </button>

            <button
              @click="processPayment"
              :disabled="isLoading"
              class="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando Pago...
              </span>
              <span v-else>Procesar Pago Manualmente</span>
            </button>

            <button
              @click="paymentOrder = null"
              class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Crear Nueva Orden
            </button>
          </div>

          <!-- Expiration Notice -->
          <div class="text-center">
            <p class="text-xs text-gray-500">
              Esta orden expira el {{ formatDate(paymentOrder.expiresAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useGlobalAuth } from '@/composables/useAuth'
import paymentService from '@/services/paymentService'
import QRCode from './QRCode.vue'
import PaymentConfirmation from './PaymentConfirmation.vue'
import PaymentSuccess from './PaymentSuccess.vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  queryLimits: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'success', 'openAuth'])

// Composables
const { refreshProfile, isAuthenticated, user } = useGlobalAuth()

// State
const isLoading = ref(false)
const error = ref('')
const success = ref('')
const paymentOrder = ref(null)
const showConfirmation = ref(false)
const showSuccess = ref(false)

// Computed
const userAlreadyHasPremium = computed(() => {
  return user.value?.isPremium === true || user.value?.hasPremiumAccess === true
})

// Methods
const closeModal = () => {
  clearMessages()
  paymentOrder.value = null
  emit('close')
}

const clearMessages = () => {
  error.value = ''
  success.value = ''
}

const openAuthModal = (mode) => {
  emit('openAuth', mode)
  closeModal()
}

const createPaymentOrder = async () => {
  console.log('🚀 Iniciando createPaymentOrder...') // Debug log
  clearMessages()
  isLoading.value = true
  console.log('⏳ isLoading set to true') // Debug log

  try {
    console.log('📡 Llamando a paymentService.createOrder...') // Debug log
    const response = await paymentService.createOrder({
      amount: 15.0,
      currency: 'PEN',
      description: 'Acceso Premium - LEGALYTH IA'
    })
    
    console.log('✅ Response from createOrder:', response) // Debug log
    
    if (response && response.success) {
      console.log('✅ Response is successful, creating payment order...') // Debug log
      
      // Procesar el pago automáticamente después de crear la orden
      console.log('💳 Procesando pago automáticamente...') // Debug log
      const processResponse = await paymentService.processPayment({
        orderId: response.data.orderId,
        paymentMethod: 'qr_code'
      })
      
      console.log('💳 Process payment response:', processResponse) // Debug log
      
      const qrData = paymentService.generateQRData({
        orderId: response.data.orderId,
        amount: response.data.amount,
        currency: response.data.currency
      })
      
      paymentOrder.value = {
        orderId: response.data.orderId,
        amount: response.data.amount,
        currency: response.data.currency,
        status: processResponse.success ? processResponse.status : 'pending',
        qrCode: qrData,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        paymentData: response.data.paymentData,
        paymentId: processResponse.success ? processResponse.paymentId : null,
        transactionId: processResponse.success ? processResponse.transactionId : null
      }
      
      console.log('✅ PaymentOrder set to:', paymentOrder.value) // Debug log
      
      if (processResponse.success) {
        success.value = 'Pago procesado exitosamente'
      } else {
        success.value = 'Orden de pago creada exitosamente'
      }
      console.log('✅ Success message set') // Debug log
    } else {
      console.log('❌ Response not successful:', response) // Debug log
      error.value = response?.message || 'Error al crear la orden de pago'
    }
  } catch (err) {
    console.error('❌ Error in createPaymentOrder:', err) // Debug log
    error.value = err.message || 'Error al crear la orden de pago'
  } finally {
    console.log('🏁 Setting isLoading to false') // Debug log
    isLoading.value = false
    console.log('🏁 isLoading is now:', isLoading.value) // Debug log
  }
}

const checkPaymentStatus = async () => {
  if (!paymentOrder.value) return

  clearMessages()
  isLoading.value = true

  try {
    const response = await paymentService.getPaymentStatus(paymentOrder.value.orderId)

    if (response.success) {
      paymentOrder.value.status = response.payment.status
      
      if (response.payment.status === 'completed') {
        // Actualizar perfil del usuario y localStorage
        await refreshProfile()
        
        // Forzar actualización del localStorage con el estado premium
        const currentUser = JSON.parse(localStorage.getItem('user_data') || '{}')
        currentUser.isPremium = true
        currentUser.hasPremiumAccess = true
        localStorage.setItem('user_data', JSON.stringify(currentUser))
        
        // Asegurar que el usuario tenga un token de autenticación válido
        if (!localStorage.getItem('auth_token')) {
          // Generar un token temporal para usuarios premium
          const tempToken = 'premium-user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
          localStorage.setItem('auth_token', tempToken)
        }
        
        // Mostrar modal de éxito en lugar del mensaje
        showSuccess.value = true
        
        setTimeout(() => {
          emit('success', { type: 'payment', data: response.payment })
        }, 1000)
      } else if (response.payment.status === 'failed') {
        error.value = 'El pago ha fallado. Por favor, intenta nuevamente.'
      } else {
        success.value = `Estado del pago: ${getStatusText(response.payment.status)}`
      }
    } else {
      error.value = response.message || 'Error al verificar el estado del pago'
    }
  } catch (err) {
    error.value = err.message || 'Error al verificar el estado del pago'
  } finally {
    isLoading.value = false
  }
}

const processPayment = async () => {
  if (!paymentOrder.value) return

  clearMessages()
  isLoading.value = true

  try {
    const response = await paymentService.processPayment({
      orderId: paymentOrder.value.orderId,
      paymentMethod: 'manual'
    })

    if (response.success) {
      // Actualizar perfil del usuario y localStorage
      await refreshProfile()
      
      // Forzar actualización del localStorage con el estado premium
      const currentUser = JSON.parse(localStorage.getItem('user_data') || '{}')
      currentUser.isPremium = true
      currentUser.hasPremiumAccess = true
      localStorage.setItem('user_data', JSON.stringify(currentUser))
      
      // Asegurar que el usuario tenga un token de autenticación válido
      if (!localStorage.getItem('auth_token')) {
        // Generar un token temporal para usuarios premium
        const tempToken = 'premium-user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
        localStorage.setItem('auth_token', tempToken)
      }
      
      // Mostrar modal de éxito en lugar del mensaje
      showSuccess.value = true
      
      setTimeout(() => {
        emit('success', { type: 'payment', data: response })
      }, 1000)
    } else {
      error.value = response.message || 'Error al procesar el pago'
    }
  } catch (err) {
    error.value = err.message || 'Error al procesar el pago'
  } finally {
    isLoading.value = false
  }
}

const getStatusText = (status) => {
  const statusMap = {
    'pending': 'Pendiente',
    'processing': 'Procesando',
    'completed': 'Completado',
    'failed': 'Fallido',
    'cancelled': 'Cancelado',
    'expired': 'Expirado'
  }
  return statusMap[status] || status
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Watch for modal open/close
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    clearMessages()
    paymentOrder.value = null
  }
})

// Métodos para el modal de confirmación
const showPaymentConfirmation = () => {
  showConfirmation.value = true
}

const closeConfirmation = () => {
  showConfirmation.value = false
}

const confirmPayment = () => {
  showConfirmation.value = false
  createPaymentOrder()
}

// Métodos para el modal de éxito
const closeSuccess = () => {
  showSuccess.value = false
}

const handleSuccessContinue = () => {
  showSuccess.value = false
  emit('close')
}
</script>

<style scoped>
/* Custom animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>