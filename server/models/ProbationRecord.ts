import Conviction from './Conviction'

export default interface ProbationRecord {
  name: string
  crn: string
  tier: string
  active: Conviction[]
  previous: Conviction[]
  convictionId: number
  convictionNumber: number
}
