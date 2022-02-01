import dayjs from 'dayjs'
import Offence from '../../models/offence'
import config from '../../config'
import OffenderManager from '../../models/offenderManager'

export default class Order {
  sentence: string

  offences: string[]

  date: string

  probationPractitioner: string

  constructor(
    description: string,
    length: number,
    lengthUnit: string,
    offences: Offence[],
    date: string,
    offenderManager: OffenderManager
  ) {
    const sentenceLength = length ? ` (${length} ${lengthUnit})` : ''
    this.sentence = `${description}${sentenceLength}`
    this.offences = offences
      .sort(value => {
        return value.mainOffence ? -1 : 1
      })
      .map(value => value.description)
    this.date = dayjs(date).format(config.dateFormat)
    if (offenderManager) {
      const grade = offenderManager.grade ? ` (${offenderManager.grade})` : ''
      this.probationPractitioner = `${offenderManager.forenames} ${offenderManager.surname}${grade}`
    }
  }
}
