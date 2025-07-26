import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { helloWorldService } from '@/services/helloWorld'

export const useHelloWorldStore = defineStore('helloWorld', () => {
  // State
  const messages = ref([])
  const currentMessage = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const messageCount = computed(() => messages.value.length)
  const hasMessages = computed(() => messages.value.length > 0)
  const sortedMessages = computed(() => 
    [...messages.value].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  )

  // エラーメッセージの取得
  const getErrorMessage = (err) => {
    if (err?.message) {
      return err.message
    }
    if (typeof err === 'string') {
      return err
    }
    return 'An unexpected error occurred'
  }

  // Actions
  const fetchMessages = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await helloWorldService.getAll()
      if (response.status === 'success' && response.data) {
        messages.value = response.data
      } else {
        throw new Error(response.message || 'Failed to fetch messages')
      }
    } catch (err) {
      console.error('Fetch messages error:', err)
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchMessage = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await helloWorldService.getById(id)
      if (response.status === 'success' && response.data) {
        currentMessage.value = response.data
      } else {
        throw new Error(response.message || 'Failed to fetch message')
      }
    } catch (err) {
      console.error('Fetch message error:', err)
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createMessage = async (name) => {
    loading.value = true
    error.value = null
    try {
      const response = await helloWorldService.create({ name })
      if (response.status === 'success' && response.data) {
        messages.value.push(response.data)
        return response.data
      } else {
        throw new Error(response.message || 'Failed to create message')
      }
    } catch (err) {
      console.error('Create message error:', err)
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteMessage = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await helloWorldService.delete(id)
      if (response.status === 'success') {
        messages.value = messages.value.filter(msg => msg.id !== id)
      } else {
        throw new Error(response.message || 'Failed to delete message')
      }
    } catch (err) {
      console.error('Delete message error:', err)
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    messages: computed(() => messages.value),
    currentMessage: computed(() => currentMessage.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    
    // Getters
    messageCount,
    hasMessages,
    sortedMessages,
    
    // Actions
    fetchMessages,
    fetchMessage,
    createMessage,
    deleteMessage,
    clearError,
  }
}) 