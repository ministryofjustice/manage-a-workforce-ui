import OffenderManager from './OffenderManager'

export default interface UnallocatedCase {
  name: string
  crn: string
  tier: string
  sentenceDate: string
  initialAppointment: string
  status: string
  offenderManager: OffenderManager
  sentenceLength: string
  convictionNumber: number
  caseType: string
}
