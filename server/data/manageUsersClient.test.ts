import nock from 'nock'

import config from '../config'
import ManageUsersClient from './manageUsersClient'

const token = { access_token: 'token-1', expires_in: 300 }

describe('hmppsAuthClient', () => {
  let fakeHmppsAuthApi: nock.Scope
  let manageUsersClient: ManageUsersClient

  beforeEach(() => {
    fakeHmppsAuthApi = nock(config.apis.manageUsersService.url)
    manageUsersClient = new ManageUsersClient()
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('getUser', () => {
    it('should return data from api', async () => {
      const response = { data: 'data' }

      fakeHmppsAuthApi
        .get('/users/me')
        .matchHeader('authorization', `Bearer ${token.access_token}`)
        .reply(200, response)

      const output = await manageUsersClient.getUser(token.access_token)
      expect(output).toEqual(response)
    })
  })
})
