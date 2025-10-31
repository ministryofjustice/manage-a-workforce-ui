import Name from './Name'

export default interface OffenderManagerCase {
  name: Name
  crn: string
  tier: string
  type: string
  initialAllocationDate?: string
}
