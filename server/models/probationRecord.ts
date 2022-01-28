import Conviction from './conviction'

export default interface ProbationRecord {
  name: string
  crn: string
  tier: string
  active: Conviction[]
  previous: Conviction[]
}
