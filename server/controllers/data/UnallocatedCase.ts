import dayjs from 'dayjs'
import moment from 'moment-business-days'
import config from '../../config'

export default class UnallocatedCase {
  name: string

  crn: string

  tier: string

  sentenceDate: string

  primaryInitialAppointment: string

  secondaryInitialAppointment: string

  secondaryInitialAppointmentStyle: string

  primaryStatus: string

  secondaryStatus: string

  constructor(
    name: string,
    crn: string,
    tier: string,
    sentenceDate: string,
    initialAppointment: string,
    primaryStatus: string,
    previousConvictionEndDate: string
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
  }

  setInitialAppointment(initialAppointment: string, sentenceDate: string): void {
    if (initialAppointment) {
      this.primaryInitialAppointment = `${dayjs(initialAppointment).format(config.dateFormat)}`
      this.secondaryInitialAppointment = this.calculateDays(initialAppointment)
    } else {
      this.primaryInitialAppointment = 'Not booked'
      this.secondaryInitialAppointment = this.calculateBusinessDays(sentenceDate)
    }
    this.secondaryInitialAppointmentStyle = this.getSecondaryInitialAppointmentStyling(this.secondaryInitialAppointment)
  }

  getSecondaryInitialAppointmentStyling(days: string): string {
    if (days === 'Today' || days === 'Tomorrow' || days === 'In 2 days' || days === 'Overdue') {
      return 'maw-secondary maw-overdue'
    }
    return 'maw-secondary'
  }

  calculateDays(date: string): string {
    const appt = dayjs(date).format('D MMM YYYY')
    const today = dayjs().format('D MMM YYYY')

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
    const addFiveBusinessDays = moment(sentenceDate, 'YYYY-MM-DD').businessAdd(5, 'days')
    const apptDue = addFiveBusinessDays.businessDiff(moment(config.currentDate(), 'YYYY-MM-DD'))

    if (apptDue > 5) {
      return 'Overdue'
    }
    if (apptDue === 0) {
      return 'Due today'
    }
    return `Due on ${addFiveBusinessDays.format(config.dateFormat)}`
  }
}
