import e, { type RequestHandler } from 'express'

import ProbationEstateController from '../controllers/probationEstateController'
import type { Services } from '../services'

export default function probationEstateRoutes(
  services: Services,
  get: (path: string, handler: e.RequestHandler) => e.Router,
  post: (path: string, handler: e.RequestHandler) => e.Router,
): void {
  const probationEstateController = new ProbationEstateController(
    services.probationEstateService,
    services.userPreferenceService,
    services.allocationsService,
  )

  get('/pdu/:pduCode/select-teams', async (req, res) => {
    const { pduCode } = req.params
    await probationEstateController.getPduTeams(req, res, pduCode)
  })

  post('/pdu/:pduCode/select-teams', async (req, res) => {
    const { pduCode } = req.params
    await probationEstateController.selectPduTeams(req, res, pduCode)
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
}
