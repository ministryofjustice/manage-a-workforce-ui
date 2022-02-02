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

  get('/:crn/probation-record', (req, res) => {
    const { crn } = req.params
    allocationsController.getProbationRecord(req, res, crn)
  })

  get('/:crn/risk', (req, res) => {
    const { crn } = req.params
    allocationsController.getRisk(req, res, crn)
  })

  get('/:crn/allocate', (req, res) => {
    allocationsController.getAllocate(req, res)
  })

  return router
}
