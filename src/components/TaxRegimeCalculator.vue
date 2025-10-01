<template>
  <div class="w-full space-y-8 lg:space-y-12">
    <!-- Formulario de cálculo -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div class="bg-gradient-to-r from-primary-600 to-primary-700 px-6 lg:px-8 py-6 lg:py-8">
        <div class="text-center">
          <h2 class="text-xl lg:text-2xl font-bold text-white mb-2">
            💰 Ingresa tus datos
          </h2>
          <p class="text-primary-100 text-sm lg:text-base">
            Calcula el régimen tributario más conveniente para tu negocio
          </p>
        </div>
      </div>
      
      <div class="px-6 lg:px-8 py-8 lg:py-10">
        <form @submit.prevent="handleCalculate" class="max-w-2xl mx-auto">
          <div class="space-y-6">
            <div>
              <label for="monthlyIncome" class="block text-base lg:text-lg font-semibold text-gray-900 mb-3">
                Ingreso Mensual Promedio
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 text-lg font-bold">
                  S/
                </span>
                <input
                  id="monthlyIncome"
                  v-model="monthlyIncome"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10000000"
                  placeholder="5,000.00"
                  class="w-full pl-12 pr-4 py-4 text-lg font-semibold text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors placeholder-gray-400"
                  :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': validationError }"
                  @input="clearValidationError"
                />
              </div>
              <div class="mt-3 min-h-[1.5rem]">
                <p v-if="validationError" class="text-sm text-red-600 font-medium">
                  {{ validationError }}
                </p>
                <p v-else-if="monthlyIncome && String(monthlyIncome).trim() !== ''" class="text-sm text-gray-600">
                  💰 Valor ingresado: <span class="font-bold text-primary-600">S/ {{ Number(monthlyIncome).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                  <br>
                  💡 Ingreso anual estimado: <span class="font-semibold text-gray-900">{{ formatCurrency(Number(monthlyIncome) * 12) }}</span>
                  <br>
                  <span class="text-xs" :class="isValidIncome ? 'text-green-600' : 'text-red-600'">
                    🔍 Estado: {{ isValidIncome ? '✅ Válido' : '❌ Inválido' }} | Validación: {{ JSON.stringify(validateIncome(monthlyIncome)) }}
                  </span>
                </p>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                :disabled="loading || !isValidIncome"
                class="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                <span v-if="loading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculando...
                </span>
                <span v-else class="text-lg">
                  🧮 Calcular Régimen
                </span>
              </button>
              
              <button
                v-if="hasRecommendation"
                type="button"
                @click="clearRecommendation"
                class="sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-8 rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
              >
                🗑️ Limpiar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="mb-6 sm:mb-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Error al calcular el régimen
            </h3>
            <p class="mt-1 text-sm text-red-700">
              {{ error }}
            </p>
            <button
              @click="clearError"
              class="mt-2 text-sm text-red-600 hover:text-red-500 underline"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Resultado -->
    <div v-if="hasRecommendation && recommendation" class="space-y-6 lg:space-y-8">
      <!-- Recomendación principal -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-green-500 to-emerald-600 px-6 lg:px-8 py-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 class="text-xl lg:text-2xl font-bold text-white">
                🎯 Régimen Recomendado
              </h2>
              <p class="text-green-100 text-sm lg:text-base">
                La mejor opción para tu negocio
              </p>
            </div>
            <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white text-green-600 shadow-lg">
              ✅ Recomendado
            </span>
          </div>
        </div>
        
        <div class="px-6 lg:px-8 py-8 lg:py-10">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <!-- Información principal -->
            <div class="space-y-6">
              <div>
                <h3 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                  {{ recommendation.regime }}
                </h3>
                <p class="text-gray-600 text-base lg:text-lg leading-relaxed">
                  {{ recommendation.description }}
                </p>
              </div>
              
              <!-- Impuesto destacado -->
              <div class="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 lg:p-8 text-center border border-primary-200">
                <div class="space-y-2">
                  <p class="text-sm lg:text-base text-primary-600 font-semibold">
                    💰 Impuesto Mensual Estimado
                  </p>
                  <p class="text-3xl lg:text-4xl font-bold text-primary-700">
                    {{ formatCurrency(recommendation.monthlyTax) }}
                  </p>
                  <p class="text-xs lg:text-sm text-primary-600">
                    Ahorro anual estimado vs otros regímenes
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Resumen financiero -->
            <div class="space-y-6">
              <div class="bg-gray-50 rounded-2xl p-6 lg:p-8">
                <h4 class="text-lg lg:text-xl font-bold text-gray-900 mb-4 flex items-center">
                  📊 Resumen Financiero
                </h4>
                <div class="space-y-4">
                  <div class="flex justify-between items-center py-2 border-b border-gray-200">
                    <span class="text-gray-600 font-medium">Ingreso mensual:</span>
                    <span class="font-bold text-gray-900 text-lg">{{ formatCurrency(recommendation.monthlyIncome) }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-200">
                    <span class="text-gray-600 font-medium">Ingreso anual:</span>
                    <span class="font-bold text-gray-900 text-lg">{{ formatCurrency(recommendation.annualIncome) }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-gray-600 font-medium">Impuesto anual:</span>
                    <span class="font-bold text-primary-600 text-lg">{{ formatCurrency(recommendation.monthlyTax * 12) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Porcentaje de impuestos -->
              <div class="bg-blue-50 rounded-2xl p-6 lg:p-8 text-center border border-blue-200">
                <p class="text-sm text-blue-600 font-semibold mb-2">
                  📈 Carga Tributaria
                </p>
                <p class="text-2xl lg:text-3xl font-bold text-blue-700">
                  {{ ((recommendation.monthlyTax * 12 / recommendation.annualIncome) * 100).toFixed(1) }}%
                </p>
                <p class="text-xs text-blue-600 mt-1">
                  de tus ingresos anuales
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Beneficios y Requisitos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <!-- Beneficios -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
            <h3 class="text-lg lg:text-xl font-bold text-white flex items-center">
              ✅ Beneficios de {{ recommendation.regime }}
            </h3>
          </div>
          <div class="p-6 lg:p-8">
            <ul class="space-y-4">
              <li v-for="(benefit, index) in recommendation.benefits" :key="index" class="flex items-start group">
                <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                  <svg class="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <span class="text-gray-700 text-base lg:text-lg leading-relaxed">{{ benefit }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Requisitos -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <h3 class="text-lg lg:text-xl font-bold text-white flex items-center">
              📋 Requisitos para {{ recommendation.regime }}
            </h3>
          </div>
          <div class="p-6 lg:p-8">
            <ul class="space-y-4">
              <li v-for="(requirement, index) in recommendation.requirements" :key="index" class="flex items-start group">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                  <svg class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </div>
              <span class="text-gray-700 text-base lg:text-lg leading-relaxed">{{ requirement }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Información adicional -->
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 lg:p-8">
        <div class="flex items-start">
          <div class="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-4">
            <svg class="h-6 w-6 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-amber-800 mb-2">
              ⚠️ Información Importante
            </h3>
            <p class="text-base text-amber-700 leading-relaxed">
              Esta es una recomendación basada en tus ingresos declarados. Te sugerimos consultar con un contador para una evaluación más detallada de tu situación específica y considerar otros factores como gastos deducibles, tipo de actividad económica y proyecciones futuras.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Ejemplos de ingresos -->
    <div v-if="!hasRecommendation" class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div class="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 lg:px-8 py-6">
        <div class="text-center">
          <h3 class="text-xl lg:text-2xl font-bold text-white mb-2">
            💡 Ejemplos de Ingresos Mensuales
          </h3>
          <p class="text-purple-100 text-sm lg:text-base">
            Haz clic en cualquier ejemplo para calcular automáticamente
          </p>
        </div>
      </div>
      <div class="p-6 lg:p-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <button
            v-for="example in incomeExamples"
            :key="example.amount"
            @click="setExampleIncome(example.amount)"
            class="group p-6 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 text-left transform hover:scale-105 hover:shadow-lg"
          >
            <div class="text-center">
              <div class="text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                {{ formatCurrency(example.amount) }}
              </div>
              <div class="text-sm lg:text-base text-gray-600 mt-2 group-hover:text-primary-700 transition-colors">
                {{ example.description }}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTaxRegime } from '../composables/useTaxRegime.js'

// Composable para manejar el régimen tributario
const {
  recommendation,
  monthlyIncome,
  loading,
  error,
  hasRecommendation,
  isValidIncome,
  formattedIncome,
  calculateRegime,
  validateIncome,
  formatCurrency,
  clearRecommendation,
  clearError
} = useTaxRegime()

// Estado local
const validationError = ref('')

// Ejemplos de ingresos
const incomeExamples = ref([
  { amount: 2000, description: 'Pequeño negocio' },
  { amount: 5000, description: 'Negocio mediano' },
  { amount: 10000, description: 'Negocio establecido' },
  { amount: 25000, description: 'Empresa en crecimiento' }
])

// Métodos
const handleCalculate = async () => {
  clearValidationError()
  
  const validation = validateIncome(monthlyIncome.value)
  if (!validation.valid) {
    validationError.value = validation.message
    return
  }

  try {
    await calculateRegime(monthlyIncome.value)
  } catch (err) {
    console.error('Error en cálculo:', err)
  }
}

const setExampleIncome = (amount) => {
  monthlyIncome.value = amount.toString()
  clearValidationError()
}

const clearValidationError = () => {
  validationError.value = ''
}
</script>