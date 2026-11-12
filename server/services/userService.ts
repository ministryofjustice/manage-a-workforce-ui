import { UUID } from 'crypto'

import { convertToTitleCase } from '../utils/utils'
import type ManageUsersClient from '../data/manageUsersClient'

interface UserDetails {
  name: string
  uuid?: UUID
  displayName: string
}

export default class UserService {
  constructor(private readonly manageUsersClient: ManageUsersClient) {}

  async getUser(token: string): Promise<UserDetails> {
    const user = await this.manageUsersClient.getUser(token)
    return { ...user, displayName: convertToTitleCase(user.name as string) }
  }
}
