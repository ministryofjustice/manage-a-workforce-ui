import dayjs from 'dayjs'
import Offence from '../../models/offence'
import config from '../../config'
import OffenderManager from '../../models/offenderManager'

export default class Order {
  sentence: string

  offences: string[]

  startDate: string

  probationPractitioner: string

  constructor(
    description: string,
    length: number,
    lengthUnit: string,
    offences: Offence[],
    startDate: string,
    offenderManager: OffenderManager
  ) {
    this.sentence = `${description} (${length} ${lengthUnit})`
    this.offences = offences
      .sort(value => {
        return value.mainOffence ? -1 : 1
      })
      .map(value => value.description)
    this.startDate = dayjs(startDate).format(config.dateFormat)
    if (offenderManager) {
      const grade = offenderManager.grade ? ` (${offenderManager.grade})` : ''
      this.probationPractitioner = `${offenderManager.forenames} ${offenderManager.surname}${grade}`
    }
  }
}
