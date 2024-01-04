import UserService from './userService'
import ManageUsersClient, { User } from '../data/manageUsersClient'

jest.mock('../data/manageUsersClient')

const token = 'some token'

describe('User service', () => {
  let manageUsersClient: jest.Mocked<ManageUsersClient>
  let userService: UserService

  describe('getUser', () => {
    beforeEach(() => {
      manageUsersClient = new ManageUsersClient() as jest.Mocked<ManageUsersClient>
      userService = new UserService(manageUsersClient)
    })
    it('Retrieves and formats user name', async () => {
      manageUsersClient.getUser.mockResolvedValue({ name: 'john smith' } as User)

      const result = await userService.getUser(token)

      expect(result.displayName).toEqual('John Smith')
    })
    it('Propagates error', async () => {
      manageUsersClient.getUser.mockRejectedValue(new Error('some error'))

      await expect(userService.getUser(token)).rejects.toEqual(new Error('some error'))
    })
  })
})
