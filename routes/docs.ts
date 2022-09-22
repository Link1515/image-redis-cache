import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

const router = Router()

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PGW',
      version: '1.0.0'
    }
  },
  apis: ['./routes/*.ts']
}

const swaggerSpec = swaggerJsdoc(options)

router.use('/', swaggerUi.serve)
router.get('/', swaggerUi.setup(swaggerSpec))

export default router
