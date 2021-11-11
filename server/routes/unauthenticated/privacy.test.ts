import request from 'supertest'
import { appWithAllRoutes } from '../testutils/appSetup'

describe('GET Privacy', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET Privacy notice', () => {
    test("should render the 'Privacy notice' page", () => {
      return request(appWithAllRoutes({ production: false }))
        .get(`/privacy-notice`)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.status).toBe(200)
          expect(res.text).toContain('Privacy notice')
        })
    })
  })
})
