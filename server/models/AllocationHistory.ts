import Name from './Name'
import StaffMember from './StaffMember'

export default interface AllocationHistory {
  cases: AllocatedCase[]
}

interface AllocatedCase {
  crn: string
  name: Name
  staff: StaffMember
  tier: string
  allocatedOn: string
  allocatingSpo: string
  teamCode: string
}
