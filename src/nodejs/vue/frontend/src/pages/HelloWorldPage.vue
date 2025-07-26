<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Hello World API
        </h1>
        <p class="text-lg text-gray-600">
          Test the API integration with the Hello World service
        </p>
      </div>

      <HelloWorldForm />
    </div>
  </div>
</template>

<script setup>
import HelloWorldForm from '@/components/HelloWorld/HelloWorldForm.vue'
</script> 