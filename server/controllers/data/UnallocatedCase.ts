import dayjs from 'dayjs'
import moment, { Moment } from 'moment-business-days'

import config from '../../config'
import { OffenderManager } from '../../services/allocationsService'

export default class UnallocatedCase {
  name: string

  crn: string

  tier: string

  sentenceDate: string

  primaryInitialAppointment: string

  secondaryInitialAppointment: string

  primaryStatus: string

  secondaryStatus: string

  constructor(
    name: string,
    crn: string,
    tier: string,
    sentenceDate: string,
    initialAppointment: string,
    primaryStatus: string,
    previousConvictionEndDate: string,
    offenderManager: OffenderManager
  ) {
    this.name = name
    this.crn = crn
    this.tier = tier
    this.sentenceDate = sentenceDate
    this.setInitialAppointment(initialAppointment, sentenceDate)
    this.primaryStatus = primaryStatus
    if (primaryStatus === 'Previously managed' && previousConvictionEndDate) {
      this.secondaryStatus = `(${dayjs(previousConvictionEndDate).format(config.dateFormat)})`
    }
    if (primaryStatus === 'Currently managed' && offenderManager) {
      this.secondaryStatus = `(${offenderManager.forenames} ${offenderManager.surname})`
    }
  }

  setInitialAppointment(initialAppointment: string, sentenceDate: string): void {
    if (initialAppointment) {
      this.primaryInitialAppointment = `${dayjs(initialAppointment).format(config.dateFormat)}`
      this.secondaryInitialAppointment = this.calculateDays(initialAppointment)
    } else {
      this.primaryInitialAppointment = 'Not booked'
      this.secondaryInitialAppointment = this.calculateBusinessDays(sentenceDate)
    }
  }

  calculateDays(date: string): string {
    const appt = dayjs(date).format('D MMM YYYY')
    const today = dayjs(config.currentDate()).format('D MMM YYYY')

    const diffInDays = dayjs(appt).diff(today, 'day')

    switch (true) {
      case diffInDays === 0:
        return 'Today'
      case diffInDays === 1:
        return 'Tomorrow'
      case diffInDays >= 2:
        return `In ${diffInDays} days`
      default:
        return 'Overdue'
    }
  }

  calculateBusinessDays(sentenceDate: string): string {
    const lastDayOfSLA = moment(sentenceDate, 'YYYY-MM-DD').businessAdd(5, 'days')
    const today = moment(config.currentDate(), 'YYYY-MM-DD')

    if (this.isBeforeToday(lastDayOfSLA, today)) {
      return 'Overdue'
    }

    if (this.isToday(lastDayOfSLA, today)) {
      return 'Due today'
    }
    return `Due on ${lastDayOfSLA.format(config.dateFormat)}`
  }

  isToday(date: Moment, today: Moment): boolean {
    return date.isSame(today, 'day')
  }

  isBeforeToday(date: Moment, today: Moment): boolean {
    return date.isBefore(today, 'day')
  }
}
