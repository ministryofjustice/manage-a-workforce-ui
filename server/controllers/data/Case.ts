import tierOrder from './TierOrder'
import tierName from './TierName'

export default class Case {
  name: string

  crn: string

  tier: string

  tierOrder: number

  type: string

  excluded: boolean

  redacted: boolean

  initialAllocationDate?: string

  constructor(
    crn: string,
    tier: string,
    type: string,
    name: string,
    isExcluded: boolean,
    isRedacted: boolean,
    initialAllocationDate: string = '',
  ) {
    this.name = name
    this.crn = crn
    this.tier = tierName(tier)
    this.tierOrder = tierOrder(tier)
    this.type = type
    this.excluded = isExcluded
    this.redacted = isRedacted
    this.initialAllocationDate = initialAllocationDate
  }
}
