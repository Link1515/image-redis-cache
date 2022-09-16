import axios from 'axios'
import type { Request, Response } from 'express'
import sharp from 'sharp'

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const url: string | null = (req.query.u as string) ?? null

    const response = await axios.get(url, { responseType: 'arraybuffer' })

    if (!response.headers['content-type'].includes('image')) {
      res.status(400).send({ message: 'content-type of response is not image' })
      return
    }

    const buffer = await sharp(response.data).avif().toBuffer()

    res.setHeader('content-type', 'image/avif')
    res.send(buffer)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      res.status(400).send({ message: error.message })
      return
    }

    res.status(500).send({ message: 'Server Error' })
  }
}
