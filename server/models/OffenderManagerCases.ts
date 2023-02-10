import Name from './Name'
import OffenderManagerCase from './OffenderManagerCase'

export default interface OffenderManagerCases {
  name: Name
  grade: string
  code: string
  activeCases: OffenderManagerCase[]
}
