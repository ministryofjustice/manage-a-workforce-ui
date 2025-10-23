import express, { Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import Accessibility from './accessibility'

export default function UnauthenticatedRoutes(): Router {
  const router = express.Router()

  router.get('/accessibility-statement', asyncMiddleware(Accessibility()))

  return router
}
