<template>
  <footer class="bg-gradient-to-r from-teal-50 to-slate-100 border-t border-teal-200 mt-auto">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-8 xl:px-12 py-8 lg:py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <!-- Información del proyecto -->
        <div class="lg:col-span-1">
          <div class="flex items-center space-x-4 mb-6">
            <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border border-teal-300 bg-teal-50">
              <img src="/src/assets/legalyth-logo.svg" alt="LEGALYTH IA" class="w-6 h-6 lg:w-8 lg:h-8" />
            </div>
            <h3 class="text-xl lg:text-2xl font-bold text-gray-900">LEGALYTH IA</h3>
          </div>
          <p class="text-gray-600 text-base lg:text-lg leading-relaxed mb-6">
            Plataforma especializada en brindar asistencia a micro y pequeñas empresas en Perú, 
            con herramientas de IA para facilitar la toma de decisiones empresariales.
          </p>
          <div class="flex flex-wrap items-center gap-3">
            <span class="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
              ✨ Powered by AI
            </span>
            <span class="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              🇵🇪 Hecho en Perú
            </span>
          </div>
        </div>

        <!-- Enlaces útiles -->
        <div>
          <h4 class="text-lg lg:text-xl font-bold text-gray-900 mb-6">Enlaces Útiles</h4>
          <ul class="space-y-3 text-base lg:text-lg">
            <li>
              <a href="https://www.sunat.gob.pe" target="_blank" rel="noopener noreferrer" 
                 class="text-gray-600 hover:text-blue-600 transition-colors block hover:underline">
                SUNAT - Superintendencia Nacional de Aduanas
              </a>
            </li>
            <li>
              <a href="https://www.gob.pe/produce" target="_blank" rel="noopener noreferrer"
                  class="text-gray-600 hover:text-blue-600 transition-colors block hover:underline">
                PRODUCE - Ministerio de la Producción
              </a>
            </li>
            <li>
              <a href="https://www.cofide.com.pe" target="_blank" rel="noopener noreferrer"
                 class="text-gray-600 hover:text-blue-600 transition-colors block hover:underline">
                COFIDE - Corporación Financiera de Desarrollo
              </a>
            </li>
            <li>
              <a href="https://www.sunarp.gob.pe" target="_blank" rel="noopener noreferrer"
                 class="text-gray-600 hover:text-blue-600 transition-colors block hover:underline">
                SUNARP - Superintendencia Nacional de Registros
              </a>
            </li>
          </ul>
        </div>

        <!-- Información técnica -->
        <div class="lg:col-span-1">
          <h4 class="text-lg lg:text-xl font-bold text-gray-900 mb-6">Información Técnica</h4>
          <div class="space-y-4 text-base lg:text-lg">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Estado de la API:</span>
              <span class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-green-600 font-medium">En línea</span>
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Versión:</span>
              <span class="text-gray-900 font-medium">v1.0.0</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Última actualización:</span>
              <span class="text-gray-900 font-medium">{{ lastUpdate }}</span>
            </div>
          </div>
          
          <!-- Tecnologías utilizadas -->
          <div class="mt-6">
            <p class="text-sm lg:text-base text-gray-500 mb-3">Construido con:</p>
            <div class="flex flex-wrap gap-2">
              <span class="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-800">
                Vue.js
              </span>
              <span class="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-800">
                Tailwind CSS
              </span>
              <span class="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-800">
                Vite
              </span>
              <span class="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-orange-100 text-orange-800">
                Axios
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Línea divisoria -->
      <div class="border-t border-gray-300 mt-8 lg:mt-12 pt-6 lg:pt-8">
        <div class="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 text-center lg:text-left">
          <div class="text-sm lg:text-base text-gray-500 leading-relaxed">
            © {{ currentYear }} LEGALYTH IA. Asistente legal y tributario para MYPE.
          </div>
          
          <div class="flex items-center justify-center text-sm lg:text-base text-gray-500">
            <span>Hecho con ❤️ para emprendedores peruanos</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

// Computed properties
const currentYear = computed(() => new Date().getFullYear())
const lastUpdate = computed(() => {
  return new Date().toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})
</script>