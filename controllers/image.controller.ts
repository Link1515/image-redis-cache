import axios from 'axios'
import type { Response } from 'express'
import type { RequestImage } from '../types'
import { commandOptions } from 'redis'
import { client as redisClient } from '../redis-client'
import { imageConvertFileType, imageResize } from '../utils/imageModify'

export default async (req: RequestImage, res: Response): Promise<Response> => {
  if (req.checkedVar === undefined) {
    throw new Error('req.checkedVar is undefined')
  }
  const { url, ext, width, height, fit } = req.checkedVar

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
      const cachedBuffer = await redisClient.hGet(commandOptions({ returnBuffers: true }), url, ext)

      if (cachedBuffer != null) {
        // redis db have exactly type buffer
        buffer = cachedBuffer
      } else {
        // redis db do not have specify type buffer.
        // use any other buffer to convert to specify type
        const cachedExtList = await redisClient.hKeys(url)
        const anyBuffer = await redisClient.hGet(commandOptions({ returnBuffers: true }), url, cachedExtList[0]) as Buffer

        buffer = await imageConvertFileType(anyBuffer, ext)
        await redisClient.hSet(url, ext, buffer)
      }
    } else {
      /**
       * fetch image buffer
       */
      const response = await axios.get(url, { responseType: 'arraybuffer' })

      if (!response.headers['content-type'].includes('image')) {
        return res
          .status(400)
          .send({ message: 'content-type of url response is not image/*' })
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
    if (width !== undefined || height !== undefined || fit !== undefined) {
      buffer = await imageResize(buffer, { width, height, fit })
    }

    /**
     * send response
     */
    res.setHeader('content-type', `image/${ext}`)
    return res.send(buffer)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.message)
      return res.status(400).send({ message: `cannot fetch data from ${url}` })
    }

    console.log(error)
    return res.status(500).send({ message: 'Server Error' })
  }
}
