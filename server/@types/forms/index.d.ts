declare module 'forms' {
  export interface ConfirmInstructionForm {
    instructions?: string
    person: {
      email?: string
    }[]
  }
}
