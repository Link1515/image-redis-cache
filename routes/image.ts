import { Router } from 'express'
import imageController from '../controllers/imageController'
// import checkImageQuery from '../middleware/checkImageQuery'

const router = Router()

router.get('/', imageController)

export default router
