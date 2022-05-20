import CaseTotals from './CaseTotals'

export default interface OffenderManagerOverview {
  forename: string
  surname: string
  grade: string
  capacity: number
  code: string
  totalCases: number
  teamName: string
  weeklyHours: number
  totalReductionHours: number
  pointsAvailable: number
  pointsUsed: number
  pointsRemaining: number
  lastUpdatedOn: string
  nextReductionChange: string
  caseTotals: CaseTotals
  paroleReportsDue: number
  caseEndDue: number
}
