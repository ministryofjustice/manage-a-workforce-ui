import Address from './Address'

export default interface AllocatedCase {
  name: string
  crn: string
  tier: string
  gender?: string
  dateOfBirth: string
  age: number
  nextAppointmentDate?: string
  activeEvents: AllocatedEvent[]
  pncNumber: string
  address?: Address
  outOfAreaTransfer: boolean
}

interface AllocatedEvent {
  number: number
  failureToComplyCount: number
  failureToComplyStartDate?: string
  sentence?: AllocatedEventSentence
  offences: AllocatedEventOffences[]
  requirements: AllocatedEventRequirement[]
}

interface AllocatedEventRequirement {
  mainCategory: string
  subCategory: string
  length: string
}
interface AllocatedEventOffences {
  mainCategory: string
  subCategory: string
  mainOffence: boolean
}

interface AllocatedEventSentence {
  description: string
  startDate: string
  endDate: string
  length: string
}
