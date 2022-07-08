import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../logger'

interface Options {
  title: string
}

export default function createErrorHandler() {
  return (error: HTTPError, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`Error handling request for '${req.originalUrl}', user '${res.locals.user?.username}'`, error)

    if (error.status === 401 || error.status === 403) {
      logger.info('Logging user out')
      return res.redirect('/sign-out')
    }

    const status = error.status || 500
    switch (status) {
      case 404:
        return res.status(status).render('pages/error-notfound', {
          title: 'Not Found | Manage a workforce',
        })
      default:
        return res.status(status).render('pages/error-unavailable', {
          title: 'Sorry, the service is unavailable | Manage a workforce',
        })
    }
  }
}
