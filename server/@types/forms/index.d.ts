declare module 'forms' {
  export interface ConfirmInstructionForm {
    instructions?: string
    person: {
      email?: string
    }[]
  }
  export interface FindUnallocatedCasesForm {
    pdu?: string
    ldu?: string
    team?: string
  }
}
