import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import AllocationsController from '../controllers/allocationsController'
import ProbationEstateController from '../controllers/probationEstateController'
import AllocateCasesController from '../controllers/allocateCasesController'
import FindUnallocatedCasesController from '../controllers/findUnallocatedCasesController'
import type { Services } from '../services'
import HomeController from '../controllers/homeController'
import StaffController from '../controllers/staffController'
import WorkloadController from '../controllers/workloadController'
import TechnicalUpdatesController from '../controllers/technicalUpdatesController'
import AllocationHistoryController from '../controllers/allocationHistoryController'

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))
  const allocationsController = new AllocationsController(
    services.allocationsService,
    services.workloadService,
    services.userPreferenceService,
    services.probationEstateService,
  )
  const probationEstateController = new ProbationEstateController(
    services.probationEstateService,
    services.userPreferenceService,
  )
  const allocateCasesController = new AllocateCasesController(
    services.allocationsService,
    services.probationEstateService,
    services.userPreferenceService,
    services.workloadService,
  )

  const homeController = new HomeController(services.userPreferenceService)

  const findUnallocatedCasesController = new FindUnallocatedCasesController(
    services.probationEstateService,
    services.userPreferenceService,
    services.allocationsService,
    services.workloadService,
  )

  const allocationHistoryController = new AllocationHistoryController(
    services.workloadService,
    services.probationEstateService,
    services.userPreferenceService,
    services.allocationsService,
  )

  const staffController = new StaffController(services.staffLookupService)

  const workloadController = new WorkloadController(services.workloadService, services.allocationsService)

  const technicalUpdatesController = new TechnicalUpdatesController(services.technicalUpdatesService)

  get('/', async (req, res) => {
    await homeController.redirectUser(req, res)
  })

  get('/staff-lookup', async (req, res) => {
    const { searchString } = req.query
    await staffController.lookup(req, res, searchString as string)
  })

  get('/pdu/:pduCode/find-unallocated', async (req, res) => {
    const { pduCode } = req.params
    await findUnallocatedCasesController.findUnallocatedCases(req, res, pduCode)
  })

  get('/pdu/:pduCode/case-allocation-history', async (req, res) => {
    const { pduCode } = req.params
    await allocationHistoryController.getCasesAllocatedByTeam(req, res, pduCode)
  })

  post('/pdu/:pduCode/find-unallocated', async (req, res) => {
    const { pduCode } = req.params
    await findUnallocatedCasesController.submitFindUnallocatedCases(req, res, pduCode, req.body)
  })

  get('/pdu/:pduCode/clear-find-unallocated', async (req, res) => {
    const { pduCode } = req.params
    await findUnallocatedCasesController.clearFindUnallocatedCases(req, res, pduCode)
  })

  get('/pdu/:pduCode/:crn/convictions/:convictionNumber/case-view', async (req, res) => {
    const { crn, convictionNumber, pduCode } = req.params
    await allocationsController.getUnallocatedCase(req, res, crn, convictionNumber, pduCode)
  })

  post('/pdu/:pduCode/:crn/convictions/:convictionNumber/case-view', async (req, res) => {
    const { crn, convictionNumber, pduCode } = req.params
    return res.redirect(`/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/choose-practitioner`)
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
        pduCode,
      )
    },
  )

  get(
    '/pdu/:pduCode/:crn/convictions/:convictionNumber/allocate/:staffTeamCode/:staffCode/allocation-notes',
    async (req, res) => {
      const { crn, convictionNumber, staffTeamCode, staffCode, pduCode } = req.params
      await allocationsController.getConfirmInstructions(
        req,
        res,
        crn,
        staffTeamCode,
        staffCode,
        convictionNumber,
        pduCode,
      )
    },
  )
  get('/pdu/:pduCode/:crn/convictions/:convictionNumber/check-edit-allocation-notes', async (req, res) => {
    const { crn, convictionNumber, staffTeamCode, staffCode, pduCode } = req.params

    await allocationsController.getCheckEdit(req, res, crn, staffTeamCode, staffCode, convictionNumber, pduCode)
  })

  get(
    '/pdu/:pduCode/:crn/convictions/:convictionNumber/allocate/:staffTeamCode/:staffCode/spo-oversight-contact-option',
    async (req, res) => {
      const { crn, convictionNumber, staffTeamCode, staffCode, pduCode } = req.params

      await allocationsController.getCheckEdit(req, res, crn, staffTeamCode, staffCode, convictionNumber, pduCode)
    },
  )
  post(
    '/pdu/:pduCode/:crn/convictions/:convictionNumber/allocate/:staffTeamCode/:staffCode/spo-oversight-contact-option',
    async (req, res) => {
      const { crn, convictionNumber, staffTeamCode, staffCode, pduCode } = req.params
      await allocationsController.getSpoOversight(req, res, crn, staffTeamCode, staffCode, convictionNumber, pduCode)
    },
  )
  post(
    '/pdu/:pduCode/:crn/convictions/:convictionNumber/allocate/:staffTeamCode/:staffCode/save-allocation',
    async (req, res) => {
      const { crn, convictionNumber, staffTeamCode, staffCode, pduCode } = req.params
      await allocationsController.submitNoSpoOversight(
        req,
        res,
        crn,
        staffTeamCode,
        staffCode,
        convictionNumber,
        req.body,
        pduCode,
      )
    },
  )

  get('/pdu/:pduCode/:offenderManagerTeamCode/:offenderManagerCode/officer-view', async (req, res) => {
    const { convictionNumber, offenderManagerTeamCode, offenderManagerCode, pduCode } = req.params
    await allocationsController.getOverview(
      req,
      res,
      offenderManagerTeamCode,
      offenderManagerCode,
      convictionNumber,
      pduCode,
      false,
    )
  })

  get('/pdu/:pduCode/:offenderManagerTeamCode/:offenderManagerCode/history-officer-view', async (req, res) => {
    const { convictionNumber, offenderManagerTeamCode, offenderManagerCode, pduCode } = req.params
    await allocationsController.getOverview(
      req,
      res,
      offenderManagerTeamCode,
      offenderManagerCode,
      convictionNumber,
      pduCode,
      true,
    )
  })

  get('/pdu/:pduCode/:offenderManagerTeamCode/:offenderManagerCode/active-cases', async (req, res) => {
    const { convictionNumber, offenderManagerTeamCode, offenderManagerCode, pduCode } = req.params
    await allocationsController.getActiveCases(
      req,
      res,
      offenderManagerTeamCode,
      offenderManagerCode,
      convictionNumber,
      pduCode,
    )
  })

  post(
    '/pdu/:pduCode/:crn/convictions/:convictionNumber/allocate/:staffTeamCode/:staffCode/confirm-instructions',
    async (req, res) => {
      const { crn, convictionNumber, staffTeamCode, staffCode, pduCode } = req.params
      await allocationsController.allocateCaseToOffenderManager(
        req,
        res,
        crn,
        staffTeamCode,
        staffCode,
        Number(convictionNumber),
        req.body,
        pduCode,
      )
    },
  )

  post(
    '/pdu/:pduCode/:crn/convictions/:convictionNumber/allocate/:staffTeamCode/:staffCode/confirm-allocation',
    async (req, res) => {
      const { crn, convictionNumber, staffTeamCode, staffCode, pduCode } = req.params
      await allocationsController.submitSpoOversight(
        req,
        res,
        crn,
        staffTeamCode,
        staffCode,
        Number(convictionNumber),
        req.body,
        pduCode,
      )
    },
  )

  get('/pdu/:pduCode/:crn/convictions/:convictionNumber/allocation-complete', async (req, res) => {
    const { crn, convictionNumber, pduCode } = req.params
    await workloadController.allocationComplete(req, res, crn, convictionNumber, pduCode)
  })

  get('/pdu/:pduCode/select-teams', async (req, res) => {
    const { pduCode } = req.params
    await probationEstateController.getPduTeams(req, res, pduCode)
  })

  post('/pdu/:pduCode/select-teams', async (req, res) => {
    const { pduCode } = req.params
    await probationEstateController.selectPduTeams(req, res, pduCode)
  })

  get('/pdu/:pduCode/teams', async (req, res) => {
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

  get('/pdu/:pduCode/:teamCode/team-workload', async (req, res) => {
    const { teamCode, pduCode } = req.params
    await allocateCasesController.getTeamWorkload(req, res, pduCode, teamCode)
  })

  get('/whats-new', async (req, res) => {
    await technicalUpdatesController.getTechnicalUpdates(req, res)
  })
  return router
}
