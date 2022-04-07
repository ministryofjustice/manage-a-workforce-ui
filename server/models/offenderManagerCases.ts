import OffenderManagerCase from './offenderManagerCase'

export default interface OffenderManagerCases {
  forename: string
  surname: string
  grade: string
  code: string
  teamName: string
  activeCases: OffenderManagerCase[]
}
