declare module 'forms' {
  export interface ConfirmInstructionForm {
    instructions?: string
    person: {
      email?: string
    }[]
    isSensitive: boolean
    emailCopyOptOut: boolean
  }
  export interface FindUnallocatedCasesForm {
    pdu?: string
    ldu?: string
    team?: string
  }

  export interface ReallocationCaseSummaryForm {
    reallocationNotes?: string
    reason?: string
  }

  export interface ConfirmReallocationForm {
    reallocationNotes?: string
    previousStaffCode: string
    reasonCode: string
    person: {
      email?: string
    }[]
    isSensitive: boolean
    emailPreviousOfficer: boolean
    nextAppointmentDate?: string
    lastOasysAssessmentDate?: string
    failureToComply?: string
  }
}
