import type { Response, NextFunction } from 'express'
import type { RequestImage, QueryString, Ext, Fit } from '../types'

export default (req: RequestImage, res: Response, next: NextFunction): void => {
  const src: QueryString = req.query.src as QueryString
  let ext: Ext = (req.query.ext as Ext) ?? 'avif'
  const w: QueryString = req.query.w as QueryString
  const h: QueryString = req.query.h as QueryString
  const fit: Fit = (req.query.fit as Fit) ?? 'cover'

  /**
   * check query string
   */
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
   * add checked variable to req
   */

  req.checkedVar = {
    src,
    ext,
    width: w !== undefined ? parseInt(w) : undefined,
    height: h !== undefined ? parseInt(h) : undefined,
    fit
  }

  next()
}
