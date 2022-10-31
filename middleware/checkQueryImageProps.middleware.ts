import type { Request, Response, NextFunction } from 'express'

export default (req: Request, res: Response, next: NextFunction): Response | ReturnType<NextFunction> => {
  const query = req.query

  if (query.ext === undefined) {
    query.ext = 'avif'
  } else if (
    query.ext !== 'jpg' &&
    query.ext !== 'jpeg' &&
    query.ext !== 'png' &&
    query.ext !== 'gif' &&
    query.ext !== 'webp' &&
    query.ext !== 'avif'
  ) {
    return res.status(400).send({
      message:
        "ext can only be 'avif', 'webp', 'jpg', 'jpeg', 'png', 'gif'. Default is 'avif'."
    })
  }

  if (query.ext === 'jpg') {
    query.ext = 'jpeg'
  }

  if (query.fit === undefined) {
    query.fit = 'cover'
  } else if (query.fit !== 'cover' && query.fit !== 'contain') {
    return res.status(400).send({
      message: "fit can only be 'cover' or 'contain'. Default is 'cover'."
    })
  }

  return next()
}
