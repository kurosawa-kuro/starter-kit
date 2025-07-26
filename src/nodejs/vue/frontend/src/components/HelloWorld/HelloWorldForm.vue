<template>
  <div class="max-w-md mx-auto">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          required
          :disabled="loading"
          class="form-input"
          placeholder="Enter your name"
        />
      </div>
      
      <ErrorMessage v-if="error" :message="error" />

      <button
        type="submit"
        :disabled="loading"
        class="btn w-full justify-center"
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
      <h3 class="text-lg font-medium text-gray-900 mb-4">Messages</h3>
      <div class="space-y-4">
        <div
          v-for="message in sortedMessages"
          :key="message.id"
          class="card p-4"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-900">{{ message.name }}</p>
              <p class="mt-1 text-sm text-gray-600">{{ message.message }}</p>
              <p class="mt-2 text-xs text-gray-500">
                {{ new Date(message.created_at).toLocaleString() }}
              </p>
            </div>
            <button
              @click="handleDelete(message.id)"
              class="ml-4 text-red-600 hover:text-red-900"
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
import ErrorMessage from '@/components/common/ErrorMessage.vue'

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