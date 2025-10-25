/**
 * Utilidades para manejo del estado del usuario
 */

/**
 * Refresca completamente el estado del usuario desde el servidor y localStorage
 * @returns {Promise<boolean>} True si la actualización fue exitosa
 */
export const refreshUserState = async () => {
  console.log('🔄 [userUtils] Iniciando actualización completa del estado del usuario...')
  
  try {
    // Importar dinámicamente para evitar dependencias circulares
    const { useGlobalAuth } = await import('../composables/useAuth.js')
    const { refreshProfile, refreshQueryLimits } = useGlobalAuth()
    
    // 1. Actualizar perfil desde el servidor
    console.log('📡 [userUtils] Actualizando perfil desde el servidor...')
    await refreshProfile()
    
    // 2. Actualizar límites de consultas
    console.log('📊 [userUtils] Actualizando límites de consultas...')
    await refreshQueryLimits()
    
    // 3. Verificar estado en localStorage
    const userData = localStorage.getItem('user_data')
    if (userData) {
      const user = JSON.parse(userData)
      console.log('✅ [userUtils] Estado actual del usuario:', {
        isPremium: user.isPremium,
        hasPremiumAccess: user.hasPremiumAccess,
        userId: user.id || user._id,
        email: user.email
      })
    }
    
    // 4. Emitir evento de actualización
    window.dispatchEvent(new CustomEvent('user:state-refreshed'))
    
    console.log('🎉 [userUtils] Estado del usuario actualizado exitosamente')
    return true
    
  } catch (error) {
    console.error('❌ [userUtils] Error actualizando estado del usuario:', error)
    return false
  }
}

/**
 * Fuerza la actualización del estado premium en localStorage
 * @param {boolean} isPremium - Estado premium a establecer
 * @returns {boolean} True si la actualización fue exitosa
 */
export const forceUpdatePremiumStatus = (isPremium = true) => {
  console.log(`🔧 [userUtils] Forzando actualización de estado premium a: ${isPremium}`)
  
  try {
    const userData = localStorage.getItem('user_data')
    if (!userData) {
      console.warn('⚠️ [userUtils] No se encontraron datos de usuario en localStorage')
      return false
    }
    
    const user = JSON.parse(userData)
    const oldStatus = {
      isPremium: user.isPremium,
      hasPremiumAccess: user.hasPremiumAccess
    }
    
    // Actualizar estado premium
    user.isPremium = isPremium
    user.hasPremiumAccess = isPremium
    
    // Guardar en localStorage
    localStorage.setItem('user_data', JSON.stringify(user))
    
    console.log('✅ [userUtils] Estado premium actualizado:', {
      antes: oldStatus,
      después: {
        isPremium: user.isPremium,
        hasPremiumAccess: user.hasPremiumAccess
      }
    })
    
    // Emitir evento de cambio
    window.dispatchEvent(new CustomEvent('user:premium-status-changed', {
      detail: { isPremium, hasPremiumAccess: isPremium }
    }))
    
    return true
    
  } catch (error) {
    console.error('❌ [userUtils] Error forzando actualización de estado premium:', error)
    return false
  }
}

/**
 * Diagnóstica el estado actual del usuario para depuración
 * @returns {Object} Información de diagnóstico
 */
export const diagnoseUserState = () => {
  console.log('🔍 [userUtils] Iniciando diagnóstico del estado del usuario...')
  
  const diagnosis = {
    timestamp: new Date().toISOString(),
    localStorage: {},
    trialService: {},
    authService: {}
  }
  
  try {
    // Verificar localStorage
    const authToken = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    const trialAttempts = localStorage.getItem('chat_trial_attempts')
    
    diagnosis.localStorage = {
      hasAuthToken: !!authToken,
      authTokenLength: authToken ? authToken.length : 0,
      hasUserData: !!userData,
      userData: userData ? JSON.parse(userData) : null,
      trialAttempts: trialAttempts ? JSON.parse(trialAttempts) : null
    }
    
    // Verificar trialService (importación dinámica para evitar problemas)
    if (typeof window !== 'undefined' && window.trialService) {
      diagnosis.trialService = {
        canUseChat: window.trialService.canUseChat(),
        trialStatus: window.trialService.getTrialStatus(),
        isAuthenticated: window.trialService.isUserAuthenticated(),
        hasPremiumAccess: window.trialService.hasPremiumAccess()
      }
    }
    
    console.log('📋 [userUtils] Diagnóstico completo:', diagnosis)
    return diagnosis
    
  } catch (error) {
    console.error('❌ [userUtils] Error en diagnóstico:', error)
    diagnosis.error = error.message
    return diagnosis
  }
}

/**
 * Limpia completamente el estado del usuario (útil para debugging)
 */
export const clearUserState = () => {
  console.log('🧹 [userUtils] Limpiando estado del usuario...')
  
  try {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('chat_trial_attempts')
    
    // Emitir evento de limpieza
    window.dispatchEvent(new CustomEvent('user:state-cleared'))
    
    console.log('✅ [userUtils] Estado del usuario limpiado')
    return true
    
  } catch (error) {
    console.error('❌ [userUtils] Error limpiando estado del usuario:', error)
    return false
  }
}