import superagent, { SuperAgentRequest, Response } from 'superagent'

const url = 'http://localhost:9092/__admin'

const stubForWorkload = (mapping: Record<string, unknown>): SuperAgentRequest =>
  superagent.post(`${url}/mappings`).send(mapping)

const getWorkloadRequests = (): SuperAgentRequest => superagent.get(`${url}/requests`)

const resetWorkloadStubs = (): Promise<Array<Response>> =>
  Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])

export { stubForWorkload, getWorkloadRequests, resetWorkloadStubs }
