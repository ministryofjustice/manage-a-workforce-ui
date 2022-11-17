export default interface DocumentDetails {
  id: string
  name: string
  relatedTo: {
    description: string
    type: string
    name: string
    event?: {
      eventType: string
      eventNumber: string
      mainOffence: string
    }
  }
  dateCreated: string
  sensitive: boolean
}
