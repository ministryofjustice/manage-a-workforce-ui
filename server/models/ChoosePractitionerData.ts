interface PersonName {
  forename: string
  middleName?: string
  surname: string
  combinedName?: string
}

interface ProbationStatus {
  status: string
  description: string
}

interface CommunityPersonManager {
  code: string
  name: PersonName
  teamCode: string
  grade?: string
}

interface TierCaseTotals {
  notSupervised: number
  a: number
  b: number
  c: number
  d: number
  e: number
  f: number
  g: number
  missing: number
}

interface Reductions {
  reductionHours: number
  startDate: string
  endDate: string
  reductionType: string
  reductionStatus: string
  contractedHours: number
}

export interface Practitioner {
  code: string
  name: PersonName
  email?: string
  grade: string
  workload: number
  casesPastWeek: number
  communityCases: number
  custodyCases: number
  licenseCases: number
  laoCase?: boolean
  allocatedCasesPastWeek: number
  reallocatedCasesPastWeek: number
  totalCases: number
  ispsDueInNext14Days: number
  activeCases: number
  contactSuspendedCases: number
  custodyReleasesInNext7Days: number
  paroleReportsInNext28Days: number
  otherReportsInNext14Days: number
  tierCaseTotals: TierCaseTotals
  reductions: Reductions[]
}

export default interface ChoosePractitionerData {
  crn: string
  name: PersonName
  tier: string
  provisionalTier: boolean
  probationStatus: ProbationStatus
  communityPersonManager?: CommunityPersonManager
  teams: Record<string, Practitioner[]>
}
