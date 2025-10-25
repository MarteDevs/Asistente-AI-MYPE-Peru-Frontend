<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import TaxRegimeCalculator from './components/TaxRegimeCalculator.vue'
import ChatAssistant from './components/ChatAssistant.vue'
import InfoSection from './components/InfoSection.vue'
import PaymentModal from './components/PaymentModal.vue'
import PaymentConfirmation from './components/PaymentConfirmation.vue'
import AuthModal from './components/AuthModal.vue'
import { useGlobalAuth } from './composables/useAuth.js'

// Composables
const { queryLimits } = useGlobalAuth()

// Estado de la aplicación
const activeTab = ref('calculator')

// Estado de los modales
const showPaymentModal = ref(false)
const showPaymentConfirmation = ref(false)
const showAuthModal = ref(false)
const authModalMode = ref('login')

// Métodos
const handleTabChange = (tabId) => {
  activeTab.value = tabId
}

const openPaymentModal = () => {
  // Primero mostrar la confirmación de pago
  showPaymentConfirmation.value = true
}

const openPaymentModalDirect = () => {
  // Abrir directamente el modal de pago (para uso interno)
  showPaymentModal.value = true
}

const closePaymentModal = () => {
  showPaymentModal.value = false
}

const closePaymentConfirmation = () => {
  showPaymentConfirmation.value = false
}

const confirmPayment = () => {
  // Cerrar confirmación y abrir modal de pago
  showPaymentConfirmation.value = false
  showPaymentModal.value = true
}

const openAuthModal = (mode = 'login') => {
  authModalMode.value = mode
  showAuthModal.value = true
}

const closeAuthModal = () => {
  showAuthModal.value = false
}

const handlePaymentModalOpenAuth = (mode) => {
  openAuthModal(mode)
}

const handleAuthSuccess = (data) => {
  // Después de autenticarse exitosamente, abrir el modal de pago directamente
  setTimeout(() => {
    openPaymentModalDirect()
  }, 500)
}

const handlePaymentSuccess = (data) => {
  // Manejar éxito del pago si es necesario
  console.log('Pago exitoso:', data)
}

// Escuchar eventos globales para abrir el modal de pago
onMounted(() => {
  window.addEventListener('showPaymentModal', openPaymentModal)
  
  // Cleanup
  return () => {
    window.removeEventListener('showPaymentModal', openPaymentModal)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 flex flex-col">
    <!-- Header -->
    <AppHeader 
      :active-tab="activeTab" 
      @tab-change="handleTabChange"
      @open-auth="openAuthModal"
    />

    <!-- Contenido principal -->
    <main class="flex-1 py-8 lg:py-16">
      <div class="max-w-[1400px] mx-auto px-4 lg:px-8 xl:px-12">
        <!-- Calculadora de Régimen Tributario -->
        <div v-if="activeTab === 'calculator'" class="animate-fadeIn">
          <!-- Hero Section -->
          <div class="text-center mb-12 lg:mb-20">
            <div class="max-w-5xl mx-auto">
              <h1 class="text-4xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 lg:mb-8 leading-tight">
                Calculadora de Régimen Tributario
              </h1>
              <p class="text-xl lg:text-2xl xl:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Descubre cuál es el régimen tributario más conveniente para tu empresa
                basándose en tus ingresos mensuales y características del negocio.
              </p>
            </div>
          </div>

          <!-- Calculator Container -->
          <div class="max-w-6xl mx-auto">
            <TaxRegimeCalculator />
          </div>
        </div>

        <!-- Chat con IA -->
        <div v-if="activeTab === 'chat'" class="animate-fadeIn">
          <!-- Hero Section -->
          <div class="text-center mb-12 lg:mb-20">
            <div class="max-w-5xl mx-auto">
              <h1 class="text-4xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 lg:mb-8 leading-tight">
                LEGALYTH IA
              </h1>
              <p class="text-xl lg:text-2xl xl:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Asistente legal y tributario para micro y pequeñas empresas.
                Obtén respuestas rápidas y precisas sobre temas legales y fiscales.
              </p>
            </div>
          </div>

          <!-- Chat Container -->
          <div class="max-w-6xl mx-auto">
            <ChatAssistant />
          </div>
        </div>

        <!-- Información -->
        <div v-if="activeTab === 'info'" class="animate-fadeIn">
          <div class="max-w-7xl mx-auto">
            <InfoSection />
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <AppFooter />

    <!-- Modales -->
    <PaymentConfirmation
      :is-open="showPaymentConfirmation"
      @close="closePaymentConfirmation"
      @confirm="confirmPayment"
    />

    <PaymentModal
      :is-open="showPaymentModal"
      :query-limits="queryLimits"
      @close="closePaymentModal"
      @success="handlePaymentSuccess"
      @open-auth="handlePaymentModalOpenAuth"
    />

    <AuthModal
      :is-open="showAuthModal"
      :initial-mode="authModalMode"
      @close="closeAuthModal"
      @success="handleAuthSuccess"
    />
  </div>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
