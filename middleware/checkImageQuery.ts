import type { Request, Response, NextFunction } from 'express'

export default (req: Request, res: Response, next: NextFunction): void => {
  // const url: string | null = (req.query.u as string) ?? null
  const { u: url } = req.query

  if (url === null) {
    res.status(400).send({
      message: 'url is required, i.e., query string must have u parameter'
    })
    return
  }

  if (url === '') {
    res.status(400).send({
      message: 'url is required, but get an empty string'
    })
    return
  }

  next()
}
