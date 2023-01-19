import Offence from './Offence'
import Requirement from './Requirement'
import Document from './Document'
import Assessment from './Assessment'
import Address from './Address'

export default interface Allocation {
  name: string
  crn: string
  tier: string
  sentenceDate: string
  initialAppointment: string
  status: string
  gender: string
  dateOfBirth: string
  age: number
  offences: Offence[]
  expectedSentenceEndDate: string
  requirements: Requirement[]
  pncNumber: string
  courtReport: Document
  cpsPack: Document
  assessment: Assessment
  caseType: string
  preConvictionDocument: Document
  address: Address
  sentenceLength: string
  convictionNumber: number
}
