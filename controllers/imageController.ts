import axios from 'axios'
import type { Response } from 'express'
import sharp from 'sharp'
import type { RequestImage } from '../types'

export default async (req: RequestImage, res: Response): Promise<void> => {
  if (req.checkedVar === undefined) {
    throw new Error('req.checkedVar is undefined')
  }
  const { src, ext, width, height, fit } = req.checkedVar

  try {
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

    /**
     * modify image file
     */
    const modifiedImage = await sharp(response.data)[ext]()

    if (width !== undefined || height !== undefined || fit !== undefined) {
      modifiedImage.resize({
        width,
        height,
        fit,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
    }

    const buffer = await modifiedImage.toBuffer()

    /**
     * send response
     */
    res.setHeader('content-type', `image/${ext}`)
    res.send(buffer)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.message)
      res.status(400).send({ message: `cannot fetch data from ${src}` })
      return
    }

    console.log(error)
    res.status(500).send({ message: 'Server Error' })
  }
}
