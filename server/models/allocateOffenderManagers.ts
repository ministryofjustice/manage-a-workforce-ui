import OffenderManager from './offenderManager'
import OffenderManagerWorkload from './offenderManagerWorkload'

export default interface AllocateOffenderManagers {
  name: string
  crn: string
  tier: string
  status: string
  offenderManager: OffenderManager
  offenderManagersToAllocate: OffenderManagerWorkload[]
  convictionId: number
}
