# 🇵🇪 AI-MYPE Perú - Asistente para Micro y Pequeñas Empresas

Una aplicación web moderna desarrollada con Vue.js que proporciona herramientas especializadas para micro y pequeñas empresas en Perú, incluyendo una calculadora de régimen tributario y un asistente de IA.

## ✨ Características

### 🧮 Calculadora de Régimen Tributario
- **Análisis automático**: Determina el régimen tributario más conveniente basándose en ingresos mensuales
- **Recomendaciones personalizadas**: Obtén sugerencias específicas para tu tipo de negocio
- **Cálculo de impuestos**: Estimaciones de impuestos mensuales según el régimen
- **Información detallada**: Beneficios, requisitos y limitaciones de cada régimen

### 🤖 Asistente de IA Especializado
- **Chat inteligente**: Asistente especializado en temas empresariales y tributarios para MYPE
- **Disponibilidad 24/7**: Respuestas inmediatas a tus consultas
- **Información actualizada**: Datos actualizados sobre normativas peruanas
- **Interfaz intuitiva**: Chat fácil de usar con historial de conversaciones

### 🎨 Diseño Moderno
- **UI/UX optimizada**: Diseño responsivo y moderno con Tailwind CSS
- **Navegación intuitiva**: Interfaz clara y fácil de usar
- **Accesibilidad**: Diseño accesible para todos los usuarios
- **Responsive**: Funciona perfectamente en dispositivos móviles y desktop

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Vue.js 3 con Composition API
- **Styling**: Tailwind CSS con plugins adicionales
- **Build Tool**: Vite
- **HTTP Client**: Axios para consumo de APIs
- **Linting**: ESLint + Prettier
- **Package Manager**: pnpm

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes Vue reutilizables
│   ├── AppHeader.vue    # Header con navegación
│   ├── AppFooter.vue    # Footer informativo
│   ├── TaxRegimeCalculator.vue  # Calculadora de régimen
│   ├── ChatAssistant.vue        # Chat con IA
│   └── InfoSection.vue          # Información general
├── composables/         # Lógica reutilizable
│   ├── useApi.js       # Manejo de estados de API
│   ├── useTaxRegime.js # Lógica de régimen tributario
│   └── useChat.js      # Lógica del chat
├── services/           # Servicios para APIs
│   ├── api.js         # Cliente HTTP base
│   ├── taxRegimeService.js  # Servicio de régimen tributario
│   └── chatService.js      # Servicio de chat
└── assets/            # Recursos estáticos
    └── main.css       # Estilos globales con Tailwind
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- pnpm (recomendado) o npm

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd frontend-asistente-mype
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   # o
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env.local
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   pnpm dev
   # o
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia servidor de desarrollo
pnpm build        # Construye para producción
pnpm preview      # Vista previa de la build
pnpm lint         # Ejecuta linting
pnpm format       # Formatea código con Prettier
```

## 📡 API Integration

La aplicación consume las siguientes APIs:

### Calculadora de Régimen Tributario
- `POST /api/tax-regime/calculate` - Calcula régimen recomendado
- `GET /api/tax-regime/regimes` - Obtiene todos los regímenes
- `GET /api/tax-regime/health` - Verifica estado del servicio

### Chat con IA
- `POST /api/chat/message` - Envía mensaje al asistente
- `GET /api/chat/assistant-info` - Información del asistente
- `GET /api/chat/health` - Verifica estado del servicio

## 🎯 Regímenes Tributarios Soportados

1. **Nuevo RUS** - Para pequeños negocios (hasta S/ 8,000 mensuales)
2. **Régimen Especial** - Para empresas medianas (hasta S/ 525,000 anuales)
3. **Régimen General** - Para empresas de cualquier tamaño

## 🌟 Características Técnicas

### Composables Vue
- **useApi**: Manejo centralizado de estados de API (loading, error)
- **useTaxRegime**: Lógica específica para cálculos tributarios
- **useChat**: Gestión del estado del chat y mensajes

### Servicios
- **Interceptores HTTP**: Manejo automático de errores y timeouts
- **Validación de datos**: Validación en frontend antes de envío
- **Manejo de errores**: Sistema robusto de manejo de errores

### UI/UX
- **Diseño responsivo**: Optimizado para móviles y desktop
- **Animaciones suaves**: Transiciones CSS para mejor experiencia
- **Estados de carga**: Indicadores visuales durante operaciones
- **Feedback visual**: Mensajes claros de éxito y error

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature')
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes preguntas o necesitas ayuda:

1. Revisa la documentación de la API en `API_DOCUMENTATION.md`
2. Verifica que el backend esté ejecutándose correctamente
3. Consulta los logs del navegador para errores específicos

## 🔮 Roadmap

- [ ] Autenticación de usuarios
- [ ] Dashboard personalizado
- [ ] Exportación de reportes
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Integración con SUNAT

---

**Desarrollado con ❤️ para emprendedores peruanos**

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
