import request from 'supertest'
import { appWithAllRoutes } from '../testutils/appSetup'

describe('GET Accessibility', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET Accessibility statement', () => {
    test("should render the 'Accessibility statement' page", () => {
      return request(appWithAllRoutes({ production: false }))
        .get(`/accessibility-statement`)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.status).toBe(200)
          expect(res.text).toContain('Accessibility statement for Manage a workforce')
        })
    })
  })
})
