import sharp from 'sharp'
import { commandOptions } from 'redis'
import { client as redisClient } from '../redis-client'
import type { Ext, ImageQueryParams, ImageResizeProperty } from '../types'

const formatCacheKey = (imageQueryParams: ImageQueryParams): string => {
  const { url, ext, w, h, fit } = imageQueryParams
  return `${url}&ext=${ext}&w=${w ?? 'auto'}&h=${h ?? 'auto'}&fit=${fit}`
}

export const getImageBufferFromCache = async (
  imageQueryParams: ImageQueryParams
): Promise<Buffer | null> => {
  const cachedBuffer = await redisClient.get(
    commandOptions({ returnBuffers: true }),
    formatCacheKey(imageQueryParams)
  )

  return cachedBuffer
}

export const setImageBufferToCache = async (
  imageQueryParams: ImageQueryParams,
  buffer: Buffer
): Promise<void> => {
  const IMAGE_CACHE_SECOND = process.env.IMAGE_CACHE_SECOND
  let expiredTime = 60 * 60 * 24 * 7 // default cache one week

  if (IMAGE_CACHE_SECOND !== undefined && IMAGE_CACHE_SECOND !== '') {
    expiredTime = parseInt(IMAGE_CACHE_SECOND)
  }

  await redisClient.setEx(formatCacheKey(imageQueryParams), expiredTime, buffer)
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
