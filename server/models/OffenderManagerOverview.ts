import CaseTotals from './CaseTotals'
import LastAllocatedEvent from './LastAllocatedEvent'

export default interface OffenderManagerOverview {
  forename: string
  surname: string
  email: string
  grade: string
  code: string
  totalCases: number
  totalReductionHours: number
  nextReductionChange: string
  caseTotals: CaseTotals
  paroleReportsDue: number
  caseEndDue: number
  releasesDue: number
  lastAllocatedEvent: LastAllocatedEvent
}
