import wiremock from './wiremock'

const url = 'http://localhost:9092/__admin'
const { stubFor: stubForWorkload, getRequests: getWorkloadRequests, resetStubs: resetWorkloadStubs } = wiremock(url)
export { stubForWorkload, getWorkloadRequests, resetWorkloadStubs }
