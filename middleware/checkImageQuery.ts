import type { Response, NextFunction } from 'express'
import type { RequestImage, QueryString, Ext, Fit } from '../types'

export default (req: RequestImage, res: Response, next: NextFunction): void => {
  const url: QueryString = req.query.url as QueryString
  let ext: Ext = (req.query.ext as Ext) ?? 'avif'
  const w: QueryString = req.query.w as QueryString
  const h: QueryString = req.query.h as QueryString
  const fit: Fit = (req.query.fit as Fit) ?? 'cover'

  /**
   * check query string
   */
  // ***** check url *****
  if (url === undefined) {
    res.status(400).send({
      message: "url is required, i.e., query string must have 'url' parameter"
    })
    return
  }

  if (url.length === 0) {
    res.status(400).send({
      message: 'url is required, but get an empty string'
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
        // eslint-disable-next-line max-len
        "ext can only be 'avif', 'webp', 'jpg', 'jpge', 'png', 'gif'. Default is 'avif'."
    })
    return
  }

  if (ext === 'jpg') {
    ext = 'jpeg'
  }

  // ***** check fit *****
  if (fit !== 'cover' && fit !== 'contain') {
    res.status(400).send({
      message: "fit can only be 'cover' or 'contain'. Default is 'cover'."
    })
    return
  }

  /**
   * add checked variable to req
   */

  req.checkedVar = {
    url,
    ext,
    width: w !== undefined ? parseInt(w) : undefined,
    height: h !== undefined ? parseInt(h) : undefined,
    fit
  }

  next()
}
