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

  export interface ReallocationChoosePractitionerForm {
    allocatedOfficer?: string
    reallocationNotes?: string
    reason?: string
  }

  export interface ConfirmReallocationForm {
    reallocationNotes?: string
    previousStaffCode: string
    person: {
      email?: string
    }[]
    isSensitive: boolean
    emailPreviousOfficer: boolean
  }

  export interface CurrentOffenderManagerForm {
    code: string
    forenames: string
    surname: string
    grade: string
  }
}
