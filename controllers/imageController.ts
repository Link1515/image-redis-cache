import axios from 'axios'
import type { Request, Response } from 'express'
import sharp from 'sharp'
import type { QueryString, QueryStringExt, QueryStringFit } from '../types'

export default async (req: Request, res: Response): Promise<void> => {
  try {
    /**
     * get query string
     */
    // #region get query string
    const src: QueryString = req.query.src as QueryString
    let ext: QueryStringExt = (req.query.ext as QueryStringExt) ?? 'avif'
    const w: QueryString = req.query.w as QueryString
    const h: QueryString = req.query.h as QueryString
    const fit: QueryStringFit = (req.query.fit as QueryStringFit) ?? 'cover'
    // #endregion get query string

    /**
     * check query string
     */
    // #region check query string
    // ***** check src *****
    if (src === undefined) {
      res.status(400).send({
        message: 'src is required, i.e., query string must have src parameter'
      })
      return
    }

    if (src.length === 0) {
      res.status(400).send({
        message: 'src is required, but get an empty string'
      })
      return
    }

    // ***** check ext *****
    if (
      ext !== 'jpg' &&
      ext !== 'jpeg' &&
      ext !== 'png' &&
      ext !== 'gif' &&
      ext !== 'webp' &&
      ext !== 'avif'
    ) {
      res.status(400).send({
        message:
          'ext can only be avif, webp, jpg, jpge, png, gif. Default is avif.'
      })
      return
    }

    if (ext === 'jpg') {
      ext = 'jpeg'
    }

    // ***** check fit *****
    if (fit !== 'cover' && fit !== 'contain') {
      res.status(400).send({
        message: 'fit can only be cover or contain. Default is cover.'
      })
      return
    }

    /**
     * fetch src get image buffer
     */
    const response = await axios.get(src, { responseType: 'arraybuffer' })

    if (!response.headers['content-type'].includes('image')) {
      res
        .status(400)
        .send({ message: 'content-type of src response is not image' })
      return
    }

    // #endregion

    /**
     * modify image file
     */
    // #region modify image file
    const modifiedImage = await sharp(response.data)[ext]()

    const width = w !== undefined ? parseInt(w) : undefined
    const height = h !== undefined ? parseInt(h) : undefined

    if (width !== undefined || height !== undefined || fit !== undefined) {
      modifiedImage.resize({
        width,
        height,
        fit,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
    }

    const buffer = await modifiedImage.toBuffer()
    // #endregion modify image file

    /**
     * send response
     */
    res.setHeader('content-type', `image/${ext}`)
    res.send(buffer)
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      res.status(400).send({ message: error.message })
      return
    }

    res.status(500).send({ message: 'Server Error' })
  }
}
