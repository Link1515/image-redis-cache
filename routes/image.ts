import { Router } from 'express'
import imageController from '../controllers/imageController'
import checkImageQuery from '../middleware/checkImageQuery'

const router = Router()

router.get('/', checkImageQuery, imageController)

export default router
