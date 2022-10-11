import EstateRegion from './EstateRegion'
import EstateTeam from './EstateTeam'

export default interface ProbationDeliveryUnitDetails {
  code: string
  name: string
  region: EstateRegion
  teams: EstateTeam[]
}
