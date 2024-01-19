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
    handoverDate: string | undefined,
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

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  addDays(days: number) {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date
  }

  setHandoverDate(handoverDate: string) {
    const zeroOrOne = this.getRandomInt(2)
    if (zeroOrOne === 0) {
      const addedDays = this.getRandomInt(10) * this.getRandomInt(5)
      const randomFutureDate = this.addDays(addedDays)
      const here = randomFutureDate.getTime() - randomFutureDate.getTimezoneOffset() * 60000
      const dummyHandoverDateString = new Date(here).toISOString().split('T')[0]
      this.handoverDate = `${dayjs(dummyHandoverDateString).format(config.dateFormat)}`
    } else {
      this.handoverDate = `${dayjs('1970-01-01').format(config.dateFormat)}`
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
