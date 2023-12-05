import express from 'express'
import 'dotenv/config'
import compression from 'compression'
import { logger } from './utils/index'

// routes
import docs from './routes/docs.route'
import image from './routes/image.route'

const app = express()

app.use(compression())

app.use(image)
app.use('/docs', docs)

app.all('*', (req, res) => {
  res.status(404).send({ message: '404 not found' })
})

app.listen(process.env.PORT, () => {
  logger.info('pgw server started')
})
