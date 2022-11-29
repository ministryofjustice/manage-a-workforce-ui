/* eslint-disable dot-notation */
import Agent, { HttpsAgent } from 'agentkeepalive'
import axios, { AxiosInstance } from 'axios'
import axiosRetry from 'axios-retry'

import logger from '../../logger'
import sanitiseError, { UnsanitisedError } from '../sanitisedError'
import { ApiConfig } from '../config'
import FileDownload from '../models/FileDownload'

interface GetRequest {
  path?: string
  query?: string
  headers?: Record<string, string>
  responseType?: string
  raw?: boolean
}

interface PostRequest {
  path?: string
  headers?: Record<string, string>
  responseType?: string
  data?: Record<string, unknown>
  raw?: boolean
}

interface PutRequest {
  path?: string
  headers?: Record<string, string>
  data?: Record<string, unknown>
}

interface StreamRequest {
  path?: string
  headers?: Record<string, string>
  errorLogger?: (e: UnsanitisedError) => void
}

export default class RestClient {
  agent: Agent

  axiosClient: AxiosInstance

  constructor(private readonly name: string, private readonly config: ApiConfig, private readonly token: string) {
    this.agent = config.url.startsWith('https') ? new HttpsAgent(config.agent) : new Agent(config.agent)
    this.axiosClient = axios.create({
      baseURL: config.url,
      timeout: config.timeout.response,
      httpsAgent: this.agent,
      httpAgent: this.agent,
    })
    axiosRetry(this.axiosClient, { retries: config.retries })
  }

  private apiUrl() {
    return this.config.url
  }

  private timeoutConfig() {
    return this.config.timeout
  }

  async get({ path }: GetRequest): Promise<unknown> {
    try {
      const result = await this.axiosClient.get(`${this.apiUrl()}${path}`, {
        headers: { 'Accept-Encoding': 'application/json', Authorization: `Bearer ${this.token}` },
      })
      return result.data
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: 'GET'`)
      throw sanitisedError
    }
  }

  async post({ path, data }: PostRequest = {}): Promise<unknown> {
    try {
      const result = await this.axiosClient.post(`${this.apiUrl()}${path}`, data, {
        headers: { 'Accept-Encoding': 'application/json', Authorization: `Bearer ${this.token}` },
      })
      return result.data
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: 'POST'`)
      throw sanitisedError
    }
  }

  async put({ path = null, data = {} }: PutRequest = {}): Promise<unknown> {
    try {
      return this.axiosClient.put(path, data, {
        headers: { 'Accept-Encoding': 'application/json', Authorization: `Bearer ${this.token}` },
      })
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: 'PUT'`)
      throw sanitisedError
    }
  }

  stream({ path = null, headers = {} }: StreamRequest = {}): Promise<FileDownload> {
    logger.info(`Get using user credentials: calling ${this.name}: ${path}`)
    return this.axiosClient
      .get(path, {
        headers: { ...headers, Authorization: `Bearer ${this.token}` },
        responseType: 'stream',
      })
      .then(response => {
        return new FileDownload(response.data, new Map(Object.entries(response.headers)))
      })
  }
}
