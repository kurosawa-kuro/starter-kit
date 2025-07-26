<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
    
    <!-- Page header -->
    <div class="sm:flex sm:justify-between sm:items-center mb-8">
      <!-- Left: Title -->
      <div class="mb-4 sm:mb-0">
        <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Hello World API</h1>
        <p class="text-gray-600 dark:text-gray-400">Test the API integration with the Hello World service</p>
      </div>
    </div>

    <!-- Main content -->
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div class="p-6">
        <HelloWorldForm />
      </div>
    </div>

  </div>
</template>

<script setup>
import HelloWorldForm from '@/components/HelloWorld/HelloWorldForm.vue'
</script> 