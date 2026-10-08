import Name from './Name'
import StaffMember from './StaffMember'

export default interface PersonOnProbationStaffDetails {
  name: Name
  crn: string
  tier: string
  provisionalTier: boolean
  convictionNumber: number
  staff: StaffMember
}
