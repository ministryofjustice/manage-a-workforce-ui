import Offence from './offence'
import ConvictionOffenderManager from './convictionOffenderManager'

export default interface Conviction {
  description: string
  length: number
  lengthUnit: string
  offenderManager: ConvictionOffenderManager
  startDate: string
  endDate: string
  offences: Offence[]
}
