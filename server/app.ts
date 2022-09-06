import express from 'express'

import path from 'path'
import createError from 'http-errors'

import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import authorisationMiddleware from './middleware/authorisationMiddleware'

import setUpAuthentication from './middleware/setUpAuthentication'
import setUpCsrf from './middleware/setUpCsrf'
import setUpCurrentUser from './middleware/setUpCurrentUser'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'

import unauthenticatedRoutes from './routes/unauthenticated'
import applyBankHols from './utils/bankHolidays'

import routes from './routes'
import type { Services } from './services'
import getUnallocatedCasesCount from './middleware/getUnallocatedCasesCount'

export default function createApp(services: Services): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(setUpHealthChecks())
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  nunjucksSetup(app, path)
  app.use(setUpAuthentication())
  app.use(unauthenticatedRoutes())
  app.use(authorisationMiddleware(['ROLE_MANAGE_A_WORKFORCE_ALLOCATE']))
  app.use(setUpCsrf())
  app.use(setUpCurrentUser(services))
  app.use(getUnallocatedCasesCount(services.userPreferenceService, services.allocationsService))

  app.use((req, res, next) => {
    res.locals.casesLength = req.session.casesLength
    next()
  })

  applyBankHols()

  app.use(routes(services))

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler())

  return app
}
