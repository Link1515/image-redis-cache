import axios from 'axios'
import type { Request, Response } from 'express'
import { validationResult, matchedData } from 'express-validator'
import { commandOptions } from 'redis'
import { client as redisClient } from '../redis-client'
import { imageConvertFileType, imageResize, logger } from '../utils'
import { Ext, Fit } from '../types'

const handleImage = async (req: Request, res: Response): Promise<Response> => {
  const result = validationResult(req)

  if (!result.isEmpty()) {
    return res.status(400).send({
      message: 'parameter error',
      parameterErrorMap: result.mapped()
    })
  }

  const data = matchedData(req)

  const url: string = data.url
  const ext: Ext = data.ext
  const w: number = data.w
  const h: number = data.h
  const fit: Fit = data.fit

  try {
    /**
     * check if request url (as its key) in the redis db
     */
    const urlIsCached = Boolean(await redisClient.exists(req.url))

    if (urlIsCached) {
      /**
       * get image buffer from redis db
       */
      const cachedBuffer = await redisClient.get(
        commandOptions({ returnBuffers: true }),
        req.url
      )

      if (cachedBuffer !== null) {
        res.setHeader('content-type', `image/${ext}`)
        return res.send(cachedBuffer)
      }
    }

    /**
     * fetch image buffer
     */
    const response = await axios.get(url, { responseType: 'arraybuffer' })

    if (!response.headers['content-type'].includes('image')) {
      return res.status(400).send({
        message: 'content-type of url response is not image/*'
      })
    }

    // if image is svg type, just return to client
    if (response.headers['content-type'].includes('image/svg+xml')) {
      res.setHeader('content-type', 'image/svg+xml')
      return res.send(response.data)
    }

    let buffer = response.data as Buffer

    const IMAGE_CACHE_MINUTE = process.env.IMAGE_CACHE_MINUTE
    let expiredTime = 60 * 60 * 24 // default cache one day

    if (IMAGE_CACHE_MINUTE !== undefined && IMAGE_CACHE_MINUTE !== '') {
      expiredTime = parseInt(IMAGE_CACHE_MINUTE) * 60
    }

    await redisClient.setEx(req.url, expiredTime, buffer)

    /**
     * convert file type
     */
    if (ext !== undefined) {
      buffer = await imageConvertFileType(buffer, ext)
    }

    /**
     * resizing image
     */
    if (w !== undefined || h !== undefined || fit !== undefined) {
      buffer = await imageResize(buffer, { width: w, height: h, fit })
    }

    /**
     * send response
     */
    res.setHeader('content-type', `image/${ext}`)
    return res.send(buffer)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(error.message)
      return res.status(400).send({ message: `cannot fetch data from ${url}` })
    }

    logger.error('server error', error)
    return res.status(500).send({ message: 'Server Error' })
  }
}

const clearCache = async (req: Request, res: Response): Promise<Response> => {
  try {
    const result = validationResult(req)

    if (!result.isEmpty()) {
      return res.status(400).send({
        message: 'parameter error',
        parameterErrorMap: result.mapped()
      })
    }

    const data = matchedData(req)

    const url = data.url as string

    const { keys } = await redisClient.scan(0, { MATCH: `${url}*` })
    await redisClient.unlink(keys)

    return res.status(200).send({ message: 'OK' })
  } catch (error) {
    logger.error('server error', error)
    return res.status(500).send({ message: 'server error' })
  }
}

export default {
  handleImage,
  clearCache
}
