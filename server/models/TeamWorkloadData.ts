import { Practitioner } from './ChoosePractitionerData'

interface TeamWorkloadGroup {
  teams: Practitioner[]
}

type TeamWorkloadData = Record<string, TeamWorkloadGroup>

export default TeamWorkloadData
