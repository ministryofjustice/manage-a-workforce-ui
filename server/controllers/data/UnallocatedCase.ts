import dayjs from 'dayjs'

import config from '../../config'
import OffenderManager from '../../models/OffenderManager'
import tierOrder from './TierOrder'
import InitialAppointment from '../../models/InitialAppointment'

export default class UnallocatedCase {
  name: string

  crn: string

  tier: string

  tierOrder: number

  sentenceDate: string

  primaryInitialAppointment: string

  secondaryInitialAppointment: string

  initialAppointment: InitialAppointment

  primaryStatus: string

  secondaryStatus: string

  convictionNumber: number

  constructor(
    name: string,
    crn: string,
    tier: string,
    sentenceDate: string,
    initialAppointment: InitialAppointment,
    primaryStatus: string,
    offenderManager: OffenderManager,
    convictionNumber: number,
    caseType: string,
    sentenceLength: string
  ) {
    this.name = name
    this.crn = crn
    this.tier = tier
    this.tierOrder = tierOrder(tier)
    this.sentenceDate = sentenceDate
    this.setInitialAppointment(initialAppointment, caseType, sentenceLength)
    this.initialAppointment = initialAppointment
    this.primaryStatus = primaryStatus
    if (offenderManager) {
      this.secondaryStatus = `(${offenderManager.forenames} ${offenderManager.surname}${this.getGrade(
        offenderManager.grade
      )})`
    }
    this.convictionNumber = convictionNumber
  }

  getGrade(grade: string): string {
    if (grade) {
      return `, ${grade}`
    }
    return ''
  }

  setInitialAppointment(initialAppointment: InitialAppointment, caseType: string, sentenceLength: string): void {
    if (caseType === 'CUSTODY') {
      this.primaryInitialAppointment = 'Not needed'
      this.secondaryInitialAppointment = 'Custody case'
      if (sentenceLength) {
        this.secondaryInitialAppointment += ` (${sentenceLength})`
      }
    } else if (initialAppointment) {
      this.primaryInitialAppointment = `${dayjs(initialAppointment.date).format(config.dateFormat)}`
      if (initialAppointment.staff?.name?.combinedName !== 'Unallocated Staff') {
        this.secondaryInitialAppointment = initialAppointment.staff?.name?.combinedName
      } else {
        this.secondaryInitialAppointment = 'Unallocated officer'
      }
    } else {
      this.primaryInitialAppointment = 'Not found'
      this.secondaryInitialAppointment = 'Check with your team'
    }
  }
}
