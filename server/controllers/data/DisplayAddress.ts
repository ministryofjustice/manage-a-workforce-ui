import Address from '../../models/Address'

export default class DisplayAddress {
  rows: string[]

  constructor(address: Address) {
    this.rows = []
    if (address) {
      const line1 = `${address.addressNumber ?? ''} ${address.buildingName ?? ''} ${address.streetName ?? ''}`
        .trim()
        .replace('  ', ' ')
      this.rows.push(line1)
      this.rows.push(address.town)
      this.rows.push(address.county)
      this.rows.push(address.postcode)
      this.rows = this.rows.flatMap(row => (row ? [row] : []))
    } else {
      this.rows.push('No address found')
    }
  }
}
