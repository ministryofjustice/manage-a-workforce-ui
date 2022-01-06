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

  get('/', (req, res) => {
    allocationsController.getAllocations(req, res)
  })

  get('/:crn/case-view', (req, res) => {
    const { crn } = req.params
    allocationsController.getUnallocatedCase(req, res, crn)
  })

  get('/probation-record', (req, res) => {
    allocationsController.getProbationRecord(req, res)
  })

  get('/risk', (req, res) => {
    allocationsController.getRisk(req, res)
  })

  get('/summary', (req, res) => {
    allocationsController.getSummary(req, res)
  })

  return router
}
