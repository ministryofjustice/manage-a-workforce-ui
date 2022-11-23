import tierOrder from './TierOrder'

export default class Case {
  name: string

  crn: string

  tier: string

  tierOrder: number

  caseCategory: string

  constructor(crn: string, tier: string, caseCategory: string, forename = '', surname = '') {
    this.name = `${forename} ${surname}`
    this.crn = crn
    this.tier = tier
    this.tierOrder = tierOrder(tier)
    this.caseCategory = caseCategory
  }
}
