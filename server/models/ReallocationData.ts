export default interface ReallocationData {
  token: string
  crn: string
  previousStaffCode: string
  emailPreviousOfficer: boolean
  staffCode: string
  teamCode: string
  emailTo: string[]
  reallocationNotes: string
  sensitiveNotes: boolean
  laoCase: boolean
  allocationReason: string
  nextAppointmentDate: string
  lastOasysAssessmentDate: string
  failureToComply: string
}
