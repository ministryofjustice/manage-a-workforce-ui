import { RequestHandler } from 'express'

export default function unless(path: string, middleware: RequestHandler): RequestHandler {
  return async (req, res, next) => {
    if (path === req.path) {
      return next()
    }
    return middleware(req, res, next)
  }
}
