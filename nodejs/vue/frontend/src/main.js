import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/styles/main.css'
import { config } from './utils/config'

// MSW初期化関数
async function initializeMSW() {
  const { msw, development } = config
  
  if (!msw.enabled || !development.enableLogging) {
    console.log('ℹ️ MSW is disabled - using real API')
    return
  }
  
  console.log('🔧 Starting MSW setup...')
  
  try {
    const { worker } = await import('./mocks/browser')
    
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
      quiet: !msw.debug,
      waitUntilReady: true,
      bypass: false,
    })
    
    console.log('✅ MSW worker started successfully')
    console.log('🔧 Mock handlers are active for /api/* endpoints')
    
    // ワーカーが準備完了するまで待機
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // ヘルスチェックでMSWの動作確認
    await testMSWConnection()
    
  } catch (error) {
    console.warn('⚠️ Failed to start MSW worker:', error)
  }
}

// MSW接続テスト
async function testMSWConnection() {
  try {
    const response = await fetch('/api/health')
    console.log('🧪 MSW test request result:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('🧪 MSW health check response:', data)
    }
  } catch (error) {
    console.log('🧪 MSW test request failed (expected if no real server):', error.message)
  }
}

// アプリケーション初期化
async function initializeApp() {
  try {
    // MSWの初期化
    await initializeMSW()
    
    // Vueアプリケーションの作成
    const app = createApp(App)
    
    // プラグインの登録
    app.use(createPinia())
    app.use(router)
    
    // グローバルエラーハンドラー
    app.config.errorHandler = (error, instance, info) => {
      console.error('Vue Error:', error)
      console.error('Component:', instance)
      console.error('Info:', info)
    }
    
    // アプリケーションのマウント
    app.mount('#app')
    
    console.log('✅ Application initialized successfully')
    
  } catch (error) {
    console.error('❌ Failed to initialize application:', error)
    throw error
  }
}

// アプリケーションの起動
initializeApp().catch(error => {
  console.error('❌ Application startup failed:', error)
  // エラー表示用のDOM要素にエラーメッセージを表示
  const errorElement = document.getElementById('app-error')
  if (errorElement) {
    errorElement.textContent = 'Application failed to start. Please refresh the page.'
    errorElement.style.display = 'block'
  }
})
