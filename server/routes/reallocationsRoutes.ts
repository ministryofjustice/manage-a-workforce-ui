import e from 'express'

import ReallocationsController from '../controllers/reallocationsController'
import type { Services } from '../services'

export default function getReallocationsRoutes(
  services: Services,
  get: (path: string, handler: e.RequestHandler) => e.Router,
  post: (path: string, handler: e.RequestHandler) => e.Router,
): void {
  const reallocationsController = new ReallocationsController(
    services.allocationsService,
    services.workloadService,
    services.userPreferenceService,
    services.probationEstateService,
    services.featureFlagService,
  )

  get('/reallocations', async (_req, res) => {
    const { token, username } = res.locals.user
    const { items: pduSelection } = await services.userPreferenceService.getPduUserPreference(token, username)
    if (pduSelection.length) {
      res.redirect(`/pdu/${pduSelection[0]}/reallocations`)
    } else {
      res.redirect('/regions')
    }
  })

  get('/pdu/:pduCode/reallocations', async (req, res) => {
    const { pduCode } = req.params
    await reallocationsController.getSearch(req, res, pduCode)
  })

  get('/pdu/:pduCode/:crn/reallocation-case-view', async (req, res) => {
    const { pduCode, crn } = req.params
    await reallocationsController.getAllocatedCase(req, res, crn, pduCode)
  })

  get('/pdu/:pduCode/:crn/reallocation-personal-details', async (req, res) => {
    const { pduCode, crn } = req.params
    await reallocationsController.getAllocatedPersonalDetails(req, res, crn, pduCode)
  })

  get('/pdu/:pduCode/:crn/reallocation-probation-record', async (req, res) => {
    const { pduCode, crn } = req.params
    await reallocationsController.getAllocatedProbationRecord(req, res, crn, pduCode)
  })

  get('/pdu/:pduCode/:crn/reallocation-risk', async (req, res) => {
    const { pduCode, crn } = req.params
    await reallocationsController.getAllocatedRisk(req, res, crn, pduCode)
  })

  get('/pdu/:pduCode/:crn/reallocation-documents', async (req, res) => {
    const { pduCode, crn } = req.params
    await reallocationsController.getAllocatedDocuments(req, res, crn, pduCode)
  })

  post('/pdu/:pduCode/:crn/reallocation-case-view', async (req, res) => {
    const { pduCode, crn } = req.params
    await reallocationsController.submitCaseSummary(req, res, pduCode, crn, req.body)
  })

  get('/pdu/:pduCode/:crn/reallocations/choose-practitioner', async (req, res) => {
    const { pduCode, crn } = req.params
    await reallocationsController.getPractitioners(req, res, crn, pduCode)
  })

  post('/pdu/:pduCode/:crn/reallocations/choose-practitioner', async (req, res) => {
    const { pduCode, crn } = req.params
    await reallocationsController.allocateToPractitioner(req, res, crn, pduCode)
  })

  get('/pdu/:pduCode/:crn/reallocations/:staffTeamCode/:staffCode/reallocation-complete', async (req, res) => {
    const { pduCode, crn } = req.params
    await reallocationsController.reallocationComplete(req, res, crn, pduCode)
  })

  post('/pdu/:pduCode/:crn/allocate/:staffTeamCode/:staffCode/save-reallocation', async (req, res) => {
    const { crn, staffTeamCode, staffCode, pduCode } = req.params
    await reallocationsController.submitCaseReallocation(req, res, crn, staffTeamCode, staffCode, req.body, pduCode)
  })
}
