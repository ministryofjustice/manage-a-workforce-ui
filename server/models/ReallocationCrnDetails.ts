import Name from './Name'
import Manager from './Manager'

export default interface ReallocationCrnDetails {
  crn: string
  name: Name
  dateOfBirth: string
  manager: Manager
  hasActiveOrder: boolean
}
