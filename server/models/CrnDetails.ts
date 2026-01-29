import Name from './Name'
import Manager from './Manager'

export default interface CrnDetails {
  crn: string
  tier: string
  name: Name
  manager: Manager
  hasActiveOrder: boolean
}
