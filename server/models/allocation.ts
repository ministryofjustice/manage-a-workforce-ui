import OffenderManager from './offenderManager'
import Offence from './offence'
import Requirement from './requirement'
import CourtReport from './courtReport'
import Assessment from './assessment'

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
  courtReport: CourtReport
  assessment: Assessment
  convictionId: number
}
