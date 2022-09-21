import express from 'express'
import dotenv from 'dotenv'

// routes
import image from './routes/image'

// set env
const currentEnv = process.env.NODE_ENV?.trim() ?? 'development'
dotenv.config({ path: `./.env.${currentEnv}` })

const app = express()

app.use('/image', image)

app.all('*', (req, res) => {
  res.status(404).send({ message: '404 not found' })
})

app.listen(process.env.PORT, () => {
  console.log(
    `server running at: http://localhost:${process.env.PORT as string}`
  )
})
