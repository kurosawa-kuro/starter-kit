<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <!-- Welcome Section -->
    <div class="mb-8">
      <div class="bg-gradient-to-r from-violet-600 to-violet-500 rounded-xl p-8 shadow-lg">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-white mb-4">
            Welcome to Vue Admin Dashboard
          </h1>
          <p class="text-xl text-violet-100 mb-6">
            A modern Vue 3 application with enterprise-grade components and beautiful design
          </p>
          <router-link
            to="/hello-world"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-violet-600 bg-white hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-violet-600 transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
            Explore Hello World
          </router-link>
        </div>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Feature Card 1 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-center w-12 h-12 bg-violet-100 dark:bg-violet-900/20 rounded-lg mb-4">
          <svg class="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Lightning Fast</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Built with Vite for instant hot module replacement and optimized build performance.
        </p>
      </div>

      <!-- Feature Card 2 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg mb-4">
          <svg class="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">State Management</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Powered by Pinia for intuitive and type-safe state management across your application.
        </p>
      </div>

      <!-- Feature Card 3 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-4">
          <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Modern Design</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Crafted with Tailwind CSS and professional UI components for beautiful interfaces.
        </p>
      </div>

      <!-- Feature Card 4 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-lg mb-4">
          <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Dark Mode</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Complete dark mode support with smooth transitions and consistent theming.
        </p>
      </div>

      <!-- Feature Card 5 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-center w-12 h-12 bg-rose-100 dark:bg-rose-900/20 rounded-lg mb-4">
          <svg class="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Responsive</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Fully responsive design that works perfectly on desktop, tablet, and mobile devices.
        </p>
      </div>

      <!-- Feature Card 6 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg mb-4">
          <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Type Safe</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Built with TypeScript support and comprehensive testing for reliable applications.
        </p>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
        <div>
          <div class="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-1">100+</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Components</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">50+</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Page Templates</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">15+</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Demo Apps</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-rose-600 dark:text-rose-400 mb-1">24/7</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Support</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// コンポーネントロジック
</script> 