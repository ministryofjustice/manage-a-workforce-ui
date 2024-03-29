import Registration from './Registration'
import RoshRisk from './RoshRisk'

export default interface Risk {
  name: string
  crn: string
  tier: string
  active: Registration[]
  previous: Registration[]
  roshRisk: RoshRisk
  convictionNumber: number
}
