import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import AllocationsController from '../controllers/allocationsController'
import ProbationEstateController from '../controllers/probationEstateController'
import AllocateCasesController from '../controllers/allocateCasesController'
import FindUnallocatedCasesController from '../controllers/findUnallocatedCasesController'
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

  const homeController = new HomeController(services.userPreferenceService)

  const findUnallocatedCasesController = new FindUnallocatedCasesController(
    services.probationEstateService,
    services.userPreferenceService,
    services.allocationsService
  )

  get('/before-you-start', async (req, res) => {
    await homeController.beforeYouStart(req, res)
  })
  get('/', async (req, res) => {
    await homeController.redirectUser(req, res)
  })

  get('/probationDeliveryUnit/:pduCode/find-unallocated', async (req, res) => {
    const { pduCode } = req.params
    await findUnallocatedCasesController.findUnallocatedCases(req, res, pduCode)
  })

  post('/probationDeliveryUnit/:pduCode/find-unallocated', async (req, res) => {
    const { pduCode } = req.params
    await findUnallocatedCasesController.submitFindUnallocatedCases(req, res, pduCode, req.body)
  })

  get('/probationDeliveryUnit/:pduCode/clear-find-unallocated', async (req, res) => {
    const { pduCode } = req.params
    await findUnallocatedCasesController.clearFindUnallocatedCases(req, res, pduCode)
  })

  get('/pdu/:pduCode/:crn/convictions/:convictionNumber/case-view', async (req, res) => {
    const { crn, convictionNumber, pduCode } = req.params
    await allocationsController.getUnallocatedCase(req, res, crn, convictionNumber, pduCode)
  })

  get('/:crn/documents/:documentId/:documentName', async (req, res) => {
    const { crn, documentId, documentName } = req.params
    await allocationsController.getDocument(res, crn, documentId, documentName)
  })

  get('/pdu/:pduCode/:crn/convictions/:convictionNumber/probation-record', async (req, res) => {
    const { crn, convictionNumber, pduCode } = req.params
    await allocationsController.getProbationRecord(req, res, crn, convictionNumber, pduCode)
  })

  get('/pdu/:pduCode/:crn/convictions/:convictionNumber/risk', async (req, res) => {
    const { crn, convictionNumber, pduCode } = req.params
    await allocationsController.getRisk(req, res, crn, convictionNumber, pduCode)
  })

  get('/pdu/:pduCode/:crn/convictions/:convictionNumber/documents', async (req, res) => {
    const { crn, convictionNumber, pduCode } = req.params
    await allocationsController.getDocuments(req, res, crn, convictionNumber, pduCode)
  })

  get('/pdu/:pduCode/:crn/convictions/:convictionNumber/choose-practitioner', async (req, res) => {
    const { crn, convictionNumber, pduCode } = req.params
    await allocationsController.choosePractitioner(req, res, crn, convictionNumber, pduCode)
  })

  post('/pdu/:pduCode/:crn/convictions/:convictionNumber/choose-practitioner', async (req, res) => {
    const { crn, convictionNumber, pduCode } = req.params
    await allocationsController.selectAllocateOffenderManager(req, res, crn, convictionNumber, pduCode)
  })

  get(
    '/pdu/:pduCode/:crn/convictions/:convictionNumber/allocate/:staffTeamCode/:staffCode/allocate-to-practitioner',
    async (req, res) => {
      const { crn, convictionNumber, staffTeamCode, staffCode, pduCode } = req.params
      await allocationsController.getAllocateToPractitioner(
        req,
        res,
        crn,
        staffTeamCode,
        staffCode,
        convictionNumber,
        pduCode
      )
    }
  )

  get(
    '/pdu/:pduCode/:crn/convictions/:convictionNumber/allocate/:staffTeamCode/:staffCode/instructions',
    async (req, res) => {
      const { crn, convictionNumber, staffTeamCode, staffCode, pduCode } = req.params
      await allocationsController.getConfirmInstructions(
        req,
        res,
        crn,
        staffTeamCode,
        staffCode,
        convictionNumber,
        pduCode
      )
    }
  )

  get(
    '/pdu/:pduCode/:crn/convictions/:convictionNumber/allocate/:offenderManagerTeamCode/:offenderManagerCode/officer-view',
    async (req, res) => {
      const { crn, convictionNumber, offenderManagerTeamCode, offenderManagerCode, pduCode } = req.params
      await allocationsController.getOverview(
        req,
        res,
        crn,
        offenderManagerTeamCode,
        offenderManagerCode,
        convictionNumber,
        pduCode
      )
    }
  )

  get(
    '/pdu/:pduCode/:crn/convictions/:convictionNumber/allocate/:offenderManagerTeamCode/:offenderManagerCode/active-cases',
    async (req, res) => {
      const { crn, convictionNumber, offenderManagerTeamCode, offenderManagerCode, pduCode } = req.params
      await allocationsController.getActiveCases(
        req,
        res,
        crn,
        offenderManagerTeamCode,
        offenderManagerCode,
        convictionNumber,
        pduCode
      )
    }
  )

  post(
    '/pdu/:pduCode/:crn/convictions/:convictionNumber/allocate/:staffTeamCode/:staffCode/confirm-allocation',
    async (req, res) => {
      const { crn, convictionNumber, staffTeamCode, staffCode, pduCode } = req.params
      await allocationsController.allocateCaseToOffenderManager(
        req,
        res,
        crn,
        staffTeamCode,
        staffCode,
        convictionNumber,
        req.body,
        pduCode
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
