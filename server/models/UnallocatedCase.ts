import OffenderManager from './OffenderManager'
import InitialAppointment from './InitialAppointment'

export default interface UnallocatedCase {
  name: string
  crn: string
  tier: string
  sentenceDate: string
  initialAppointment: InitialAppointment
  status: string
  offenderManager: OffenderManager
  sentenceLength: string
  convictionNumber: number
  caseType: string
}
