import express from 'express'
import dotenv from 'dotenv'
import compression from 'compression'
import { logger } from './utils'

// routes
import docs from './routes/docs.route'
import image from './routes/image.route'

// set env
const currentEnv = process.env.NODE_ENV?.trim() ?? 'development'
dotenv.config({ path: `./.env.${currentEnv}` })

const app = express()

app.use(compression())

app.use('/image', image)
app.use('/docs', docs)

app.all('*', (req, res) => {
  res.status(404).send({ message: '404 not found' })
})

app.listen(process.env.PORT, () => {
  logger.info(
    `server running at: http://localhost:${process.env.PORT as string}`
  )
})
