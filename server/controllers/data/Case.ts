import tierOrder from './TierOrder'

export default class Case {
  name: string

  crn: string

  tier: string

  tierOrder: number

  type: string

  constructor(crn: string, tier: string, type: string, name: string) {
    this.name = name
    this.crn = crn
    this.tier = tier
    this.tierOrder = tierOrder(tier)
    this.type = type
  }
}
