<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 rounded-t-2xl relative">
        <button 
          @click="$emit('close')"
          class="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <div class="text-center">
          <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold mb-2">Confirmar Pago</h2>
          <p class="text-teal-100">Acceso Premium - LEGALYTH IA</p>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Detalles de la Orden -->
        <div class="bg-gray-50 rounded-xl p-4">
          <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
            <svg class="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Detalles de la Orden
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Producto:</span>
              <span class="font-medium">Plan Premium</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Duración:</span>
              <span class="font-medium">Suscripción mensual</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Precio:</span>
              <span class="font-bold text-teal-600 text-lg">S/ 15.00 PEN</span>
            </div>
          </div>
        </div>

        <!-- Beneficios Premium -->
        <div class="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4">
          <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
            <svg class="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Beneficios Premium
          </h3>
          <ul class="space-y-2 text-sm">
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Consultas ilimitadas con LEGALYTH IA
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Acceso completo a la calculadora tributaria
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Soporte prioritario especializado
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Actualizaciones automáticas de normativas
            </li>
          </ul>
        </div>

        <!-- Método de Pago -->
        <div class="bg-blue-50 rounded-xl p-4">
          <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
            <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            Método de Pago
          </h3>
          <div class="flex items-center space-x-4">
            <div class="bg-white p-2 rounded-lg border-2 border-blue-200">
              <img 
                src="/payment.jpg" 
                alt="Código QR para pago" 
                class="w-20 h-20 object-contain"
              />
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-800">Código QR</p>
              <p class="text-sm text-gray-600">Pago seguro y rápido</p>
            </div>
          </div>
        </div>

        <!-- Aviso de Seguridad -->
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <div>
              <p class="font-medium text-amber-800">Pago Seguro</p>
              <p class="text-sm text-amber-700">Tu información está protegida con encriptación SSL.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer con botones -->
      <div class="p-6 bg-gray-50 rounded-b-2xl">
        <div class="flex space-x-3">
          <button
            @click="$emit('close')"
            class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            @click="$emit('confirm')"
            class="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 font-medium shadow-lg"
          >
            Confirmar Pago
          </button>
        </div>
        <p class="text-xs text-gray-500 text-center mt-3">
          Al confirmar, aceptas nuestros términos y condiciones de servicio.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'confirm'])
</script>

<style scoped>
/* Animaciones suaves para el modal */
.fixed {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.bg-white {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>