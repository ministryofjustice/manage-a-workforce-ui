import e from 'express'

import ReallocationsController from '../controllers/reallocationsController'
import type { Services } from '../services'

export default function getReallocationsRoutes(
  services: Services,
  get: (path: string, handler: e.RequestHandler) => e.Router,
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
}
