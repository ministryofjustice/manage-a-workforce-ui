export default interface ReallocationData {
  token: string
  crn: string
  previousStaffCode: string
  newStaffCode: string
  teamCode: string
  emailPreviousOfficer: boolean
  emailTo: string[]
  reallocationNotes: string
  sensitiveNotes: boolean
  laoCase: boolean
  allocationReason: string
}
