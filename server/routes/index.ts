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

  get('/:crn/convictions/:convictionId/case-view', async (req, res) => {
    const { crn, convictionId } = req.params
    await allocationsController.getUnallocatedCase(req, res, crn, convictionId)
  })

  get('/:crn/convictions/:convictionId/probation-record', async (req, res) => {
    const { crn, convictionId } = req.params
    await allocationsController.getProbationRecord(req, res, crn, convictionId)
  })

  get('/:crn/convictions/:convictionId/risk', async (req, res) => {
    const { crn, convictionId } = req.params
    await allocationsController.getRisk(req, res, crn, convictionId)
  })

  get('/:crn/convictions/:convictionId/allocate', async (req, res) => {
    const { crn, convictionId } = req.params
    await allocationsController.getAllocate(req, res, crn, convictionId)
  })

  post('/:crn/convictions/:convictionId/allocate', async (req, res) => {
    const { crn, convictionId } = req.params
    await allocationsController.selectAllocateOffenderManager(req, res, crn, convictionId)
  })

  get('/:crn/convictions/:convictionId/allocate/:offenderManagerCode/confirm', async (req, res) => {
    const { crn, convictionId, offenderManagerCode } = req.params
    await allocationsController.getConfirmAllocation(req, res, crn, offenderManagerCode, convictionId)
  })

  get('/:crn/convictions/:convictionId/allocate/:offenderManagerCode/officer-view', async (req, res) => {
    const { crn, convictionId, offenderManagerCode } = req.params
    await allocationsController.getOfficerWorkload(req, res, crn, offenderManagerCode, convictionId)
  })

  get('/:crn/convictions/:convictionId/allocate/:offenderManagerCode/active-cases', async (req, res) => {
    const { crn, convictionId, offenderManagerCode } = req.params
    await allocationsController.getActiveCases(req, res, crn, offenderManagerCode, convictionId)
  })

  return router
}
