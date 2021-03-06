import type { RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import AllocationsController from '../controllers/allocationsController'
import AllocationsService from '../services/allocationsService'
import WorkloadService from '../services/workloadService'

export interface Services {
  allocationsService: AllocationsService
  workloadService: WorkloadService
}

export default function routes(router: Router, services: Services): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))
  const allocationsController = new AllocationsController(services.allocationsService, services.workloadService)

  get('/', async (req, res) => {
    await allocationsController.getAllocations(req, res)
  })

  get('/:crn/convictions/:convictionId/case-view', async (req, res) => {
    const { crn, convictionId } = req.params
    await allocationsController.getUnallocatedCase(req, res, crn, convictionId)
  })

  get('/:crn/convictions/:convictionId/documents/:documentId', async (req, res, next) => {
    const { crn, convictionId, documentId } = req.params
    await allocationsController.getDocument(req, res, next, crn, convictionId, documentId)
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

  get('/:crn/convictions/:convictionId/allocate/:staffCode/confirm', async (req, res) => {
    const { crn, convictionId, staffCode } = req.params
    await allocationsController.getAllocationImpact(req, res, crn, staffCode, convictionId)
  })

  get('/:crn/convictions/:convictionId/allocate/:staffCode/instructions', async (req, res) => {
    const { crn, convictionId, staffCode } = req.params
    await allocationsController.getConfirmInstructions(req, res, crn, staffCode, convictionId)
  })

  get('/:crn/convictions/:convictionId/allocate/:offenderManagerCode/officer-view', async (req, res) => {
    const { crn, convictionId, offenderManagerCode } = req.params
    await allocationsController.getOverview(req, res, crn, offenderManagerCode, convictionId)
  })

  get('/:crn/convictions/:convictionId/allocate/:offenderManagerCode/active-cases', async (req, res) => {
    const { crn, convictionId, offenderManagerCode } = req.params
    await allocationsController.getActiveCases(req, res, crn, offenderManagerCode, convictionId)
  })

  post('/:crn/convictions/:convictionId/allocate/:staffCode/confirm-allocation', async (req, res) => {
    const { crn, convictionId, staffCode } = req.params
    await allocationsController.allocateCaseToOffenderManager(req, res, crn, staffCode, convictionId, req.body)
  })

  return router
}
