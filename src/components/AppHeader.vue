<template>
  <header class="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-8 xl:px-12">
      <div class="flex justify-between items-center h-16 lg:h-20">
        <!-- Logo y título -->
        <div class="flex items-center space-x-3 lg:space-x-6 min-w-0 flex-1">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-5 h-5 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 truncate">
              AI-MYPE Perú
            </h1>
            <p class="text-sm lg:text-base text-gray-500 hidden sm:block truncate">
              Asistente para Micro y Pequeñas Empresas
            </p>
          </div>
        </div>

        <!-- Navegación principal - Desktop -->
        <nav class="hidden lg:flex space-x-2 xl:space-x-4">
          <button
            v-for="item in navigationItems"
            :key="item.id"
            @click="setActiveTab(item.id)"
            class="flex items-center space-x-3 px-4 lg:px-6 py-3 lg:py-4 rounded-xl text-base lg:text-lg font-medium transition-all duration-200 whitespace-nowrap"
            :class="activeTab === item.id 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:shadow-md'"
          >
            <component :is="item.icon" class="w-5 h-5 lg:w-6 lg:h-6" />
            <span>{{ item.label }}</span>
          </button>
        </nav>

        <!-- Navegación compacta - Tablet -->
        <nav class="hidden md:flex lg:hidden space-x-2">
          <button
            v-for="item in navigationItems"
            :key="item.id"
            @click="setActiveTab(item.id)"
            class="flex items-center justify-center p-2 rounded-lg transition-colors"
            :class="activeTab === item.id 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
            :title="item.label"
          >
            <component :is="item.icon" class="w-5 h-5" />
          </button>
        </nav>

        <!-- Menú móvil - Mobile -->
        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Abrir menú"
          >
            <svg 
              class="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200" 
              :class="{ 'rotate-90': showMobileMenu }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                :d="showMobileMenu ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'" 
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Menú móvil expandido -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 py-3 bg-gray-50">
          <div class="space-y-1 px-2">
            <button
              v-for="item in navigationItems"
              :key="item.id"
              @click="setActiveTab(item.id)"
              class="flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-colors"
              :class="activeTab === item.id 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-white'"
            >
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span>{{ item.label }}</span>
              <svg 
                v-if="activeTab === item.id"
                class="w-4 h-4 ml-auto text-blue-600" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

// Props
defineProps({
  activeTab: {
    type: String,
    default: 'calculator'
  }
})

// Emits
const emit = defineEmits(['tab-change'])

// Estado local
const showMobileMenu = ref(false)

// Iconos como componentes inline
const CalculatorIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  `
}

const ChatIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  `
}

const InfoIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}

// Elementos de navegación
const navigationItems = ref([
  {
    id: 'calculator',
    label: 'Calculadora',
    icon: CalculatorIcon
  },
  {
    id: 'chat',
    label: 'Chat IA',
    icon: ChatIcon
  },
  {
    id: 'info',
    label: 'Información',
    icon: InfoIcon
  }
])

// Métodos
const setActiveTab = (tabId) => {
  emit('tab-change', tabId)
  showMobileMenu.value = false
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}
</script>