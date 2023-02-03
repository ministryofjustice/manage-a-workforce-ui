import Name from './Name'
import StaffMember from './StaffMember'

export default interface OffenderManagerPotentialWorkload {
  capacity: number
  potentialCapacity: number
  tier: string
  name: Name
  staff: StaffMember
}
