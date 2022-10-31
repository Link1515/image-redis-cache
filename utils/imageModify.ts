import sharp from 'sharp'
import type { Ext, ImageResizeProperty } from '../types'

export const imageConvertFileType = async (buffer: Buffer, ext: Ext): Promise<Buffer> => {
  if (ext === 'jpg') ext = 'jpeg'

  const sharpObj = await sharp(buffer)[ext]()
  const newBuffer = await sharpObj.toBuffer()

  return newBuffer
}

export const imageResize = async (buffer: Buffer, imageResizeProperty: ImageResizeProperty): Promise<Buffer> => {
  const { width, height, fit } = imageResizeProperty

  const newBuffer =
  await sharp(buffer)
    .resize({
      width,
      height,
      fit,
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .toBuffer()

  return newBuffer
}
