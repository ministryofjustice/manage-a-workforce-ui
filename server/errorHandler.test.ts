import request from 'supertest'
import { appWithAllRoutes } from './routes/testutils/appSetup'

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET 404', () => {
  it('should render correct content', () => {
    return request(appWithAllRoutes({}))
      .get('/unknown')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should return 404 status', () => {
    return request(appWithAllRoutes({}))
      .get('/unknown')
      .expect(res => {
        expect(res.statusCode).toEqual(404)
      })
  })
})

describe('GET 500', () => {
  it('should render problem with service', () => {
    return request(appWithAllRoutes({}))
      .get('/pdu/pduCode/teams')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Sorry, the service is unavailable | Manage a workforce')
        expect(res.text).toContain(
          'Try reloading the page. You can do this by pressing F5 (on a PC), or Cmd + R (on a Mac).',
        )
        expect(res.text).toContain('If the page still does not load, try again later.')
      })
  })

  it('should return 500 status', () => {
    return request(appWithAllRoutes({}))
      .get('/pdu/pduCode/teams')
      .expect(res => {
        expect(res.statusCode).toEqual(500)
      })
  })
})
