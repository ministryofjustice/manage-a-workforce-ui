import superagent, { SuperAgentRequest, Response } from 'superagent'

const url = 'http://localhost:9093/__admin'

const stubForProbationEstate = (mapping: Record<string, unknown>): SuperAgentRequest =>
  superagent.post(`${url}/mappings`).send(mapping)

const getProbationEstateRequests = (): SuperAgentRequest => superagent.get(`${url}/requests`)

const resetProbationEstateStubs = (): Promise<Array<Response>> =>
  Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])

export { stubForProbationEstate, getProbationEstateRequests, resetProbationEstateStubs }
