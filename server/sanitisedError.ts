import type { AxiosError } from 'axios'

export interface SanitisedError extends Error {
  status?: number
  stack: string
  message: string
  name: string
  url: string
  method: string
}

export type UnsanitisedError = AxiosError

export default function sanitise(error: UnsanitisedError): SanitisedError {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.message,
      stack: error.stack,
      name: error.name,
      url: error.config.url,
      method: error.config.method,
    }
  }
  return {
    message: error.message,
    stack: error.stack,
    name: error.name,
    url: error.config.url,
    method: error.config.method,
  }
}
