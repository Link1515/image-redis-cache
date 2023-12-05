import sharp from 'sharp'
import { commandOptions } from 'redis'
import parseDuration from 'parse-duration'
import { client as redisClient } from '../redis-client'
import type { Ext, ImageQueryParams, ImageResizeProperty } from '../types'

const formatCacheKey = (imageQueryParams: ImageQueryParams): string => {
  const { url, cacheId, ext, w, h, fit } = imageQueryParams
  return `${url}&cacheId=${cacheId}&w=${w ?? 'auto'}&h=${
    h ?? 'auto'
  }&fit=${fit}${ext ? `&ext=${ext}` : ''}`
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
  const IMAGE_CACHE_DURATION = process.env.IMAGE_CACHE_DURATION
  let expiredTime

  if (IMAGE_CACHE_DURATION) {
    expiredTime = parseDuration(IMAGE_CACHE_DURATION, 's')
  }

  if (!expiredTime) {
    expiredTime = parseDuration('7d', 's') ?? 60 * 60 * 24 * 7 // default cache one week
  }

  await redisClient.setEx(formatCacheKey(imageQueryParams), expiredTime, buffer)
}

export const clearImageCache = async (
  imageQueryParams: ImageQueryParams
): Promise<number> => {
  // const { keys } = await redisClient.scan(0, { MATCH: `${keyPattern}*` })
  return await redisClient.unlink(formatCacheKey(imageQueryParams))
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

export const isValidExtension = (ext: string): ext is Ext => {
  return ['jpeg', 'png', 'gif', 'webp', 'avif'].includes(ext)
}

export const getImageExtFromUrl = (url: string): Ext => {
  let ext = url.match(/\.([^./?]+)($|\?)/)?.[1] ?? ''

  if (ext === 'jpg') {
    ext = 'jpeg'
  }

  if (!isValidExtension(ext)) throw new Error('invalid extension')

  return ext
}
