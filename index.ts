import express from 'express'
import 'dotenv/config'
import compression from 'compression'
import { logger } from './utils'
import './redis-client'

// routes
import docs from './routes/docs.route'
import image from './routes/image.route'

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
