import { createClient } from 'redis'
import { logger } from './utils/index'

export const client = createClient({
  url: process.env.REDIS_CLIENT_URL,
  password: process.env.REDIS_PASSWORD
})

client.on('error', err => {
  logger.error('Redis Client Error', err)
  process.exit(1)
})

await client.connect()
