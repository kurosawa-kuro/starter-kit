<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-8">
          Welcome to Vue Starter App
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          A modern Vue 3 application with Vite, Pinia, and Tailwind CSS
        </p>
        
        <div class="space-y-4">
          <router-link
            to="/hello-world"
            class="btn inline-block"
          >
            Go to Hello World
          </router-link>
        </div>

        <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="card p-6">
            <div class="text-primary-600 mb-4">
              <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Fast Development</h3>
            <p class="text-gray-600">Built with Vite for lightning-fast development and hot module replacement.</p>
          </div>

          <div class="card p-6">
            <div class="text-primary-600 mb-4">
              <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">State Management</h3>
            <p class="text-gray-600">Powered by Pinia for simple and intuitive state management.</p>
          </div>

          <div class="card p-6">
            <div class="text-primary-600 mb-4">
              <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Modern UI</h3>
            <p class="text-gray-600">Styled with Tailwind CSS for beautiful, responsive design.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// コンポーネントロジック
</script> 