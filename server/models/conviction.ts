import Offence from './offence'
import OffenderManager from './offenderManager'

export default interface Conviction {
  description: string
  length: number
  lengthUnit: string
  offenderManager: OffenderManager
  startDate: string
  endDate: string
  offences: Offence[]
}
