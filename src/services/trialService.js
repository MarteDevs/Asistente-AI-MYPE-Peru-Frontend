/**
 * Servicio para manejar los intentos gratuitos del chat
 * Utiliza localStorage para persistir el conteo de intentos
 */

const TRIAL_STORAGE_KEY = 'chat_trial_attempts'
const MAX_FREE_ATTEMPTS = 5

const trialService = {
  /**
   * Obtiene el número de intentos utilizados
   * @returns {number} Número de intentos utilizados
   */
  getUsedAttempts() {
    try {
      const stored = localStorage.getItem(TRIAL_STORAGE_KEY)
      if (!stored) return 0
      
      const data = JSON.parse(stored)
      
      // Verificar si los datos son del día actual
      const today = new Date().toDateString()
      if (data.date !== today) {
        // Si es un día diferente, resetear el contador
        this.resetAttempts()
        return 0
      }
      
      return data.attempts || 0
    } catch (error) {
      console.error('Error obteniendo intentos utilizados:', error)
      return 0
    }
  },

  /**
   * Obtiene el número de intentos restantes
   * @returns {number} Número de intentos restantes
   */
  getRemainingAttempts() {
    const used = this.getUsedAttempts()
    return Math.max(0, MAX_FREE_ATTEMPTS - used)
  },

  /**
   * Verifica si el usuario puede hacer más intentos
   * @returns {boolean} True si puede hacer más intentos
   */
  canMakeAttempt() {
    return this.getRemainingAttempts() > 0
  },

  /**
   * Incrementa el contador de intentos utilizados
   * @returns {boolean} True si se pudo incrementar, false si se alcanzó el límite
   */
  incrementAttempts() {
    try {
      const currentAttempts = this.getUsedAttempts()
      
      if (currentAttempts >= MAX_FREE_ATTEMPTS) {
        return false
      }
      
      const newAttempts = currentAttempts + 1
      const today = new Date().toDateString()
      
      const data = {
        attempts: newAttempts,
        date: today,
        lastAttempt: new Date().toISOString()
      }
      
      localStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Error incrementando intentos:', error)
      return false
    }
  },

  /**
   * Resetea el contador de intentos
   */
  resetAttempts() {
    try {
      localStorage.removeItem(TRIAL_STORAGE_KEY)
    } catch (error) {
      console.error('Error reseteando intentos:', error)
    }
  },

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} True si está autenticado
   */
  isUserAuthenticated() {
    const token = localStorage.getItem('auth_token')
    return !!token
  },

  /**
   * Verifica si el usuario tiene acceso premium
   * @returns {boolean} True si tiene acceso premium
   */
  hasPremiumAccess() {
    try {
      const userStr = localStorage.getItem('user_data')
      if (!userStr) return false
      
      const user = JSON.parse(userStr)
      return user.hasPremiumAccess === true || user.isPremium === true
    } catch (error) {
      console.error('Error verificando acceso premium:', error)
      return false
    }
  },

  /**
   * Verifica si el usuario puede usar el chat
   * @returns {Object} Resultado de la verificación
   */
  canUseChat() {
    // Si está autenticado y tiene acceso premium, puede usar sin límites
    if (this.isUserAuthenticated() && this.hasPremiumAccess()) {
      return {
        canUse: true,
        reason: 'premium',
        remainingAttempts: -1, // -1 indica ilimitado
        message: 'Acceso premium activo'
      }
    }

    // Si está autenticado pero no tiene premium, verificar intentos gratuitos
    if (this.isUserAuthenticated()) {
      const remaining = this.getRemainingAttempts()
      if (remaining > 0) {
        return {
          canUse: true,
          reason: 'authenticated_trial',
          remainingAttempts: remaining,
          message: `Te quedan ${remaining} consultas gratuitas`
        }
      }

      // Usuario autenticado sin premium y sin consultas restantes
      return {
        canUse: false,
        reason: 'authenticated_limit_reached',
        remainingAttempts: 0,
        message: 'Has alcanzado el límite de consultas gratuitas. Obtén acceso premium para continuar.'
      }
    }

    // Si no está autenticado, verificar intentos gratuitos
    const remaining = this.getRemainingAttempts()
    if (remaining > 0) {
      return {
        canUse: true,
        reason: 'trial',
        remainingAttempts: remaining,
        message: `Te quedan ${remaining} consultas gratuitas`
      }
    }

    // No puede usar el chat
    return {
      canUse: false,
      reason: 'limit_reached',
      remainingAttempts: 0,
      message: 'Has alcanzado el límite de consultas gratuitas. Regístrate para continuar.'
    }
  },

  /**
   * Obtiene información del estado actual del trial
   * @returns {Object} Información del estado
   */
  getTrialStatus() {
    const used = this.getUsedAttempts()
    const remaining = this.getRemainingAttempts()
    const isAuthenticated = this.isUserAuthenticated()
    const hasPremium = this.hasPremiumAccess()

    return {
      maxAttempts: MAX_FREE_ATTEMPTS,
      usedAttempts: used,
      remainingAttempts: remaining,
      isAuthenticated,
      hasPremiumAccess: hasPremium,
      canUseChat: this.canUseChat()
    }
  }
}

export default trialService