import dayjs from 'dayjs'
import config from '../../config'

export interface IUnallocatedCase {
  name: string
  crn: string
  tier: string
  sentenceDate: string
  initialAppointment: string
  primaryStatus: string
  secondaryStatus: string
}

export default class UnallocatedCase implements IUnallocatedCase {
  name: string

  crn: string

  tier: string

  sentenceDate: string

  initialAppointment: string

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
    this.initialAppointment = initialAppointment
    this.primaryStatus = primaryStatus
    if (primaryStatus === 'Previously managed' && previousConvictionEndDate) {
      this.secondaryStatus = `(${dayjs(previousConvictionEndDate).format(config.dateFormat)})`
    }
  }
}
