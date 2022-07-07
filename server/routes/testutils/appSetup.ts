import express, { RequestHandler, Express } from 'express'
import cookieSession from 'cookie-session'
import createError from 'http-errors'
import path from 'path'

import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import standardRouter from '../standardRouter'
import UserService from '../../services/userService'
import * as auth from '../../authentication/auth'
import MockErrorAllocationService from './MockErrorAllocationService'
import MockWorkloadService from './MockWorkloadService'
import authenticatedRoutes from '../index'
import unauthenticatedRoutes from '../unauthenticated'

const user = {
  name: 'john smith',
  firstName: 'john',
  lastName: 'smith',
  username: 'user1',
  displayName: 'John Smith',
}

class MockUserService extends UserService {
  constructor() {
    super(undefined)
  }

  async getUser(token: string) {
    return {
      token,
      ...user,
    }
  }
}

const appSetup = (authenticated: RequestHandler, unauthenticated: RequestHandler, production: boolean): Express => {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app, path)

  app.use((req, res, next) => {
    res.locals = {}
    res.locals.user = {}
    next()
  })

  app.use(cookieSession({ keys: [''] }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(unauthenticated)
  app.use(authenticated)
  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler())

  return app
}

// eslint-disable-next-line import/prefer-default-export
export const appWithAllRoutes = ({ production = false }: { production?: boolean }): Express => {
  auth.default.authenticationMiddleware = () => (req, res, next) => next()
  const authenticated = authenticatedRoutes(standardRouter(new MockUserService()), {
    allocationsService: new MockErrorAllocationService(undefined),
    workloadService: new MockWorkloadService(undefined),
  })
  const unauthenticated = unauthenticatedRoutes()
  return appSetup(authenticated, unauthenticated, production)
}
