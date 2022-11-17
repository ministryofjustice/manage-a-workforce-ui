import dayjs from 'dayjs'

import config from '../../config'
import DocumentDetails from '../../models/DocumentDetails'

export default class DocumentRow {
  id: string

  nameFirstLine: string

  nameSecondLine: string

  nameThirdLine: string

  type: string

  eventFirstLine: string

  eventSecondLine: string

  dateCreated: string

  dateSortValue: string

  constructor(documentDetails: DocumentDetails) {
    this.id = documentDetails.id
    this.nameFirstLine = documentDetails.name
    this.nameSecondLine = documentDetails.relatedTo.description
    if (documentDetails.sensitive) {
      this.nameThirdLine = 'SENSITIVE'
    }
    this.type = documentDetails.relatedTo.name
    if (documentDetails.relatedTo.event) {
      this.eventFirstLine = this.capitalise(documentDetails.relatedTo.event.eventType)
      this.eventSecondLine = documentDetails.relatedTo.event.mainOffence
    } else {
      this.eventFirstLine = 'Not attached to an event'
    }
    this.dateCreated = dayjs(documentDetails.dateCreated).format(config.dateShortFormat)
    this.dateSortValue = documentDetails.dateCreated
  }

  capitalise(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  }
}
