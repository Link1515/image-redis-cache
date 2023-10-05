import sharp from 'sharp'
import { commandOptions } from 'redis'
import { client as redisClient } from '../redis-client'
import type { Ext, ImageResizeProperty } from '../types'

export const getImageBufferFromCache = async (
  key: string
): Promise<Buffer | null> => {
  const cachedBuffer = await redisClient.get(
    commandOptions({ returnBuffers: true }),
    key
  )

  return cachedBuffer
}

export const setImageBufferToCache = async (
  key: string,
  buffer: Buffer
): Promise<void> => {
  const IMAGE_CACHE_MINUTE = process.env.IMAGE_CACHE_MINUTE
  let expiredTime = 60 * 60 * 24 // default cache one day

  if (IMAGE_CACHE_MINUTE !== undefined && IMAGE_CACHE_MINUTE !== '') {
    expiredTime = parseInt(IMAGE_CACHE_MINUTE) * 60
  }

  await redisClient.setEx(key, expiredTime, buffer)
}

export const clearImageCache = async (keyPattern: string): Promise<void> => {
  const { keys } = await redisClient.scan(0, { MATCH: `${keyPattern}*` })
  await redisClient.unlink(keys)
}

export const imageConvertFileType = async (
  buffer: Buffer,
  ext: Ext
): Promise<Buffer> => {
  const sharpObj = await sharp(buffer)[ext]()
  const newBuffer = await sharpObj.toBuffer()

  return newBuffer
}

export const imageResize = async (
  buffer: Buffer,
  imageResizeProperty: ImageResizeProperty
): Promise<Buffer> => {
  const { width, height, fit } = imageResizeProperty

  const newBuffer = await sharp(buffer)
    .resize({
      width,
      height,
      fit,
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .toBuffer()

  return newBuffer
}
