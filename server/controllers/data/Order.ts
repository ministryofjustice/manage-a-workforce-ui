import dayjs from 'dayjs'
import Offence from '../../models/Offence'
import config from '../../config'
import ConvictionOffenderManager from '../../models/ConvictionOffenderManager'

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
    offenderManager: ConvictionOffenderManager
  ) {
    const sentenceLength = length ? ` (${length}${lengthUnit ? ` ${lengthUnit}` : ''})` : ''
    this.sentence = `${description}${sentenceLength}`
    this.offences = offences
      .sort(value => {
        return value.mainOffence ? -1 : 1
      })
      .map(value => value.description)
    this.date = dayjs(date).format(config.dateFormat)
    if (offenderManager) {
      const grade = offenderManager.grade ? ` (${offenderManager.grade})` : ''
      this.probationPractitioner = `${offenderManager.name}${grade}`
    } else {
      this.probationPractitioner = 'Unknown'
    }
  }
}
