import { createClient } from 'redis'

export const client = createClient({
  url: process.env.REDIS_CLIENT_URL
})

client.on('error', err => console.log('Redis Client Error', err))

await client.connect()
