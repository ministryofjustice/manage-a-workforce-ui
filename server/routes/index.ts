import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import AllocationsController from '../controllers/allocationsController'
import ProbationEstateController from '../controllers/probationEstateController'
import AllocateCasesController from '../controllers/allocateCasesController'
import CasesByTeamController from '../controllers/casesByTeamController'
import type { Services } from '../services'

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))
  const allocationsController = new AllocationsController(services.allocationsService, services.workloadService)
  const probationEstateController = new ProbationEstateController(
    services.probationEstateService,
    services.userPreferenceService
  )
  const allocateCasesController = new AllocateCasesController(
    services.allocationsService,
    services.probationEstateService,
    services.userPreferenceService,
    services.workloadService
  )
  const casesByTeamController = new CasesByTeamController(services.allocationsService)

  get('/', async (req, res) => {
    await allocationsController.getAllocations(req, res)
  })

  get('/team/:teamCode/cases/unallocated', async (req, res) => {
    const { teamCode } = req.params
    await casesByTeamController.getAllocationsByTeam(req, res, teamCode)
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

  get('/probationDeliveryUnit/:pduCode/select-teams', async (req, res) => {
    const { pduCode } = req.params
    await probationEstateController.getPduTeams(req, res, pduCode)
  })

  post('/probationDeliveryUnit/:pduCode/select-teams', async (req, res) => {
    const { pduCode } = req.params
    await probationEstateController.selectPduTeams(req, res, pduCode)
  })

  get('/probationDeliveryUnit/:pduCode/teams', async (req, res) => {
    const { pduCode } = req.params
    await allocateCasesController.getDataByTeams(req, res, pduCode)
  })
  return router
}
