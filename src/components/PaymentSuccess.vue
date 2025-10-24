<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full text-center p-8 animate-fade-in">
      <!-- Success Icon -->
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <!-- Success Message -->
      <h2 class="text-2xl font-bold text-gray-800 mb-4">¡Pago Confirmado!</h2>
      <p class="text-gray-600 mb-6">
        Tu suscripción Premium ha sido activada exitosamente. 
        Ahora tienes acceso completo a todas las funcionalidades de LEGALYTH IA.
      </p>

      <!-- Premium Benefits -->
      <div class="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 mb-6">
        <h3 class="font-semibold text-teal-800 mb-3">✨ Beneficios Activados:</h3>
        <ul class="text-sm text-teal-700 space-y-1 text-left">
          <li>✓ Consultas ilimitadas con LEGALYTH IA</li>
          <li>✓ Calculadora tributaria completa</li>
          <li>✓ Soporte prioritario y actualizaciones</li>
          <li>✓ Historial completo de consultas</li>
        </ul>
      </div>

      <!-- Action Button -->
      <button
        @click="handleContinue"
        class="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Continuar
      </button>

      <!-- Loading indicator -->
      <div v-if="isReloading" class="mt-4 flex items-center justify-center text-gray-500">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Actualizando página...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'continue'])

// State
const isReloading = ref(false)

// Methods
const handleContinue = async () => {
  isReloading.value = true
  
  // Emit continue event
  emit('continue')
  
  // Wait a moment for any cleanup
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Reload the page to refresh user state
  window.location.reload()
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>