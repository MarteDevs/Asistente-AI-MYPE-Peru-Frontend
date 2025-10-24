<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
            <p class="text-gray-600 mt-1">Gestiona tu cuenta y revisa tu actividad</p>
          </div>
          <button
            @click="$emit('close')"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <svg class="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error al cargar el dashboard</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            <button
              @click="loadDashboardData"
              class="mt-2 text-sm text-red-600 hover:text-red-500 underline"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-6">
        <!-- User Info Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
              <span class="text-2xl font-bold text-white">
                {{ userProfile?.name?.charAt(0)?.toUpperCase() || 'U' }}
              </span>
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-semibold text-gray-900">{{ userProfile?.name || 'Usuario' }}</h2>
              <p class="text-gray-600">{{ userProfile?.email }}</p>
              <div class="flex items-center mt-2">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    userProfile?.isPremium 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  <svg 
                    :class="[
                      'w-3 h-3 mr-1',
                      userProfile?.isPremium ? 'text-green-600' : 'text-gray-600'
                    ]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      :d="userProfile?.isPremium 
                        ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                        : 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'"
                    />
                  </svg>
                  {{ userProfile?.isPremium ? 'Premium' : 'Gratuito' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Queries Used -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Consultas Usadas</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ queryLimits?.freeQueriesUsed || 0 }}
                  <span v-if="!userProfile?.isPremium" class="text-sm text-gray-500">
                    / {{ queryLimits?.freeQueriesLimit || 5 }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Remaining Queries -->
          <div v-if="!userProfile?.isPremium" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Consultas Restantes</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ Math.max(0, (queryLimits?.freeQueriesLimit || 5) - (queryLimits?.freeQueriesUsed || 0)) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Premium Status -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div 
                :class="[
                  'w-12 h-12 rounded-lg flex items-center justify-center',
                  userProfile?.isPremium ? 'bg-green-100' : 'bg-gray-100'
                ]"
              >
                <svg 
                  :class="[
                    'w-6 h-6',
                    userProfile?.isPremium ? 'text-green-600' : 'text-gray-600'
                  ]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Estado</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ userProfile?.isPremium ? 'Premium' : 'Gratuito' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Account Age -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Miembro desde</p>
                <p class="text-lg font-bold text-gray-900">
                  {{ formatAccountAge(userProfile?.createdAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Usage Progress (for free users) -->
        <div v-if="!userProfile?.isPremium" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Uso de Consultas Gratuitas</h3>
            <button
              @click="$emit('upgrade')"
              class="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-700 text-white text-sm font-medium rounded-lg hover:from-teal-700 hover:to-cyan-800 transition-colors"
            >
              Obtener Premium
            </button>
          </div>
          
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Progreso</span>
              <span class="font-medium text-gray-900">
                {{ queryLimits?.freeQueriesUsed || 0 }} / {{ queryLimits?.freeQueriesLimit || 5 }}
              </span>
            </div>
            
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="bg-gradient-to-r from-teal-500 to-cyan-600 h-3 rounded-full transition-all duration-500"
                :style="{ 
                  width: `${Math.min(100, ((queryLimits?.freeQueriesUsed || 0) / (queryLimits?.freeQueriesLimit || 5)) * 100)}%` 
                }"
              ></div>
            </div>
            
            <div class="flex justify-between text-xs text-gray-500">
              <span>0 consultas</span>
              <span>{{ queryLimits?.freeQueriesLimit || 5 }} consultas</span>
            </div>
          </div>

          <!-- Warning if close to limit -->
          <div 
            v-if="(queryLimits?.freeQueriesUsed || 0) >= (queryLimits?.freeQueriesLimit || 5) - 1"
            class="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg"
          >
            <div class="flex">
              <svg class="w-5 h-5 text-orange-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div class="ml-3">
                <h4 class="text-sm font-medium text-orange-800">
                  {{ (queryLimits?.freeQueriesUsed || 0) >= (queryLimits?.freeQueriesLimit || 5) 
                    ? 'Has alcanzado el límite' 
                    : 'Cerca del límite' }}
                </h4>
                <p class="text-sm text-orange-700 mt-1">
                  {{ (queryLimits?.freeQueriesUsed || 0) >= (queryLimits?.freeQueriesLimit || 5)
                    ? 'Necesitas una cuenta Premium para continuar usando LEGALYTH IA.'
                    : 'Te queda solo 1 consulta gratuita. Considera obtener Premium para acceso ilimitado.' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment History -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Historial de Pagos</h3>
            <button
              @click="loadPaymentHistory"
              :disabled="loadingPayments"
              class="text-sm text-teal-600 hover:text-teal-700 font-medium disabled:opacity-50"
            >
              <span v-if="loadingPayments">Cargando...</span>
              <span v-else>Actualizar</span>
            </button>
          </div>

          <!-- Payment History List -->
          <div v-if="paymentHistory.length > 0" class="space-y-4">
            <div
              v-for="payment in paymentHistory"
              :key="payment.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div 
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    payment.status === 'completed' ? 'bg-green-100' : 
                    payment.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                  ]"
                >
                  <svg 
                    :class="[
                      'w-5 h-5',
                      payment.status === 'completed' ? 'text-green-600' : 
                      payment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    ]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      :d="payment.status === 'completed' ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' :
                         payment.status === 'pending' ? 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' :
                         'M6 18L18 6M6 6l12 12'"
                    />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Acceso Premium</p>
                  <p class="text-sm text-gray-600">{{ formatDate(payment.createdAt) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">S/ {{ Number(payment.amount).toFixed(2) }}</p>
                <p 
                  :class="[
                    'text-xs font-medium',
                    payment.status === 'completed' ? 'text-green-600' : 
                    payment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  ]"
                >
                  {{ getStatusText(payment.status) }}
                </p>
              </div>
            </div>
          </div>

          <!-- No Payment History -->
          <div v-else class="text-center py-8">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="text-gray-500">No tienes historial de pagos aún</p>
            <button
              v-if="!userProfile?.isPremium"
              @click="$emit('upgrade')"
              class="mt-3 text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              Obtener Premium
            </button>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Acciones de Cuenta</h3>
          <div class="space-y-3">
            <button
              @click="refreshData"
              :disabled="isLoading"
              class="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading">Actualizando...</span>
              <span v-else>Actualizar Datos</span>
            </button>
            
            <button
              v-if="!userProfile?.isPremium"
              @click="$emit('upgrade')"
              class="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-lg hover:from-teal-700 hover:to-cyan-800 transition-colors ml-0 sm:ml-3"
            >
              Obtener Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGlobalAuth } from '../composables/useAuth.js'
import paymentService from '../services/paymentService.js'

// Emits
const emit = defineEmits(['close', 'upgrade'])

// Composables
const { user, queryLimits, refreshProfile, refreshQueryLimits } = useGlobalAuth()

// State
const isLoading = ref(false)
const loadingPayments = ref(false)
const error = ref('')
const userProfile = ref(null)
const paymentHistory = ref([])

// Methods
const loadDashboardData = async () => {
  isLoading.value = true
  error.value = ''

  try {
    // Refresh user profile and query limits
    await Promise.all([
      refreshProfile(),
      refreshQueryLimits()
    ])

    userProfile.value = user.value
  } catch (err) {
    error.value = err.message || 'Error al cargar los datos del dashboard'
  } finally {
    isLoading.value = false
  }
}

const loadPaymentHistory = async () => {
  loadingPayments.value = true

  try {
    const response = await paymentService.getPaymentHistory()
    if (response.success) {
      paymentHistory.value = response.payments || []
    } else {
      console.error('Error loading payment history:', response.message)
      paymentHistory.value = []
    }
  } catch (err) {
    console.error('Error loading payment history:', err)
    paymentHistory.value = []
    // Don't show error for payment history as it's not critical
  } finally {
    loadingPayments.value = false
  }
}

const refreshData = async () => {
  await Promise.all([
    loadDashboardData(),
    loadPaymentHistory()
  ])
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatAccountAge = (dateString) => {
  if (!dateString) return 'Reciente'
  
  const accountDate = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - accountDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 30) {
    return `${diffDays} días`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? 'mes' : 'meses'}`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years} ${years === 1 ? 'año' : 'años'}`
  }
}

const getStatusText = (status) => {
  const statusMap = {
    completed: 'Completado',
    pending: 'Pendiente',
    failed: 'Fallido',
    cancelled: 'Cancelado'
  }
  return statusMap[status] || status
}

// Lifecycle
onMounted(() => {
  loadDashboardData()
  loadPaymentHistory()
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
</style>