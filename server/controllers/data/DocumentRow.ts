import dayjs from 'dayjs'

import config from '../../config'
import DocumentDetails from '../../models/DocumentDetails'

export default class DocumentRow {
  id: string

  nameFirstLine: string

  nameSecondLine: string

  fileName: string

  displaySensitive: boolean

  type: string

  eventFirstLine: string

  eventSecondLine: string

  dateCreated: string

  dateSortValue: string

  constructor(documentDetails: DocumentDetails) {
    this.id = documentDetails.id
    this.nameFirstLine = documentDetails.name
    this.nameSecondLine = documentDetails.relatedTo.description
    this.fileName = documentDetails.name
    this.displaySensitive = documentDetails.sensitive
    this.type = documentDetails.relatedTo.name
    if (documentDetails.relatedTo.event) {
      this.eventFirstLine = this.capitalise(documentDetails.relatedTo.event.eventType)
      this.eventSecondLine = documentDetails.relatedTo.event.mainOffence
    } else {
      this.eventFirstLine = 'Not attached to an event'
    }
    if (documentDetails.dateCreated) {
      this.dateCreated = dayjs(documentDetails.dateCreated).format(config.dateShortFormat)
      this.dateSortValue = documentDetails.dateCreated
    } else {
      this.dateSortValue = dayjs(new Date(-8640000000000000)).toISOString()
    }
  }

  capitalise(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  }
}
