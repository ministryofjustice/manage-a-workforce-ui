import CaseTotals from './CaseTotals'
import LastAllocatedEvent from './LastAllocatedEvent'

export default interface OffenderManagerOverview {
  forename: string
  surname: string
  email: string
  grade: string
  capacity: number
  code: string
  totalCases: number
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
  releasesDue: number
  lastAllocatedEvent: LastAllocatedEvent
}
