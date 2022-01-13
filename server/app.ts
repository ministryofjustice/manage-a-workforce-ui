import express from 'express'

import path from 'path'
import createError from 'http-errors'

import indexRoutes from './routes'
import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import standardRouter from './routes/standardRouter'
import type UserService from './services/userService'

import setUpWebSession from './middleware/setUpWebSession'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpAuthentication from './middleware/setUpAuthentication'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import authorisationMiddleware from './middleware/authorisationMiddleware'
import AllocationsService from './services/allocationsService'
import unauthenticatedRoutes from './routes/unauthenticated'
import applyBankHols from './utils/bankHolidays'
import setUpBackButtonEnabled from './middleware/setUpBackButtonEnabled'

export default function createApp(
  userService: UserService,
  allocationsService: AllocationsService
): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(setUpHealthChecks())
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  app.use(setUpBackButtonEnabled())
  nunjucksSetup(app, path)
  app.use(setUpAuthentication())
  app.use(unauthenticatedRoutes())
  app.use(authorisationMiddleware(['ROLE_MANAGE_A_WORKFORCE_ALLOCATE']))

  applyBankHols()

  app.use(
    '/',
    indexRoutes(standardRouter(userService), {
      allocationsService,
    })
  )

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
