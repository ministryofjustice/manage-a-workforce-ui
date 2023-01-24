import dayjs from 'dayjs'

import config from '../../config'
import Address from '../../models/Address'

export default class DisplayAddress {
  rows: string[]

  constructor(address: Address) {
    this.rows = []
    const line1 = `${address?.addressNumber ?? ''} ${address?.buildingName ?? ''} ${address?.streetName ?? ''}`
      .trim()
      .replace('  ', ' ')
    this.rows.push(line1)
    this.rows.push(address?.town)
    this.rows.push(address?.county)
    if (address?.postcode !== 'NF1 1NF') {
      this.rows.push(address?.postcode)
    }
    this.rows.push(this.getAddressType(address))
    this.rows.push(this.getStartDate(address?.startDate))
    this.rows = this.rows.flatMap(row => (row ? [row] : []))
    if (this.rows.length === 0) {
      this.rows.push('No address found')
    }
  }

  getAddressType(address: Address): string {
    const addressType = address?.noFixedAbode ? 'No fixed abode' : 'Type of address'
    const verified = address?.typeVerified ? ' (verified)' : ''
    return address?.typeDescription ? `${addressType}: ${address.typeDescription}${verified}` : ''
  }

  getStartDate(from: string): string {
    return from ? `Start date: ${dayjs(from).format(config.dateFormat)}` : ''
  }
}
