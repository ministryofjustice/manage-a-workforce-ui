import superagent, { SuperAgentRequest, Response } from 'superagent'

export default (url: string) => {
  const stubFor = (mapping: Record<string, unknown>): SuperAgentRequest =>
    superagent.post(`${url}/mappings`).send(mapping)

  const getRequests = (): SuperAgentRequest => superagent.get(`${url}/requests`)

  const resetStubs = (): Promise<Array<Response>> =>
    Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])

  return { stubFor, getRequests, resetStubs }
}
