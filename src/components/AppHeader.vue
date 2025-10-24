<template>
  <header class="bg-white/95 backdrop-blur-sm shadow-lg border-b border-teal-200 sticky top-0 z-50">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-8 xl:px-12">
      <div class="flex justify-between items-center h-16 lg:h-20">
        <!-- Logo y título -->
        <div class="flex items-center space-x-3 lg:space-x-6 min-w-0 flex-1">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center shadow-lg border border-teal-300 bg-teal-50">
              <img src="/src/assets/legalyth-logo.svg" alt="LEGALYTH IA" class="w-7 h-7 lg:w-10 lg:h-10" />
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 truncate">
              LEGALYTH IA
            </h1>
            <p class="text-sm lg:text-base text-slate-500 hidden sm:block truncate">
              Asistente legal y tributario para MYPE
            </p>
          </div>
        </div>

        <!-- Navegación principal - Desktop -->
        <div class="hidden lg:flex items-center space-x-2 xl:space-x-4">
          <nav class="flex space-x-2 xl:space-x-4">
            <button
              v-for="item in navigationItems"
              :key="item.id"
              @click="setActiveTab(item.id)"
              class="flex items-center space-x-3 px-4 lg:px-6 py-3 lg:py-4 rounded-xl text-base lg:text-lg font-medium transition-all duration-200 whitespace-nowrap"
              :class="activeTab === item.id 
                ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg transform scale-105' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-teal-50 hover:shadow-md'"
            >
              <component :is="item.icon" class="w-5 h-5 lg:w-6 lg:h-6" />
              <span>{{ item.label }}</span>
            </button>
          </nav>
          
          <!-- Botones de autenticación / Usuario logueado -->
          <div class="flex items-center space-x-2 ml-4">
            <!-- Mostrar cuando NO está logueado -->
            <template v-if="!isAuthenticated">
              <button
                @click="openAuthModal('login')"
                class="px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                @click="openAuthModal('register')"
                class="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-sm"
              >
                Registrarse
              </button>
            </template>
            
            <!-- Mostrar cuando SÍ está logueado -->
            <template v-else>
              <div class="relative">
                <button
                  @click="toggleUserMenu"
                  class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                >
                  <div class="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <span class="text-teal-600 font-semibold text-sm">
                      {{ getUserInitials(user?.name || user?.email) }}
                    </span>
                  </div>
                  <span class="hidden sm:block">{{ user?.name || user?.email || 'Usuario' }}</span>
                  <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showUserMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <!-- Menú desplegable del usuario -->
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <div
                    v-if="showUserMenu"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                  >
                    <div class="px-4 py-2 border-b border-gray-100">
                      <p class="text-sm font-medium text-gray-900">{{ user?.name || 'Usuario' }}</p>
                      <p class="text-xs text-gray-500">{{ user?.email }}</p>
                      <p v-if="user?.isPremium || user?.hasPremiumAccess" class="text-xs text-teal-600 font-medium">✨ Premium</p>
                    </div>
                    <button
                      @click="logout"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </transition>
              </div>
            </template>
          </div>
        </div>

        <!-- Navegación compacta - Tablet -->
        <div class="hidden md:flex lg:hidden items-center space-x-2">
          <nav class="flex space-x-2">
            <button
              v-for="item in navigationItems"
              :key="item.id"
              @click="setActiveTab(item.id)"
              class="flex items-center justify-center p-2 rounded-lg transition-colors"
              :class="activeTab === item.id 
                ? 'bg-teal-100 text-teal-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-teal-50'"
              :title="item.label"
            >
              <component :is="item.icon" class="w-5 h-5" />
            </button>
          </nav>
          
          <!-- Botones de autenticación para tablet -->
          <div class="flex items-center space-x-1 ml-2">
            <!-- Mostrar cuando NO está logueado -->
            <template v-if="!isAuthenticated">
              <button
                @click="openAuthModal('login')"
                class="px-3 py-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                @click="openAuthModal('register')"
                class="px-3 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors"
              >
                Registrarse
              </button>
            </template>
            
            <!-- Mostrar cuando SÍ está logueado -->
            <template v-else>
              <div class="relative">
                <button
                  @click="toggleUserMenu"
                  class="flex items-center space-x-1 px-2 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors border border-gray-200"
                >
                  <div class="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                    <span class="text-teal-600 font-semibold text-xs">
                      {{ getUserInitials(user?.name || user?.email) }}
                    </span>
                  </div>
                  <span class="hidden lg:block">{{ (user?.name || user?.email || 'Usuario').split(' ')[0] }}</span>
                </button>
              </div>
            </template>
          </div>
        </div>

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
        <div v-if="showMobileMenu" class="md:hidden border-t border-teal-200 py-3 bg-teal-50/30">
          <div class="space-y-1 px-2">
            <button
              v-for="item in navigationItems"
              :key="item.id"
              @click="setActiveTab(item.id)"
              class="flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-colors"
              :class="activeTab === item.id 
                  ? 'bg-teal-100 text-teal-700 shadow-sm' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-white'"
            >
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span>{{ item.label }}</span>
              <svg 
                v-if="activeTab === item.id"
                class="w-4 h-4 ml-auto text-teal-600" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- Separador -->
            <div class="border-t border-teal-200 my-2"></div>
            
            <!-- Botones de autenticación para móvil -->
            <template v-if="!isAuthenticated">
              <button
                @click="openAuthModal('login')"
                class="flex items-center justify-center w-full px-3 py-3 rounded-lg text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-white transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                @click="openAuthModal('register')"
                class="flex items-center justify-center w-full px-3 py-3 rounded-lg text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm"
              >
                Registrarse
              </button>
            </template>
            
            <!-- Usuario logueado para móvil -->
            <template v-else>
              <div class="flex items-center space-x-3 px-3 py-3 border-b border-teal-200">
                <div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <span class="text-teal-600 font-semibold">
                    {{ getUserInitials(user?.name || user?.email) }}
                  </span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ user?.name || 'Usuario' }}</p>
                  <p class="text-xs text-gray-500">{{ user?.email }}</p>
                  <p v-if="user?.isPremium || user?.hasPremiumAccess" class="text-xs text-teal-600 font-medium">✨ Premium</p>
                </div>
              </div>
              <button
                @click="logout"
                class="flex items-center justify-center w-full px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
              >
                Cerrar Sesión
              </button>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useGlobalAuth } from '../composables/useAuth.js'

// Props
defineProps({
  activeTab: {
    type: String,
    default: 'calculator'
  }
})

// Emits
const emit = defineEmits(['tab-change', 'open-auth'])

// Composables
const { user, isAuthenticated, logout: authLogout } = useGlobalAuth()

// Estado local
const showMobileMenu = ref(false)
const showUserMenu = ref(false)

// Métodos
const getUserInitials = (name) => {
  if (!name) return 'U'
  const words = name.split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = async () => {
  try {
    await authLogout()
    showUserMenu.value = false
    showMobileMenu.value = false
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

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

const openAuthModal = (mode) => {
  emit('open-auth', mode)
  showMobileMenu.value = false
}
</script>