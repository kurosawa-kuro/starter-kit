<template>
  <div class="min-w-fit">
    <!-- Sidebar backdrop (mobile only) -->
    <div class="fixed inset-0 bg-gray-900/30 z-40 lg:hidden lg:z-auto transition-opacity duration-200" :class="sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'" aria-hidden="true"></div>

    <!-- Sidebar -->
    <div
      id="sidebar"
      ref="sidebar"
      class="flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64! shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out border-r border-gray-200 dark:border-gray-700/60"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-64'"
    >

      <!-- Sidebar header -->
      <div class="flex justify-between mb-10 pr-3 sm:px-2">
        <!-- Close button -->
        <button
          ref="trigger"
          class="lg:hidden text-gray-500 hover:text-gray-400"
          @click.stop="$emit('close-sidebar')"
          aria-controls="sidebar"
          :aria-expanded="sidebarOpen"
        >
          <span class="sr-only">Close sidebar</span>
          <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
          </svg>
        </button>
        <!-- Logo -->
        <router-link class="block" to="/">
          <svg class="fill-violet-500" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
            <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
          </svg>
        </router-link>
      </div>

      <!-- Links -->
      <div class="space-y-8">
        <!-- Pages group -->
        <div>
          <h3 class="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
            <span class="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">•••</span>
            <span class="lg:hidden lg:sidebar-expanded:block 2xl:block">Pages</span>
          </h3>
          <ul class="mt-3">
            <!-- Home -->
            <li class="px-3 py-2 rounded-lg mb-0.5 last:mb-0" :class="currentRoute.fullPath === '/' && 'bg-violet-500'">
              <router-link class="block text-gray-800 dark:text-gray-100 truncate transition" :class="currentRoute.fullPath === '/' ? 'text-white' : 'hover:text-gray-900 dark:hover:text-white'" to="/">
                <div class="flex items-center">
                  <svg class="shrink-0 fill-current mr-3" :class="currentRoute.fullPath === '/' ? 'text-violet-200' : 'text-gray-400 dark:text-gray-500'" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M8.707 1.293a1 1 0 0 0-1.414 0L2 6.586V15a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6.586l-5.293-5.293Z" />
                  </svg>
                  <span class="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Home</span>
                </div>
              </router-link>
            </li>
            <!-- Hello World -->
            <li class="px-3 py-2 rounded-lg mb-0.5 last:mb-0" :class="currentRoute.fullPath === '/hello-world' && 'bg-violet-500'">
              <router-link class="block text-gray-800 dark:text-gray-100 truncate transition" :class="currentRoute.fullPath === '/hello-world' ? 'text-white' : 'hover:text-gray-900 dark:hover:text-white'" to="/hello-world">
                <div class="flex items-center">
                  <svg class="shrink-0 fill-current mr-3" :class="currentRoute.fullPath === '/hello-world' ? 'text-violet-200' : 'text-gray-400 dark:text-gray-500'" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8ZM8 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1Zm1-3H7V4h2v5Z" />
                  </svg>
                  <span class="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Hello World</span>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  sidebarOpen: Boolean,
  variant: String
})

const emit = defineEmits(['close-sidebar'])

const trigger = ref(null)
const sidebar = ref(null)
const sidebarExpanded = ref(localStorage.getItem('sidebar-expanded') == 'true')

const currentRoute = computed(() => useRoute())

const clickHandler = ({ target }) => {
  if (!sidebar.value || !trigger.value) return
  if (!sidebarOpen.value || sidebar.value.contains(target) || trigger.value.contains(target)) return
  emit('close-sidebar')
}

const keyHandler = ({ keyCode }) => {
  if (!sidebarOpen.value || keyCode !== 27) return
  emit('close-sidebar')
}

onMounted(() => {
  document.addEventListener('click', clickHandler)
  document.addEventListener('keydown', keyHandler)
})

onUnmounted(() => {
  document.removeEventListener('click', clickHandler)
  document.removeEventListener('keydown', keyHandler)
})

const handleSidebarToggle = () => {
  sidebarExpanded.value = !sidebarExpanded.value
  localStorage.setItem('sidebar-expanded', sidebarExpanded.value)
  if (sidebarExpanded.value) {
    document.querySelector('body').classList.add('sidebar-expanded')
  } else {
    document.querySelector('body').classList.remove('sidebar-expanded')
  }
}

onMounted(() => {
  if (sidebarExpanded.value) {
    document.querySelector('body').classList.add('sidebar-expanded')
  } else {
    document.querySelector('body').classList.remove('sidebar-expanded')
  }
})
</script>