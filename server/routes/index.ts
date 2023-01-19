import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import AllocationsController from '../controllers/allocationsController'
import ProbationEstateController from '../controllers/probationEstateController'
import AllocateCasesController from '../controllers/allocateCasesController'
import CasesByTeamController from '../controllers/casesByTeamController'
import type { Services } from '../services'
import HomeController from '../controllers/homeController'

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))
  const allocationsController = new AllocationsController(
    services.allocationsService,
    services.workloadService,
    services.userPreferenceService,
    services.probationEstateService
  )
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
  const casesByTeamController = new CasesByTeamController(services.allocationsService, services.probationEstateService)

  const homeController = new HomeController(services.userPreferenceService)

  get('/', async (req, res) => {
    await homeController.redirectUser(req, res)
  })

  get('/team/:teamCode/cases/unallocated', async (req, res) => {
    const { teamCode } = req.params
    await casesByTeamController.getAllocationsByTeam(req, res, teamCode)
  })

  get('/team/:teamCode/:crn/convictions/:convictionNumber/case-view', async (req, res) => {
    const { crn, convictionNumber, teamCode } = req.params
    await allocationsController.getUnallocatedCase(req, res, crn, convictionNumber, teamCode)
  })

  get('/:crn/documents/:documentId/:documentName', async (req, res) => {
    const { crn, documentId, documentName } = req.params
    await allocationsController.getDocument(res, crn, documentId, documentName)
  })

  get('/team/:teamCode/:crn/convictions/:convictionNumber/probation-record', async (req, res) => {
    const { crn, convictionNumber, teamCode } = req.params
    await allocationsController.getProbationRecord(req, res, crn, convictionNumber, teamCode)
  })

  get('/team/:teamCode/:crn/convictions/:convictionNumber/risk', async (req, res) => {
    const { crn, convictionNumber, teamCode } = req.params
    await allocationsController.getRisk(req, res, crn, convictionNumber, teamCode)
  })

  get('/team/:teamCode/:crn/convictions/:convictionNumber/documents', async (req, res) => {
    const { crn, convictionNumber, teamCode } = req.params
    await allocationsController.getDocuments(req, res, crn, convictionNumber, teamCode)
  })

  get('/team/:teamCode/:crn/convictions/:convictionNumber/choose-practitioner', async (req, res) => {
    const { crn, convictionNumber, teamCode } = req.params
    await allocationsController.choosePractitioner(req, res, crn, convictionNumber, teamCode)
  })

  post('/team/:teamCode/:crn/convictions/:convictionNumber/choose-practitioner', async (req, res) => {
    const { crn, convictionNumber, teamCode } = req.params
    await allocationsController.selectAllocateOffenderManager(req, res, crn, convictionNumber, teamCode)
  })

  get(
    '/team/:teamCode/:crn/convictions/:convictionNumber/allocate/:staffTeamCode/:staffCode/allocate-to-practitioner',
    async (req, res) => {
      const { crn, convictionNumber, staffTeamCode, staffCode, teamCode } = req.params
      await allocationsController.getAllocateToPractitioner(
        req,
        res,
        crn,
        staffTeamCode,
        staffCode,
        convictionNumber,
        teamCode
      )
    }
  )

  get(
    '/team/:teamCode/:crn/convictions/:convictionNumber/allocate/:staffTeamCode/:staffCode/instructions',
    async (req, res) => {
      const { crn, convictionNumber, staffTeamCode, staffCode, teamCode } = req.params
      await allocationsController.getConfirmInstructions(
        req,
        res,
        crn,
        staffTeamCode,
        staffCode,
        convictionNumber,
        teamCode
      )
    }
  )

  get(
    '/team/:teamCode/:crn/convictions/:convictionNumber/allocate/:offenderManagerTeamCode/:offenderManagerCode/officer-view',
    async (req, res) => {
      const { crn, convictionNumber, offenderManagerTeamCode, offenderManagerCode, teamCode } = req.params
      await allocationsController.getOverview(
        req,
        res,
        crn,
        offenderManagerTeamCode,
        offenderManagerCode,
        convictionNumber,
        teamCode
      )
    }
  )

  // TODO -staffTeamCode
  get(
    '/team/:teamCode/:crn/convictions/:convictionNumber/allocate/:offenderManagerCode/active-cases',
    async (req, res) => {
      const { crn, convictionNumber, offenderManagerCode, teamCode } = req.params
      await allocationsController.getActiveCases(req, res, crn, offenderManagerCode, convictionNumber, teamCode)
    }
  )

  post(
    '/team/:teamCode/:crn/convictions/:convictionNumber/allocate/:staffTeamCode/:staffCode/confirm-allocation',
    async (req, res) => {
      const { crn, convictionNumber, staffTeamCode, staffCode, teamCode } = req.params
      await allocationsController.allocateCaseToOffenderManager(
        req,
        res,
        crn,
        staffTeamCode,
        staffCode,
        convictionNumber,
        req.body,
        teamCode
      )
    }
  )

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

  get('/regions', async (req, res) => {
    await probationEstateController.getRegions(req, res)
  })

  post('/regions', async (req, res) => {
    await probationEstateController.selectRegion(req, res)
  })

  get('/region/:regionCode/probationDeliveryUnits', async (req, res) => {
    const { regionCode } = req.params
    await probationEstateController.getProbationDeliveryUnitsByRegionCode(req, res, regionCode)
  })

  post('/region/:regionCode/probationDeliveryUnits', async (req, res) => {
    const { regionCode } = req.params
    await probationEstateController.selectProbationDeliveryUnit(req, res, regionCode)
  })
  return router
}
