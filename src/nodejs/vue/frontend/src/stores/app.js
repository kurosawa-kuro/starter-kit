import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const isLoading = ref(false)
  const error = ref(null)
  const user = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const hasError = computed(() => !!error.value)

  // Actions
  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const setError = (err) => {
    error.value = err
  }

  const clearError = () => {
    error.value = null
  }

  const setUser = (userData) => {
    user.value = userData
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('auth_token')
  }

  return {
    // State
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    user: computed(() => user.value),
    
    // Getters
    isAuthenticated,
    hasError,
    
    // Actions
    setLoading,
    setError,
    clearError,
    setUser,
    logout,
  }
}) 