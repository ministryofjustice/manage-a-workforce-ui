import wiremock from './wiremock'

const url = 'http://localhost:9093/__admin'
const {
  stubFor: stubForProbationEstate,
  getRequests: getProbationEstateRequests,
  resetStubs: resetProbationEstateStubs,
} = wiremock(url)
export { stubForProbationEstate, getProbationEstateRequests, resetProbationEstateStubs }
