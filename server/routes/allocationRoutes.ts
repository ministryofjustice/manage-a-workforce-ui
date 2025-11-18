import e, { type RequestHandler } from 'express'

import AllocateCasesController from '../controllers/allocateCasesController'
import FindUnallocatedCasesController from '../controllers/findUnallocatedCasesController'
import type { Services } from '../services'
import AllocationHistoryController from '../controllers/allocationHistoryController'
import AllocationsController from '../controllers/allocationsController'

export default function getAllocationRoutes(
  services: Services,
  get: (path: string, handler: e.RequestHandler) => e.Router,
  post: (path: string, handler: e.RequestHandler) => e.Router,
): void {
  const allocateCasesController = new AllocateCasesController(
    services.allocationsService,
    services.probationEstateService,
    services.userPreferenceService,
    services.workloadService,
    services.featureFlagService,
  )
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

  const allocationsController = new AllocationsController(
    services.allocationsService,
    services.workloadService,
    services.userPreferenceService,
    services.probationEstateService,
    services.featureFlagService,
  )

  get('/pdu/:pduCode/find-unallocated', async (req, res) => {
    const { pduCode } = req.params
    await findUnallocatedCasesController.findUnallocatedCases(req, res, pduCode)
  })

  post('/pdu/:pduCode/find-unallocated', async (req, res) => {
    const { pduCode } = req.params
    await findUnallocatedCasesController.submitFindUnallocatedCases(req, res, pduCode, req.body)
  })

  get('/pdu/:pduCode/clear-find-unallocated', async (req, res) => {
    const { pduCode } = req.params
    await findUnallocatedCasesController.clearFindUnallocatedCases(req, res, pduCode)
  })

  get('/pdu/:pduCode/teams', async (req, res) => {
    const { pduCode } = req.params
    await allocateCasesController.getDataByTeams(req, res, pduCode)
  })

  get('/pdu/:pduCode/:teamCode/team-workload', async (req, res) => {
    const { teamCode, pduCode } = req.params
    await allocateCasesController.getTeamWorkload(req, res, pduCode, teamCode)
  })

  get('/pdu/:pduCode/case-allocation-history', async (req, res) => {
    const { pduCode } = req.params
    await allocationHistoryController.getCasesAllocatedByTeam(req, res, pduCode)
  })

  get('/pdu/:pduCode/:teamCode/reallocations/team-workload', async (req, res) => {
    const { teamCode, pduCode } = req.params
    await allocateCasesController.getReallocationTeamWorkload(req, res, pduCode, teamCode)
  })
  get('/allocations/crn-lookup', async (req, res) => {
    const crn = req.query.crn as string
    await allocationsController.lookupCrnDetailsForAllocations(
      req,
      res,
      crn,
      res.locals.user.staffCode,
      res.locals.user.pduCode,
    )
  })

  get('/pdu/:pduCode/:crn/reallocation-case-view', async (req, res) => {
    const { pduCode, crn } = req.params
    await allocationsController.getAllocatedCase(req, res, crn, pduCode)
  })

  get('/pdu/:pduCode/:crn/reallocation-personal-details', async (req, res) => {
    const { pduCode, crn } = req.params
    await allocationsController.getAllocatedPersonalDetails(req, res, crn, pduCode)
  })

  get('/pdu/:pduCode/:crn/reallocation-probation-record', async (req, res) => {
    const { pduCode, crn } = req.params
    await allocationsController.getAllocatedProbationRecord(req, res, crn, pduCode)
  })

  get('/pdu/:pduCode/:crn/reallocation-risk', async (req, res) => {
    const { pduCode, crn } = req.params
    await allocationsController.getAllocatedRisk(req, res, crn, pduCode)
  })

  get('/pdu/:pduCode/:crn/reallocation-documents', async (req, res) => {
    const { pduCode, crn } = req.params
    await allocationsController.getAllocatedDocuments(req, res, crn, pduCode)
  })
}
