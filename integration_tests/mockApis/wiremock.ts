import superagent, { SuperAgentRequest, Response } from 'superagent'

const wiremock = (url: string) => {
  const stubFor = (mapping: Record<string, unknown>): SuperAgentRequest =>
    superagent.post(`${url}/mappings`).send(mapping)

  const stubForScenario = (mappings): Promise<Array<Response>> =>
    Promise.all(mappings.map(mapping => superagent.post(`${url}/mappings`).send(mapping)))

  const getRequests = (): SuperAgentRequest => superagent.get(`${url}/requests`)

  const resetStubs = (): Promise<Array<Response>> =>
    Promise.all([
      superagent.delete(`${url}/mappings`),
      superagent.delete(`${url}/requests`),
      superagent.post(`${url}/scenarios/reset`),
    ])

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

  return { stubFor, getRequests, resetStubs, verifyRequest, stubForScenario }
}

const authUrl = 'http://127.0.0.1:9090/__admin'
const probationUrl = 'http://127.0.0.1:9093/__admin'
const allocationUrl = 'http://127.0.0.1:9091/__admin'
const workloadUrl = 'http://127.0.0.1:9092/__admin'
const userPreferenceUrl = 'http://127.0.0.1:9094/__admin'
const staffLookupUrl = 'http://127.0.0.1:9095/__admin'
const manageUsersLookupUrl = 'http://127.0.0.1:9096/__admin'

const { stubFor: stubForAuth, getRequests: getAuthRequests } = wiremock(authUrl)
export { stubForAuth, getAuthRequests }

const { stubFor: stubForManageUsers, resetStubs: resetManageUsersStubs } = wiremock(manageUsersLookupUrl)
export { stubForManageUsers, resetManageUsersStubs }

const { stubFor: stubForProbationEstate, resetStubs: resetProbationEstateStubs } = wiremock(probationUrl)
export { stubForProbationEstate, resetProbationEstateStubs }

const { stubFor: stubForLaoStatus, resetStubs: resetLaoStubs } = wiremock(allocationUrl)
export { stubForLaoStatus, resetLaoStubs }

const { stubFor: stubForLaoStatus403, resetStubs: resetLaoStubs403 } = wiremock(allocationUrl)
export { stubForLaoStatus403, resetLaoStubs403 }

const {
  stubFor: stubForAllocation,
  getRequests: getAllocationRequests,
  resetStubs: resetAllocationStubs,
} = wiremock(allocationUrl)
export { stubForAllocation, getAllocationRequests, resetAllocationStubs }

const {
  stubFor: stubForWorkload,
  resetStubs: resetWorkloadStubs,
  verifyRequest: verifyRequestForWorkload,
} = wiremock(workloadUrl)
export { stubForWorkload, resetWorkloadStubs, verifyRequestForWorkload }

const {
  stubFor: stubForUserPreference,
  getRequests: getUserPreferenceRequests,
  resetStubs: resetUserPreferenceStubs,
  verifyRequest: verifyRequestForUserPreference,
  stubForScenario: stubForUserPreferenceScenario,
} = wiremock(userPreferenceUrl)
export {
  stubForUserPreference,
  getUserPreferenceRequests,
  resetUserPreferenceStubs,
  verifyRequestForUserPreference,
  stubForUserPreferenceScenario,
}

const {
  stubFor: stubForStaffLookup,
  getRequests: getStaffLookupRequests,
  resetStubs: resetStaffLookupStubs,
} = wiremock(staffLookupUrl)
export { stubForStaffLookup, getStaffLookupRequests, resetStaffLookupStubs }
