import AllLocalDeliveryUnit from './AllLocalDeliveryUnit'

export default interface AllProbationDeliveryUnit {
  name: string
  ldus: Map<string, AllLocalDeliveryUnit>
}
