export default interface RoshRisk {
  overallRisk: string
  assessedOn: string
  riskInCommunity: {
    [k: string]: string
  }
}
