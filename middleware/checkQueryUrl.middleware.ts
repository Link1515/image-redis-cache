import type { Request, Response, NextFunction } from 'express'

export default (req: Request, res: Response, next: NextFunction): Response | ReturnType<NextFunction> => {
  const query = req.query

  if (query.url === undefined) {
    return res.status(400).send({
      message: "url is required, i.e., query string must have 'url' parameter"
    })
  }

  if (query.url.length === 0) {
    return res.status(400).send({
      message: 'url is required, but get an empty string'
    })
  }

  return next()
}
