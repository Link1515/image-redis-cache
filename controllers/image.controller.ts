import axios from 'axios'
import type { Request, Response } from 'express'
import { commandOptions } from 'redis'
import { client as redisClient } from '../redis-client'
import { imageConvertFileType, imageResize, logger } from '../utils'
import { Ext, Fit } from '../types'
import { validationResult, matchedData } from 'express-validator'

const handleImage = async (req: Request, res: Response): Promise<Response> => {
  const result = validationResult(req)

  if (!result.isEmpty()) {
    return res.send(result.mapped())
  }

  const data = matchedData(req)

  const url = data.url as string
  const ext = data.ext as Ext
  const w = data.w as number
  const h = data.h as number
  const fit = data.fit as Fit

  try {
    /**
     * check if url in the redis db
     */
    const urlIsCached = Boolean(await redisClient.exists(url))
    let buffer: Buffer

    if (urlIsCached) {
      /**
       * get image buffer from redis db
       */
      const cachedBuffer = await redisClient.hGet(
        commandOptions({ returnBuffers: true }),
        url,
        ext
      )

      if (cachedBuffer != null) {
        // redis db have exactly type buffer
        buffer = cachedBuffer
      } else {
        // redis db do not have specific type buffer.
        // use any other buffer to convert to specific type
        const cachedExtList = await redisClient.hKeys(url)
        const anyBuffer = (await redisClient.hGet(
          commandOptions({ returnBuffers: true }),
          url,
          cachedExtList[0]
        )) as Buffer

        buffer = await imageConvertFileType(anyBuffer, ext)
        await redisClient.hSet(url, ext, buffer)
      }
    } else {
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

      buffer = response.data as Buffer

      await redisClient.hSet(url, ext, buffer)
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
      return res.send(result.mapped())
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
