import type { AxiosError } from 'axios'

export interface SanitisedError extends Error {
  status?: number
  stack: string
  message: string
  name: string
}

export type UnsanitisedError = AxiosError

export default function sanitise(error: UnsanitisedError): SanitisedError {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.message,
      stack: error.stack,
      name: error.name,
    }
  }
  return {
    message: error.message,
    stack: error.stack,
    name: error.name,
  }
}
