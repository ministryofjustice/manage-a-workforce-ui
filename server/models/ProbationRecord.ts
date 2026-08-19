import Conviction from './Conviction'

export default interface ProbationRecord {
  name: string
  crn: string
  tier: string
  provisionalTier: boolean
  active: Conviction[]
  previous: Conviction[]
  convictionNumber: number
}
