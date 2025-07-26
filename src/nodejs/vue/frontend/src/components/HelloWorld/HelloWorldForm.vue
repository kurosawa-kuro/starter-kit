<template>
  <div class="max-w-2xl mx-auto">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Name
        </label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          required
          :disabled="loading"
          class="form-input w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Enter your name"
        />
      </div>
      
      <div v-if="error" class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <div class="flex">
          <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <div class="ml-3">
            <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <span v-if="loading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Sending...
        </span>
        <span v-else>Send Message</span>
      </button>
    </form>

    <!-- Messages List -->
    <div v-if="hasMessages" class="mt-8">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Messages</h3>
      <div class="space-y-4">
        <div
          v-for="message in sortedMessages"
          :key="message.id"
          class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ message.name }}</p>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">{{ message.message }}</p>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {{ new Date(message.created_at).toLocaleString() }}
              </p>
            </div>
            <button
              @click="handleDelete(message.id)"
              class="ml-4 p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useHelloWorldStore } from '@/stores/helloWorld'

const store = useHelloWorldStore()
const { loading, error, hasMessages, sortedMessages } = storeToRefs(store)

const formData = reactive({
  name: '',
})

onMounted(async () => {
  await store.fetchMessages()
})

const handleSubmit = async () => {
  try {
    await store.createMessage(formData.name)
    formData.name = ''
  } catch (error) {
    console.error('Failed to create message:', error)
  }
}

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this message?')) {
    try {
      await store.deleteMessage(id)
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }
}
</script> 