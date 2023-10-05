import axios from 'axios'
import type { Request, Response } from 'express'
import { validationResult, matchedData } from 'express-validator'
import { logger } from '../utils'
import {
  imageConvertFileType,
  imageResize,
  getImageBufferFromCache,
  setImageBufferToCache,
  clearImageCache
} from '../services/image.service'
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
     * get image buffer from cache
     */
    const cachedBuffer = await getImageBufferFromCache(req.url)
    if (cachedBuffer !== null) {
      res.setHeader('content-type', `image/${ext}`)
      return res.send(cachedBuffer)
    }

    /**
     * fetch image buffer
     */
    const imageResponse = await axios.get(url, { responseType: 'arraybuffer' })

    if (!imageResponse.headers['content-type'].includes('image')) {
      return res.status(400).send({
        message: 'content-type of url response is not image/*'
      })
    }

    // if image is svg type, just return to client
    if (imageResponse.headers['content-type'].includes('image/svg+xml')) {
      res.setHeader('content-type', 'image/svg+xml')
      return res.send(imageResponse.data)
    }

    let buffer = imageResponse.data as Buffer

    /**
     * set image buffer to cache
     */
    await setImageBufferToCache(req.url, buffer)

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

    await clearImageCache(req.url)

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
