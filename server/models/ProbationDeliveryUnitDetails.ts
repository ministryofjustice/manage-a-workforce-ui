import EstateRegion from './EstateRegion'
import EstateTeam from './EstateTeam'

export default interface RegionDetails {
  code: string
  name: string
  region: EstateRegion
  teams: EstateTeam[]
}
