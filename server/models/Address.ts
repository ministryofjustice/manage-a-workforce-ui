export default interface Address {
  addressNumber: string
  buildingName: string
  streetName: string
  town: string
  county: string
  postcode: string
  noFixedAbode: boolean
  typeVerified: boolean
  from: string
  type: {
    description: string
  }
}
