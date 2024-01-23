import { createClient } from 'redis'
import { logger } from './utils/index'

export const client = createClient({
  url: process.env.REDIS_CLIENT_URL,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD
})

client.on('error', err => {
  logger.error('Redis Client Error', err)
  process.exit(1)
})

const clientConnect = async () => {
  await client.connect()
}

clientConnect()
