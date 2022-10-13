import OffenderManager from './OffenderManager'
import Offence from './Offence'
import Requirement from './Requirement'
import Document from './Document'
import Assessment from './Assessment'
import Address from './Address'

export default interface CaseForChoosePractitioner {
  name: string
  crn: string
  tier: string
  status: string
  offenderManager: OffenderManager
  convictionId: number
}
