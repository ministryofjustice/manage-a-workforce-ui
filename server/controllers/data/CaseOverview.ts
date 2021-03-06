import moment from 'moment-business-days'

import config from '../../config'

export default class CaseOverview {
  name: string

  crn: string

  tier: string

  status: string

  initialAppointment: string

  sentenceDate: string

  initialAppointmentDue: string

  convictionId: number

  constructor(
    name: string,
    crn: string,
    tier: string,
    sentenceDate: string,
    initialAppointment: string,
    status: string,
    convictionId: number
  ) {
    this.name = name
    this.crn = crn
    this.tier = tier
    this.sentenceDate = sentenceDate
    this.initialAppointment = initialAppointment
    this.setInitialAppointment(initialAppointment, sentenceDate)
    this.status = status
    this.convictionId = convictionId
  }

  setInitialAppointment(initialAppointment: string, sentenceDate: string): void {
    if (!initialAppointment) {
      this.initialAppointmentDue = this.calculateBusinessDays(sentenceDate)
    }
  }

  calculateBusinessDays(sentenceDate: string): string {
    const lastDayOfSLA = moment(sentenceDate, 'YYYY-MM-DD').businessAdd(5, 'days')

    return lastDayOfSLA.format(config.dateFormat)
  }
}
