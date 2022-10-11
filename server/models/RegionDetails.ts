import ProbationDeliveryUnitOverview from './ProbationDeliveryUnitOverview'

export default interface RegionDetails {
  code: string
  name: string
  probationDeliveryUnits: ProbationDeliveryUnitOverview[]
}
