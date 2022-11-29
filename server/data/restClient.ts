/* eslint-disable dot-notation */
import superagent from 'superagent'
import Agent, { HttpsAgent } from 'agentkeepalive'
import axios, { AxiosInstance } from 'axios'
import axiosRetry from 'axios-retry'

import logger from '../../logger'
import sanitiseError from '../sanitisedError'
import { ApiConfig } from '../config'
import type { UnsanitisedError } from '../sanitisedError'
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
    })
    axiosRetry(this.axiosClient, { retries: config.retries })
  }

  private apiUrl() {
    return this.config.url
  }

  private timeoutConfig() {
    return this.config.timeout
  }

  async get({ path = null, query = '', responseType = '' }: GetRequest): Promise<unknown> {
    try {
      const result = await superagent
        .get(`${this.apiUrl()}${path}`)
        .agent(this.agent)
        .query(query)
        .auth(this.token, { type: 'bearer' })
        .set({ Accept: 'application/json' })
        .responseType(responseType)
        .retry(this.config.retries)
        .timeout(this.timeoutConfig())

      return result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError, query }, `Error calling ${this.name}, path: '${path}', verb: 'GET'`)
      throw sanitisedError
    }
  }

  async post({
    path = null,
    headers = {},
    responseType = '',
    data = {},
    raw = false,
  }: PostRequest = {}): Promise<unknown> {
    logger.info(`Post using user credentials: calling ${this.name}: ${path}`)
    try {
      const result = await superagent
        .post(`${this.apiUrl()}${path}`)
        .send(data)
        .agent(this.agent)
        .auth(this.token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      return raw ? result : result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: 'POST'`)
      throw sanitisedError
    }
  }

  async put({ path = null, data = {} }: PutRequest = {}): Promise<unknown> {
    try {
      return this.axiosClient.put(path, data, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${this.token}` },
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
