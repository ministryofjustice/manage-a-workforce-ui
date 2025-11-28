import Registration from './Registration'
import RoshRisk from './RoshRisk'
import Rsr from './Rsr'
import Ogrs from './Ogrs'

export default interface Risk {
  name: string
  crn: string
  tier: string
  active: Registration[]
  previous: Registration[]
  roshRisk: RoshRisk
  rsr?: Rsr
  ogrs?: Ogrs
  roshLevel?: string
  rsrLevel?: string
  ogrsScore?: number
  convictionNumber: number
}
