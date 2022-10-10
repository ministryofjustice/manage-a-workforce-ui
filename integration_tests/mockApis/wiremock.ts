import superagent, { SuperAgentRequest, Response } from 'superagent'

const wiremock = (url: string) => {
  const stubFor = (mapping: Record<string, unknown>): SuperAgentRequest =>
    superagent.post(`${url}/mappings`).send(mapping)

  const getRequests = (): SuperAgentRequest => superagent.get(`${url}/requests`)

  const resetStubs = (): Promise<Array<Response>> =>
    Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])

  const verifyRequest = ({
    requestUrl,
    requestUrlPattern,
    method,
    body,
    queryParameters,
  }: {
    requestUrl?: string
    requestUrlPattern?: string
    method: string
    body?: unknown
    queryParameters?: unknown
  }): SuperAgentRequest => {
    const bodyPatterns =
      (body && {
        bodyPatterns: [{ equalToJson: JSON.stringify(body) }],
      }) ||
      {}
    return superagent.post(`${url}/requests/count`).send({
      method,
      urlPattern: requestUrlPattern,
      url: requestUrl,
      ...bodyPatterns,
      queryParameters,
    })
  }

  return { stubFor, getRequests, resetStubs, verifyRequest }
}

const probationUrl = 'http://127.0.0.1:9093/__admin'
const allocationUrl = 'http://127.0.0.1:9091/__admin'
const workloadUrl = 'http://127.0.0.1:9092/__admin'
const userPreferenceUrl = 'http://127.0.0.1:9094/__admin'

const {
  stubFor: stubForProbationEstate,
  getRequests: getProbationEstateRequests,
  resetStubs: resetProbationEstateStubs,
} = wiremock(probationUrl)
export { stubForProbationEstate, getProbationEstateRequests, resetProbationEstateStubs }

const {
  stubFor: stubForAllocation,
  getRequests: getAllocationRequests,
  resetStubs: resetAllocationStubs,
} = wiremock(allocationUrl)
export { stubForAllocation, getAllocationRequests, resetAllocationStubs }

const {
  stubFor: stubForWorkload,
  getRequests: getWorkloadRequests,
  resetStubs: resetWorkloadStubs,
} = wiremock(workloadUrl)
export { stubForWorkload, getWorkloadRequests, resetWorkloadStubs }

const {
  stubFor: stubForUserPreference,
  getRequests: getUserPreferenceRequests,
  resetStubs: resetUserPreferenceStubs,
  verifyRequest: verifyRequestForUserPreference,
} = wiremock(userPreferenceUrl)
export { stubForUserPreference, getUserPreferenceRequests, resetUserPreferenceStubs, verifyRequestForUserPreference }
