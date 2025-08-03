# Vue 3 + Vite スタータープロジェクト作成仕様書

## 概要
このドキュメントは、Vue 3 + Vite スタータープロジェクトの作成仕様です。フロントエンドアプリケーションとして、バックエンドAPIと連携可能な構成になっています。

## 🎯 プロジェクト要件

### 基本要件
- **フレームワーク**: Vue 3 (Composition API)
- **ビルドツール**: Vite 5+
- **言語**: TypeScript
- **状態管理**: Pinia ✅
- **ルーティング**: Vue Router 4
- **HTTPクライアント**: Axios ✅
- **テスト**: Vitest + Testing Library
- **CSSフレームワーク**: Tailwind CSS ✅

### 機能要件
1. **SPA構造**: シングルページアプリケーション
2. **API連携**: バックエンドとの通信（Axios使用）
3. **状態管理**: グローバル状態の管理（Pinia使用）
4. **エラーハンドリング**: 統一されたエラー表示
5. **環境設定**: 環境別の設定管理
6. **型安全性**: TypeScriptによる型定義

## 📁 プロジェクト構造仕様

### ディレクトリ構造
```
src/
├── assets/           # 静的アセット
│   └── styles/       # グローバルスタイル
│       └── main.css  # Tailwind ディレクティブ
├── components/       # Vueコンポーネント
│   ├── common/       # 共通コンポーネント
│   │   ├── ErrorMessage.vue
│   │   └── LoadingSpinner.vue
│   └── HelloWorld/   # 機能別コンポーネント
│       └── HelloWorldForm.vue
├── composables/      # Composition API関数
│   ├── useApi.ts     # API通信（Axios wrapper）
│   └── useError.ts   # エラーハンドリング
├── layouts/          # レイアウトコンポーネント
│   └── DefaultLayout.vue
├── pages/            # ページコンポーネント
│   ├── HomePage.vue
│   ├── HelloWorldPage.vue
│   └── NotFoundPage.vue
├── router/           # ルーティング設定
│   └── index.ts
├── services/         # APIサービス層
│   ├── api.ts        # Axiosインスタンス設定
│   └── helloWorld.ts # Hello World API
├── stores/           # Pinia ストア
│   ├── app.ts        # アプリケーション状態
│   └── helloWorld.ts # Hello World状態
├── types/            # TypeScript型定義
│   ├── api.ts        # APIレスポンス型
│   └── models.ts     # データモデル型
├── utils/            # ユーティリティ
│   ├── constants.ts  # 定数定義
│   └── config.ts     # 設定管理
├── App.vue           # ルートコンポーネント
├── main.ts           # エントリーポイント
└── env.d.ts          # 環境変数型定義

tailwind.config.js    # Tailwind設定
postcss.config.js     # PostCSS設定
```

## 🏗️ アーキテクチャ仕様

### レイヤー構造
1. **View層**: ページ・コンポーネント
2. **Store層**: 状態管理（Pinia）
3. **Service層**: API通信ロジック（Axios）
4. **Composable層**: 再利用可能なロジック
5. **Utils層**: 共通ユーティリティ

### データフロー
```
Component → Store → Service → Axios → API
    ↓         ↓        ↓
  Pinia    Composable  Error Handler
```

## 📋 実装仕様

### 1. 設定管理仕様

#### 環境変数定義 (.env)
```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=Vue Starter App
VITE_API_TIMEOUT=30000
```

#### Axios設定 (services/api.ts)
```typescript
import axios, { AxiosInstance, AxiosError } from 'axios'
import { config } from '@/utils/config'

// Axiosインスタンスの作成
export const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// リクエストインターセプター
apiClient.interceptors.request.use(
  (config) => {
    // 認証トークンの追加など
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// レスポンスインターセプター
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 認証エラー処理
      // router.push('/login')
    }
    return Promise.reject(error)
  }
)
```

### 2. API通信仕様

#### APIレスポンス型定義
```typescript
// types/api.ts
export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  message: string
  timestamp: string
  data?: T
  error?: string
}

export interface HelloWorldData {
  id: number
  name: string
  message: string
  created_at: string
  updated_at: string
}

export interface CreateHelloWorldRequest {
  name: string
}
```

