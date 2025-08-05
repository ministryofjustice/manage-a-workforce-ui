import type { Request, Response, NextFunction } from 'express'
import logger from '../logger'
import type { SanitisedError } from './sanitisedError'

export default function createErrorHandler() {
  return (error: SanitisedError, req: Request, res: Response, next: NextFunction): void => {
    logger.error(error, `Error handling request for '${req.originalUrl}', user '${res.locals.user?.username}'`)

    if (error.status === 401) {
      logger.info('Logging user out')
      return res.redirect('/sign-out')
    }

    if (error.status === 403) {
      logger.info('User forbidden')
      return res.status(error.status).render('pages/error-forbidden', {
        notification: { active: false },
        title: 'No Access | Manage a workforce',
      })
    }

    const status = error.status || 500
    switch (status) {
      case 404:
        return res.status(status).render('pages/error-notfound', {
          title: 'Not found | Manage a workforce',
        })
      case 503:
        return res.status(status).render('pages/error-unavailable', {
          title: 'Sorry, the service is unavailable | Manage a workforce',
        })
      case 504:
        return res.status(status).render('pages/error-timeout', {
          title: 'This service is temporarily unavailable | Manage a workforce',
        })
      default:
        return res.status(status).render('pages/error-server', {
          title: 'Sorry, the service is unavailable | Manage a workforce',
        })
    }
  }
}
