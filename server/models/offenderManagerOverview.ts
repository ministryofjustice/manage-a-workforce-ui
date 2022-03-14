export default interface OffenderManagerOverview {
  name: string
  crn: string
  tier: string
  offenderManagerForename: string
  offenderManagerSurname: string
  offenderManagerGrade: string
  offenderManagerCurrentCapacity: number
  offenderManagerCode: string
  offenderManagerTotalCases: number
  convictionId: number
  teamName: string
  offenderManagerWeeklyHours: number
  offenderManagerTotalReductionHours: number
  offenderManagerPointsAvailable: number
  offenderManagerPointsUsed: number
  offenderManagerPointsRemaining: number
  lastUpdatedOn: string
}
