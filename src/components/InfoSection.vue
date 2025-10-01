<template>
  <div class="max-w-6xl mx-auto space-y-12 lg:space-y-16 px-4 lg:px-8">
    <!-- Hero Section -->
    <div class="text-center py-8 lg:py-12">
      <div class="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
        <svg class="w-12 h-12 lg:w-16 lg:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 lg:mb-8">
        AI-MYPE Perú
      </h1>
      <p class="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
        Tu asistente inteligente para micro y pequeñas empresas en Perú. 
        Simplificamos la gestión tributaria y brindamos asesoría especializada.
      </p>
    </div>

    <!-- Características principales -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-10 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <div class="flex items-center space-x-6 mb-8">
          <div class="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <svg class="w-8 h-8 lg:w-10 lg:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">Calculadora de Régimen Tributario</h3>
        </div>
        <p class="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
          Determina automáticamente el régimen tributario más conveniente para tu empresa 
          basándose en tus ingresos mensuales y características del negocio.
        </p>
        <ul class="space-y-4 text-base lg:text-lg text-gray-600">
          <li class="flex items-center space-x-4">
            <svg class="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>Análisis automático de ingresos</span>
          </li>
          <li class="flex items-center space-x-4">
            <svg class="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>Recomendaciones personalizadas</span>
          </li>
          <li class="flex items-center space-x-4">
            <svg class="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>Cálculo de impuestos estimados</span>
          </li>
        </ul>
      </div>

      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-10 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <div class="flex items-center space-x-6 mb-8">
          <div class="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <svg class="w-8 h-8 lg:w-10 lg:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 class="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">Asistente de IA</h3>
        </div>
        <p class="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
          Chatea con nuestro asistente especializado en temas empresariales y tributarios 
          para resolver tus dudas de manera rápida y precisa.
        </p>
        <ul class="space-y-4 text-base lg:text-lg text-gray-600">
          <li class="flex items-center space-x-4">
            <svg class="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>Respuestas especializadas en MYPE</span>
          </li>
          <li class="flex items-center space-x-4">
            <svg class="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>Disponible 24/7</span>
          </li>
          <li class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>Información actualizada</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Regímenes tributarios -->
    <div class="card p-4 sm:p-6">
      <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Regímenes Tributarios en Perú</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div class="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center space-x-2 mb-3">
            <div class="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
            <h4 class="font-semibold text-gray-900 text-sm sm:text-base">Nuevo RUS</h4>
          </div>
          <p class="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">
            Para pequeños negocios con ingresos y compras limitadas.
          </p>
          <div class="text-xs text-gray-500 space-y-1">
            <p><strong>Límite:</strong> Hasta S/ 8,000 mensuales</p>
            <p><strong>Cuota:</strong> Fija según categoría</p>
          </div>
        </div>

        <div class="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center space-x-2 mb-3">
            <div class="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
            <h4 class="font-semibold text-gray-900 text-sm sm:text-base">Régimen Especial</h4>
          </div>
          <p class="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">
            Para empresas con ingresos moderados y mayor flexibilidad.
          </p>
          <div class="text-xs text-gray-500 space-y-1">
            <p><strong>Límite:</strong> Hasta S/ 525,000 anuales</p>
            <p><strong>Tasa:</strong> 1.5% de ingresos netos</p>
          </div>
        </div>

        <div class="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <div class="flex items-center space-x-2 mb-3">
            <div class="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
            <h4 class="font-semibold text-gray-900 text-sm sm:text-base">Régimen General</h4>
          </div>
          <p class="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">
            Para empresas de cualquier tamaño sin límites de ingresos.
          </p>
          <div class="text-xs text-gray-500 space-y-1">
            <p><strong>Límite:</strong> Sin límite</p>
            <p><strong>Tasa:</strong> 29.5% sobre utilidades</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Información adicional -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div class="card p-4 sm:p-6">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">¿Cómo funciona?</h3>
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
               <span class="text-xs font-semibold text-blue-600">1</span>
             </div>
             <div class="min-w-0 flex-1">
               <h4 class="font-medium text-gray-900 text-sm sm:text-base">Ingresa tus datos</h4>
               <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">Proporciona información sobre tus ingresos mensuales</p>
             </div>
           </div>
           <div class="flex items-start space-x-3">
             <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
               <span class="text-xs font-semibold text-blue-600">2</span>
             </div>
             <div class="min-w-0 flex-1">
               <h4 class="font-medium text-gray-900 text-sm sm:text-base">Análisis automático</h4>
               <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">Nuestro sistema analiza tu situación</p>
             </div>
           </div>
           <div class="flex items-start space-x-3">
             <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
               <span class="text-xs font-semibold text-blue-600">3</span>
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="font-medium text-gray-900 text-sm sm:text-base">Recibe recomendaciones</h4>
              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">Obtén el régimen más conveniente para ti</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card p-4 sm:p-6">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Soporte y Recursos</h3>
        <div class="space-y-2 sm:space-y-3">
          <a href="#" class="flex items-center space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <div class="min-w-0 flex-1">
              <h4 class="font-medium text-gray-900 text-sm sm:text-base">Guías y Tutoriales</h4>
              <p class="text-xs text-gray-500">Aprende paso a paso</p>
            </div>
          </a>
          <a href="#" class="flex items-center space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="min-w-0 flex-1">
              <h4 class="font-medium text-gray-900 text-sm sm:text-base">Preguntas Frecuentes</h4>
              <p class="text-xs text-gray-500">Resuelve tus dudas</p>
            </div>
          </a>
          <a href="#" class="flex items-center space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div class="min-w-0 flex-1">
              <h4 class="font-medium text-gray-900 text-sm sm:text-base">Contacto</h4>
              <p class="text-xs text-gray-500">Obtén ayuda personalizada</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Este componente es principalmente estático, no requiere lógica compleja
</script>