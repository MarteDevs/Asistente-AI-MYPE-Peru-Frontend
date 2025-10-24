<template>
  <div class="qr-code-container">
    <div v-if="isLoading" class="flex items-center justify-center p-8">
      <svg class="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <div v-else-if="error" class="text-center p-4">
      <div class="text-red-500 mb-2">
        <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <p class="text-sm text-red-600">{{ error }}</p>
    </div>
    
    <div v-else-if="qrCodeDataUrl" class="text-center">
      <img 
        :src="qrCodeDataUrl" 
        :alt="altText"
        :class="imageClass"
        class="mx-auto border border-gray-300 rounded-lg"
      />
      <p v-if="showCaption" class="text-sm text-gray-600 mt-2">
        {{ caption || 'Escanea este código QR' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

// Props
const props = defineProps({
  // Datos para generar el QR
  data: {
    type: String,
    required: true
  },
  // Tamaño del QR en píxeles
  size: {
    type: Number,
    default: 200
  },
  // Nivel de corrección de errores (L, M, Q, H)
  errorCorrectionLevel: {
    type: String,
    default: 'M',
    validator: (value) => ['L', 'M', 'Q', 'H'].includes(value)
  },
  // Color del QR
  foregroundColor: {
    type: String,
    default: '#000000'
  },
  // Color de fondo
  backgroundColor: {
    type: String,
    default: '#FFFFFF'
  },
  // Clases CSS adicionales para la imagen
  imageClass: {
    type: String,
    default: ''
  },
  // Texto alternativo para la imagen
  altText: {
    type: String,
    default: 'Código QR'
  },
  // Mostrar caption
  showCaption: {
    type: Boolean,
    default: true
  },
  // Texto del caption
  caption: {
    type: String,
    default: ''
  }
})

// State
const qrCodeDataUrl = ref('')
const isLoading = ref(false)
const error = ref('')

// Methods
const generateQRCode = async () => {
  if (!props.data) {
    error.value = 'No hay datos para generar el código QR'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // Generar QR usando una librería simple (simulación)
    // En un proyecto real, usarías una librería como qrcode
    const qrData = await generateQRDataUrl(props.data, {
      width: props.size,
      height: props.size,
      errorCorrectionLevel: props.errorCorrectionLevel,
      color: {
        dark: props.foregroundColor,
        light: props.backgroundColor
      }
    })

    qrCodeDataUrl.value = qrData
  } catch (err) {
    console.error('Error generando código QR:', err)
    error.value = 'Error al generar el código QR'
  } finally {
    isLoading.value = false
  }
}

// Función simulada para generar QR (en un proyecto real usarías qrcode library)
const generateQRDataUrl = async (text, options = {}) => {
  // Esta es una implementación simulada
  // En un proyecto real, usarías:
  // import QRCode from 'qrcode'
  // return await QRCode.toDataURL(text, options)
  
  return new Promise((resolve) => {
    // Simulamos la generación del QR con un SVG simple
    const size = options.width || 200
    const darkColor = options.color?.dark || '#000000'
    const lightColor = options.color?.light || '#FFFFFF'
    
    // Crear un patrón QR básico (esto es solo para demostración)
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${lightColor}"/>
        <g fill="${darkColor}">
          <!-- Esquinas del QR -->
          <rect x="0" y="0" width="70" height="70"/>
          <rect x="10" y="10" width="50" height="50" fill="${lightColor}"/>
          <rect x="20" y="20" width="30" height="30"/>
          
          <rect x="${size-70}" y="0" width="70" height="70"/>
          <rect x="${size-60}" y="10" width="50" height="50" fill="${lightColor}"/>
          <rect x="${size-50}" y="20" width="30" height="30"/>
          
          <rect x="0" y="${size-70}" width="70" height="70"/>
          <rect x="10" y="${size-60}" width="50" height="50" fill="${lightColor}"/>
          <rect x="20" y="${size-50}" width="30" height="30"/>
          
          <!-- Patrón de datos simulado -->
          ${generateQRPattern(size, text)}
        </g>
        <text x="${size/2}" y="${size-10}" text-anchor="middle" font-size="8" fill="${darkColor}" opacity="0.3">
          QR: ${text.substring(0, 20)}${text.length > 20 ? '...' : ''}
        </text>
      </svg>
    `
    
    const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`
    setTimeout(() => resolve(dataUrl), 500) // Simular delay de generación
  })
}

// Generar patrón de datos simulado
const generateQRPattern = (size, text) => {
  let pattern = ''
  const cellSize = 10
  const cols = Math.floor(size / cellSize)
  const rows = Math.floor(size / cellSize)
  
  // Generar patrón basado en el hash del texto
  const hash = text.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  for (let row = 8; row < rows - 8; row++) {
    for (let col = 8; col < cols - 8; col++) {
      // Evitar las esquinas
      if ((row < 10 && col < 10) || 
          (row < 10 && col > cols - 10) || 
          (row > rows - 10 && col < 10)) {
        continue
      }
      
      // Generar patrón pseudo-aleatorio basado en posición y hash
      const shouldFill = ((row * col + hash) % 3) === 0
      if (shouldFill) {
        pattern += `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}"/>`
      }
    }
  }
  
  return pattern
}

// Watchers
watch(() => props.data, generateQRCode, { immediate: false })
watch(() => props.size, generateQRCode)
watch(() => props.errorCorrectionLevel, generateQRCode)
watch(() => props.foregroundColor, generateQRCode)
watch(() => props.backgroundColor, generateQRCode)

// Lifecycle
onMounted(() => {
  generateQRCode()
})
</script>

<style scoped>
.qr-code-container {
  display: inline-block;
}

/* Animación para el loading */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>