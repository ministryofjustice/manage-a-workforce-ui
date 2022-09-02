import superagent, { SuperAgentRequest, Response } from 'superagent'

const wiremock = (url: string) => {
  const stubFor = (mapping: Record<string, unknown>): SuperAgentRequest =>
    superagent.post(`${url}/mappings`).send(mapping)

  const getRequests = (): SuperAgentRequest => superagent.get(`${url}/requests`)

  const resetStubs = (): Promise<Array<Response>> =>
    Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])

  return { stubFor, getRequests, resetStubs }
}

export default wiremock

const probationUrl = 'http://localhost:9093/__admin'
const {
  stubFor: stubForProbationEstate,
  getRequests: getProbationEstateRequests,
  resetStubs: resetProbationEstateStubs,
} = wiremock(probationUrl)
export { stubForProbationEstate, getProbationEstateRequests, resetProbationEstateStubs }

const allocationUrl = 'http://localhost:9091/__admin'
const { stubFor, getRequests, resetStubs } = wiremock(allocationUrl)
export { stubFor, getRequests, resetStubs }

const workloadUrl = 'http://localhost:9092/__admin'
const {
  stubFor: stubForWorkload,
  getRequests: getWorkloadRequests,
  resetStubs: resetWorkloadStubs,
} = wiremock(workloadUrl)
export { stubForWorkload, getWorkloadRequests, resetWorkloadStubs }
