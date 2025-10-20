import e, { type RequestHandler } from 'express'

import AllocationsController from '../controllers/allocationsController'
import type { Services } from '../services'
import allocationsControllerCaseViewRoutes from './allocationsControllerCaseViewRoutes'

export default function allocationsControllerRoutes(
  services: Services,
  get: (path: string, handler: e.RequestHandler) => e.Router,
  post: (path: string, handler: e.RequestHandler) => e.Router,
): void {
  const allocationsController = new AllocationsController(
    services.allocationsService,
    services.workloadService,
    services.userPreferenceService,
    services.probationEstateService,
  )

  allocationsControllerCaseViewRoutes(services, get, post, allocationsController)

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

  get('/pdu/:pduCode/:teamCode/reallocations/cases/:offenderManagerCode', async (req, res) => {
    const { teamCode, offenderManagerCode, pduCode } = req.params
    await allocationsController.getCasesForReallocation(req, res, teamCode, offenderManagerCode, pduCode)
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
}
