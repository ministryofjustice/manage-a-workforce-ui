import dayjs from 'dayjs'

import config from '../../config'
import OffenderManager from '../../models/OffenderManager'
import tierOrder from './TierOrder'

export default class UnallocatedCase {
  name: string

  crn: string

  tier: string

  tierOrder: number

  sentenceDate: string

  primaryInitialAppointment: string

  secondaryInitialAppointment: string

  primaryStatus: string

  secondaryStatus: string

  convictionId: number

  constructor(
    name: string,
    crn: string,
    tier: string,
    sentenceDate: string,
    initialAppointment: string,
    primaryStatus: string,
    previousConvictionEndDate: string,
    offenderManager: OffenderManager,
    convictionId: number,
    caseType: string
  ) {
    this.name = name
    this.crn = crn
    this.tier = tier
    this.tierOrder = tierOrder.get(tier) ?? 0
    this.sentenceDate = sentenceDate
    this.setInitialAppointment(initialAppointment, sentenceDate, caseType)
    this.primaryStatus = primaryStatus
    if (primaryStatus === 'Previously managed' && previousConvictionEndDate) {
      this.secondaryStatus = `(${dayjs(previousConvictionEndDate).format(config.dateFormat)})`
    }
    if (primaryStatus === 'Currently managed' && offenderManager) {
      const grade = offenderManager.grade ? `, ${offenderManager.grade}` : ''
      this.secondaryStatus = `(${offenderManager.forenames} ${offenderManager.surname}${grade})`
    }
    this.convictionId = convictionId
  }

  setInitialAppointment(initialAppointment: string, sentenceDate: string, caseType: string): void {
    if (caseType === 'CUSTODY') {
      this.primaryInitialAppointment = 'Not needed'
      this.secondaryInitialAppointment = 'Custody case'
    } else if (initialAppointment) {
      this.primaryInitialAppointment = `${dayjs(initialAppointment).format(config.dateFormat)}`
    } else {
      this.primaryInitialAppointment = 'Not found'
      this.secondaryInitialAppointment = 'Check with your team'
    }
  }
}
