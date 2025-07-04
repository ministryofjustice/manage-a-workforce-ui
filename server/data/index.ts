import ManageUsersClient from './manageUsersClient'

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => ({
  manageUsersClient: new ManageUsersClient(),
})

export type DataAccess = ReturnType<typeof dataAccess>

export { ManageUsersClient, RestClientBuilder }
