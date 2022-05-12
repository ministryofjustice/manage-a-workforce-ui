import OffenderManager from './OffenderManager'
import Offence from './Offence'
import Requirement from './Requirement'
import Document from './Document'
import Assessment from './Assessment'

export default interface Allocation {
  name: string
  crn: string
  tier: string
  sentenceDate: string
  initialAppointment: string
  status: string
  previousConvictionEndDate: string
  offenderManager: OffenderManager
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
  convictionId: number
  caseType: string
  preConvictionDocument: Document
}
