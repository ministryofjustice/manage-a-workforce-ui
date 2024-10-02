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
}
