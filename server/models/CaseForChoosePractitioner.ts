import OffenderManager from './OffenderManager'

export default interface CaseForChoosePractitioner {
  name: string
  crn: string
  tier: string
  status: string
  offenderManager?: OffenderManager
  convictionNumber: number
}
