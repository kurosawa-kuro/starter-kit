import { ref, computed } from 'vue'

export function useApi() {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  const execute = async (apiCall, options = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiCall()
      data.value = response.data
      return response
    } catch (e) {
      error.value = new Error(
        e.response?.data?.message || 
        e.message || 
        'An unexpected error occurred'
      )
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    data: computed(() => data.value),
    error: computed(() => error.value),
    loading: computed(() => loading.value),
    execute,
  }
} 