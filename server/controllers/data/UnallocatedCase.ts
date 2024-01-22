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

  handoverDate: string

  primaryInitialAppointment: string

  secondaryInitialAppointment: string

  initialAppointment: InitialAppointment

  primaryStatus: string

  secondaryStatus: string

  convictionNumber: number

  outOfAreaTransfer: boolean

  constructor(
    name: string,
    crn: string,
    tier: string,
    sentenceDate: string,
    handoverDate: string,
    initialAppointment: InitialAppointment,
    primaryStatus: string,
    offenderManager: OffenderManager,
    convictionNumber: number,
    caseType: string,
    sentenceLength: string,
    outOfAreaTransfer: boolean
  ) {
    this.name = name
    this.crn = crn
    this.tier = tier
    this.tierOrder = tierOrder(tier)
    this.sentenceDate = sentenceDate
    this.setHandoverDate(handoverDate)
    this.setInitialAppointment(initialAppointment, caseType, sentenceLength)
    this.initialAppointment = initialAppointment
    this.primaryStatus = primaryStatus
    if (offenderManager) {
      this.secondaryStatus = `(${offenderManager.forenames} ${offenderManager.surname}${this.getGrade(
        offenderManager.grade
      )})`
    }
    this.convictionNumber = convictionNumber
    this.outOfAreaTransfer = outOfAreaTransfer
  }

  getGrade(grade: string): string {
    if (grade) {
      return `, ${grade}`
    }
    return ''
  }

  setHandoverDate(handoverDate: string) {
    if (handoverDate) {
      this.handoverDate = `${dayjs(handoverDate).format(config.dateFormat)}`
    } else {
      this.handoverDate = 'N/A'
    }
  }

  setInitialAppointment(initialAppointment: InitialAppointment, caseType: string, sentenceLength: string): void {
    if (caseType === 'CUSTODY') {
      this.primaryInitialAppointment = 'Not needed'
      this.secondaryInitialAppointment = 'Custody case'
      if (sentenceLength) {
        this.secondaryInitialAppointment += ` (${sentenceLength})`
      }
    } else if (initialAppointment?.date) {
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
