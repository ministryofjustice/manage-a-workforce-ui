import OffenderManagerCase from './OffenderManagerCase'

export default interface OffenderManagerCases {
  forename: string
  surname: string
  grade: string
  code: string
  teamName: string
  activeCases: OffenderManagerCase[]
}
