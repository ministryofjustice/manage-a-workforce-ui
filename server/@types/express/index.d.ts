import type { ConfirmInstructionForm } from 'forms'

export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    name: string
    crn: string
    tier: string
    probationStatus: string
    offenderManager: object
    casesLength: number
    confirmInstructionForm: ConfirmInstructionForm
  }
}

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
      flash(type: string, message: Array<Record<string, string>>): number
      flash(message: 'errors'): Array<Record<string, string>>
    }
  }

  export interface Response {
    locals: {
      cspNonce: string
    }
  }
}
