import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './routes/testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET 404', () => {
  it('should render correct content', () => {
    return request(appWithAllRoutes({ production: true }))
      .get('/unknown')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should return 404 status', () => {
    return request(appWithAllRoutes({ production: true }))
      .get('/unknown')
      .expect(res => {
        expect(res.statusCode).toEqual(404)
      })
  })
})

describe('GET 500', () => {
  it('should render problem with service', () => {
    return request(appWithAllRoutes({}))
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Sorry, there is a problem with the service')
        expect(res.text).toContain('Please try again later.')
      })
  })

  it('should return 500 status', () => {
    return request(appWithAllRoutes({ production: true }))
      .get('/')
      .expect(res => {
        expect(res.statusCode).toEqual(500)
      })
  })
})
