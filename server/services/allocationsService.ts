import { NextFunction, Request, Response } from 'express'
import https from 'https'
import RestClient from '../data/restClient'
import logger from '../../logger'
import { ApiConfig } from '../config'
import Allocation from '../models/allocation'
import ProbationRecord from '../models/probationRecord'
import Risk from '../models/risk'
import AllocateOffenderManagers from '../models/allocateOffenderManagers'
import OffenderManagerPotentialWorkload from '../models/OffenderManagerPotentialWorkload'
import OffenderManagerOverview from '../models/offenderManagerOverview'

export default class AllocationsService {
  config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  private restClient(token: string): RestClient {
    return new RestClient('Allocations Service API Client', this.config, token)
  }

  async getUnallocatedCases(token: string): Promise<Allocation[]> {
    logger.info(`Getting unallocated cases`)
    return (await this.restClient(token).get({
      path: `/cases/unallocated`,
      headers: { Accept: 'application/json' },
    })) as Allocation[]
  }

  async getUnallocatedCase(token: string, crn, convictionId): Promise<Allocation> {
    logger.info(`Getting unallocated case for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/convictions/${convictionId}`,
      headers: { Accept: 'application/json' },
    })) as Allocation
  }

  async getProbationRecord(token: string, crn, convictionId): Promise<ProbationRecord> {
    logger.info(`Getting probation record for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/convictions?excludeConvictionId=${convictionId}`,
      headers: { Accept: 'application/json' },
    })) as ProbationRecord
  }

  async getRisk(token: string, crn, convictionId): Promise<Risk> {
    logger.info(`Getting risk for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/convictions/${convictionId}/risks`,
      headers: { Accept: 'application/json' },
    })) as Risk
  }

  async getOffenderManagersToAllocate(token: string, crn, convictionId): Promise<AllocateOffenderManagers> {
    logger.info(`Getting offender managers to allocate for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/${crn}/convictions/${convictionId}/allocate/offenderManagers`,
      headers: { Accept: 'application/json' },
    })) as AllocateOffenderManagers
  }

  async getCaseAllocationImpact(
    token: string,
    crn,
    offenderManagerCode,
    convictionId
  ): Promise<OffenderManagerPotentialWorkload> {
    logger.info(`Getting case allocation impact for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/${crn}/convictions/${convictionId}/allocate/${offenderManagerCode}/impact`,
      headers: { Accept: 'application/json' },
    })) as OffenderManagerPotentialWorkload
  }

  async getOffenderManagerOverview(
    token: string,
    crn,
    offenderManagerCode,
    convictionId
  ): Promise<OffenderManagerOverview> {
    logger.info(`Getting offender manager overview for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/${crn}/convictions/${convictionId}/allocate/${offenderManagerCode}/overview`,
      headers: { Accept: 'application/json' },
    })) as OffenderManagerOverview
  }

  getDocument(req: Request, res: Response, next: NextFunction, token: string, crn, convictionId, documentId) {
    logger.info(`Getting document for crn ${crn}`)
    // eslint-disable-next-line dot-notation
    req.headers['Authorization'] = `Bearer ${token}`
    const options = {
      host: this.config.url,
      path: `/cases/unallocated/${crn}/convictions/${convictionId}/documents/${documentId}`,
      method: 'GET',
      headers: req.headers,
    }

    const creq = https
      .request(options, proxyResponse => {
        // set encoding
        proxyResponse.setEncoding('utf8')

        // set http status code based on proxied response
        res.writeHead(proxyResponse.statusCode, proxyResponse.headers)

        // wait for data
        proxyResponse.on('data', chunk => {
          res.write(chunk)
        })

        proxyResponse.on('close', () => {
          // closed, let's end client request as well
          next()
        })

        proxyResponse.on('end', () => {
          // finished, let's finish client request as well
          next()
        })
      })
      .on('error', e => {
        next(e)
      })

    creq.end()
  }
}
