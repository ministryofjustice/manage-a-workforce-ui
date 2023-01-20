interface PersonName {
  forename: string
  middleName?: string
  surname: string
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

export interface Practitioner {
  code: string
  name: PersonName
  email?: string
  grade: string
  workload: number
  casesPastWeek: number
  communityCases: number
  custodyCases: number
}

export default interface ChoosePractitionerData {
  crn: string
  name: PersonName
  tier: string
  probationStatus: ProbationStatus
  communityPersonManager?: CommunityPersonManager
  teams: Record<string, Practitioner[]>
}
