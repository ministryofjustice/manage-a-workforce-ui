import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import HomeController from '../controllers/homeController'
import StaffController from '../controllers/staffController'
import WorkloadController from '../controllers/workloadController'
import TechnicalUpdatesController from '../controllers/technicalUpdatesController'
import getAllocationRoutes from './allocationRoutes'
import probationEstateRoutes from './ProbationEstateRoutes'
import allocationsControllerRoutes from './allocationsControllerRoutes'

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const homeController = new HomeController(services.userPreferenceService)

  const staffController = new StaffController(services.staffLookupService)

  const workloadController = new WorkloadController(services.workloadService, services.allocationsService)

  const technicalUpdatesController = new TechnicalUpdatesController(services.technicalUpdatesService)

  get('/', async (req, res) => {
    await homeController.redirectUser(req, res)
  })

  getAllocationRoutes(services, get, post)
  allocationsControllerRoutes(services, get, post)
  probationEstateRoutes(services, get, post)

  get('/staff-lookup', async (req, res) => {
    const { searchString } = req.query
    await staffController.lookup(req, res, searchString as string)
  })

  post('/notes/:crn/:convictionNumber', async (req, res) => {
    const { crn, convictionNumber } = req.params
    const { instructions } = req.body

    await services.allocationsService.setNotesCache(crn, convictionNumber, res.locals.user.username, {
      instructions,
    })

    res.json(true)
  })

  post('/pdu/:pduCode/:crn/convictions/:convictionNumber/case-view', async (req, res) => {
    const { crn, convictionNumber, pduCode } = req.params
    return res.redirect(`/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/choose-practitioner`)
  })

  get('/pdu/:pduCode/:crn/convictions/:convictionNumber/allocation-complete', async (req, res) => {
    const { crn, convictionNumber, pduCode } = req.params
    await workloadController.allocationComplete(req, res, crn, convictionNumber, pduCode)
  })
  get('/whats-new', async (req, res) => {
    await technicalUpdatesController.getTechnicalUpdates(req, res)
  })
  return router
}
