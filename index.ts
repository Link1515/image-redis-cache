import express from 'express'
import image from './routes/image'

const app = express()

app.use('/image', image)

app.listen(3000, () => {
  console.log('server running')
})
