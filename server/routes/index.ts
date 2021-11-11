import type { RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import AllocationsController from '../controllers/allocationsController'
import AllocationsService from '../services/allocationsService'

export interface Services {
  allocationsService: AllocationsService
}

export default function routes(router: Router, services: Services): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const allocationsController = new AllocationsController(services.allocationsService)

  get('/', (req, res, next) => {
    allocationsController.getAllocations(req, res)
  })

  get('/accessibility-statement', (req, res) => {
    res.render('pages/accessibility-statement')
  })

  get('/privacy-notice', (req, res) => {
    res.render('pages/privacy-notice')
  })

  get('/cookie-policy', (req, res) => {
    res.render('pages/cookie-policy')
  })

  return router
}
