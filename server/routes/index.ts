import type { RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import AllocationsController from '../controllers/allocationsController'
import AllocationsService from '../services/allocationsService'

export interface Services {
  allocationsService: AllocationsService
}

export default function routes(router: Router, services: Services): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))
  const allocationsController = new AllocationsController(services.allocationsService)

  get('/', async (req, res) => {
    await allocationsController.getAllocations(req, res)
  })

  get('/:crn/case-view', async (req, res) => {
    const { crn } = req.params
    await allocationsController.getUnallocatedCase(req, res, crn)
  })

  get('/:crn/probation-record', async (req, res) => {
    const { crn } = req.params
    await allocationsController.getProbationRecord(req, res, crn)
  })

  get('/:crn/risk', async (req, res) => {
    const { crn } = req.params
    await allocationsController.getRisk(req, res, crn)
  })

  get('/:crn/allocate', async (req, res) => {
    const { crn } = req.params
    await allocationsController.getAllocate(req, res, crn)
  })

  post('/:crn/allocate', async (req, res) => {
    const { crn } = req.params
    await allocationsController.selectAllocateOffenderManager(req, res, crn)
  })

  return router
}
