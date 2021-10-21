import type { RequestHandler, Router, Request, Response } from 'express'

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
    res.render('pages/index')
  })

  get('/unallocated', (req: Request, res: Response) => allocationsController.getAllocations(req, res))

  return router
}
