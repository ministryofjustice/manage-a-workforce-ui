import Offence from './Offence'
import ConvictionOffenderManager from './ConvictionOffenderManager'

export default interface Conviction {
  description: string
  length: number
  lengthUnit: string
  offenderManager: ConvictionOffenderManager
  startDate: string
  endDate: string
  offences: Offence[]
}
