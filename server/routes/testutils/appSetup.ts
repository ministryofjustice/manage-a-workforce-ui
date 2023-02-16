import express, { Express } from 'express'
import cookieSession from 'cookie-session'
import createError from 'http-errors'
import path from 'path'

import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import * as auth from '../../authentication/auth'
import { Services } from '../../services'
import unauthenticatedRoutes from '../unauthenticated'
import TechnicalUpdatesService from '../../services/technicalUpdatesService'

export const user = {
  name: 'john smith',
  firstName: 'john',
  lastName: 'smith',
  userId: 'id',
  token: 'token',
  username: 'user1',
  displayName: 'John Smith',
  activeCaseLoadId: 'MDI',
  authSource: 'NOMIS',
}

export const flashProvider = jest.fn()

function appSetup(services: Services, userSupplier: () => Express.User): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app, path, services)
  app.use(cookieSession({ keys: [''] }))
  app.use((req, res, next) => {
    req.user = userSupplier()
    req.flash = flashProvider
    res.locals = {}
    res.locals.user = { ...req.user }
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(routes(services))
  app.use(unauthenticatedRoutes())
  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler())

  return app
}

export function appWithAllRoutes({
  services = { technicalUpdatesService: new TechnicalUpdatesService() },
  userSupplier = () => user,
}: {
  services?: Partial<Services>
  userSupplier?: () => Express.User
}): Express {
  auth.default.authenticationMiddleware = () => (req, res, next) => next()
  return appSetup(services as Services, userSupplier)
}
