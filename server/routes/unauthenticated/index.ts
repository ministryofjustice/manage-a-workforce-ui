import express, { Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import Accessibility from './accessibility'
import Privacy from './privacy'
import Cookies from './cookies'

export default function UnauthenticatedRoutes(): Router {
  const router = express.Router()

  router.get('/accessibility-statement', asyncMiddleware(Accessibility()))
  router.get('/privacy-notice', asyncMiddleware(Privacy()))
  router.get('/cookie-policy', asyncMiddleware(Cookies()))

  return router
}
