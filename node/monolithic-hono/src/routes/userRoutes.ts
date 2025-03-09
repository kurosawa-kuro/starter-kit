import { Hono } from 'hono'
import { UserController } from '../controllers/userController.js'

const router = new Hono()

router.get('/', UserController.index)
router.post('/users', UserController.create)

export default router 