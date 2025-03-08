import { Hono } from 'hono'
import { errorHandler, logger } from './middleware/error.js'
import { UserController } from './controllers/user.controller.js'

// アプリケーションインスタンスの作成
const app = new Hono()

// ミドルウェアの適用
app.use('*', logger)
app.onError(errorHandler)

// ベースルート
app.get('/health', (c) => c.text('OK'))

// コントローラーのマウント
const userController = new UserController()
app.route('/users', userController.router)

export default app 