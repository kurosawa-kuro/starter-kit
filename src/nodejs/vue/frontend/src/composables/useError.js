import { ref, computed } from 'vue'

export function useError() {
  const error = ref(null)

  const setError = (err) => {
    error.value = err instanceof Error ? err.message : String(err)
  }

  const clearError = () => {
    error.value = null
  }

  const handleError = (err) => {
    console.error('Error occurred:', err)
    setError(err)
  }

  return {
    error: computed(() => error.value),
    setError,
    clearError,
    handleError,
  }
} 