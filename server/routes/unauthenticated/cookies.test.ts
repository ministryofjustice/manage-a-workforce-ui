import request from 'supertest'
import { appWithAllRoutes } from '../testutils/appSetup'

describe('GET Cookies', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET Cookie policy', () => {
    test("should render the 'Cookie policy' page", () => {
      return request(appWithAllRoutes({ production: false }))
        .get(`/cookie-policy`)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.status).toBe(200)
          expect(res.text).toContain('Cookies')
        })
    })
  })
})
