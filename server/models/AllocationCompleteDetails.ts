import Name from './Name'
import StaffMember from './StaffMember'

export default interface AllocationCompleteDetails {
  crn: string
  name: Name
  type: string
  initialAppointment: {
    date: string
  }
  staff: StaffMember
}