#### API サービス実装
```typescript
// services/helloWorld.ts
import { apiClient } from './api'
import type { ApiResponse, HelloWorldData, CreateHelloWorldRequest } from '@/types/api'

export const helloWorldService = {
  // 全件取得
  async getAll(): Promise<ApiResponse<HelloWorldData[]>> {
    const { data } = await apiClient.get<ApiResponse<HelloWorldData[]>>('/hello-world')
    return data
  },

  // 単一取得
  async getById(id: number): Promise<ApiResponse<HelloWorldData>> {
    const { data } = await apiClient.get<ApiResponse<HelloWorldData>>(`/hello-world/${id}`)
    return data
  },

  // 作成
  async create(request: CreateHelloWorldRequest): Promise<ApiResponse<HelloWorldData>> {
    const { data } = await apiClient.post<ApiResponse<HelloWorldData>>('/hello-world', request)
    return data
  },

  // 更新
  async update(id: number, request: Partial<CreateHelloWorldRequest>): Promise<ApiResponse<HelloWorldData>> {
    const { data } = await apiClient.put<ApiResponse<HelloWorldData>>(`/hello-world/${id}`, request)
    return data
  },

  // 削除
  async delete(id: number): Promise<ApiResponse<void>> {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/hello-world/${id}`)
    return data
  },
}
```

### 3. Pinia状態管理仕様

#### Hello World ストア
```typescript
// stores/helloWorld.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { helloWorldService } from '@/services/helloWorld'
import type { HelloWorldData } from '@/types/api'

export const useHelloWorldStore = defineStore('helloWorld', () => {
  // State
  const messages = ref<HelloWorldData[]>([])
  const currentMessage = ref<HelloWorldData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const messageCount = computed(() => messages.value.length)
  const hasMessages = computed(() => messages.value.length > 0)
  const sortedMessages = computed(() => 
    [...messages.value].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  )

  // Actions
  const fetchMessages = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await helloWorldService.getAll()
      if (response.status === 'success' && response.data) {
        messages.value = response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch messages'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchMessage = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await helloWorldService.getById(id)
      if (response.status === 'success' && response.data) {
        currentMessage.value = response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch message'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createMessage = async (name: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await helloWorldService.create({ name })
      if (response.status === 'success' && response.data) {
        messages.value.push(response.data)
        return response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create message'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteMessage = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await helloWorldService.delete(id)
      messages.value = messages.value.filter(msg => msg.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete message'
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
```

### 4. Tailwind CSS設定

#### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}
```

#### main.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn {
    @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200;
  }

  .btn-secondary {
    @apply bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500;
  }

  .form-input {
    @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm;
  }

  .card {
    @apply bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200;
  }
}
```

### 5. コンポーネント実装

#### Hello World フォームコンポーネント（Tailwind使用）
```vue
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
      
      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>

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

<script setup lang="ts">
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

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this message?')) {
    try {
      await store.deleteMessage(id)
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }
}
</script>
```

### 6. API Composable（Axios使用）

```typescript
// composables/useApi.ts
import { ref, Ref } from 'vue'
import { AxiosError } from 'axios'

interface UseApiOptions {
  immediate?: boolean
}

export function useApi<T>() {
  const data: Ref<T | null> = ref(null)
  const error: Ref<Error | null> = ref(null)
  const loading = ref(false)

  const execute = async (
    apiCall: () => Promise<{ data: any }>,
    options: UseApiOptions = {}
  ) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiCall()
      data.value = response.data
      return response
    } catch (e) {
      const axiosError = e as AxiosError
      error.value = new Error(
        axiosError.response?.data?.message || 
        axiosError.message || 
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
```

## 🔧 開発環境仕様

### 必要なツール
- **Node.js**: 18.0+
- **npm**: 9.0+
- **Vue DevTools**: ブラウザ拡張

### 依存関係
```json
{
  "dependencies": {
    "vue": "^3.5.13",
    "vue-router": "^4.5.0",
    "pinia": "^2.3.0",
    "axios": "^1.7.9"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "@vue/test-utils": "^2.4.6",
    "@testing-library/vue": "^8.1.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.6.0",
    "vite": "^6.0.1",
    "vitest": "^2.1.8",
    "vue-tsc": "^2.2.0"
  }
}
```

### Vite設定
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
```

## 🚀 プロジェクト作成手順

```bash
# Vue プロジェクト作成
npm create vue@latest my-vue-app

# 以下を選択:
# ✔ Add TypeScript? … Yes
# ✔ Add JSX Support? … No
# ✔ Add Vue Router? … Yes
# ✔ Add Pinia? … Yes
# ✔ Add Vitest? … Yes
# ✔ Add an End-to-End Testing Solution? … No
# ✔ Add ESLint? … Yes
# ✔ Add Prettier? … Yes

cd my-vue-app

# Axios と Tailwind CSS のインストール
npm install axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Tailwind の設定を更新（上記の設定を適用）
# src/assets/styles/main.css に Tailwind ディレクティブを追加
# main.ts で main.css をインポート

npm run dev
```

これで、Axios、Pinia、Tailwind CSSを最初から含んだVue 3スタータープロジェクトが完成します。