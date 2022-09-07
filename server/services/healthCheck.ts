import { serviceCheckFactory } from '../data/healthCheck'
import config from '../config'
import type { AgentConfig } from '../config'

interface HealthCheckStatus {
  name: string
  status: string
  message: unknown
}

interface HealthCheckResult extends Record<string, unknown> {
  healthy: boolean
  checks: Record<string, unknown>
}

export type HealthCheckService = () => Promise<HealthCheckStatus>
export type HealthCheckCallback = (result: HealthCheckResult) => void

function service(name: string, url: string, agentConfig: AgentConfig): HealthCheckService {
  return async () => {
    try {
      const result = await serviceCheckFactory(name, url, agentConfig)()
      return { name, status: 'ok', message: result }
    } catch (err) {
      return { name, status: 'ERROR', message: err }
    }
  }
}

function addAppInfo(result: HealthCheckResult): HealthCheckResult {
  const buildInformation = getBuild()
  const buildInfo = {
    uptime: process.uptime(),
    build: buildInformation,
    version: buildInformation && buildInformation.buildNumber,
  }

  return { ...result, ...buildInfo }
}

function getBuild() {
  try {
    // eslint-disable-next-line import/no-unresolved,global-require
    return require('../../build-info.json')
  } catch (ex) {
    return null
  }
}

function gatherCheckInfo(aggregateStatus: Record<string, unknown>, currentStatus: HealthCheckStatus) {
  return { ...aggregateStatus, [currentStatus.name]: currentStatus.message }
}

const apiChecks = [
  service('hmppsAuth', `${config.apis.hmppsAuth.url}/health/ping`, config.apis.hmppsAuth.agent),
  ...(config.apis.tokenVerification.enabled
    ? [
        service(
          'tokenVerification',
          `${config.apis.tokenVerification.url}/health/ping`,
          config.apis.tokenVerification.agent
        ),
      ]
    : []),
]

export default async function healthCheck(callback: HealthCheckCallback, checks = apiChecks): Promise<void> {
  const checkResults = await Promise.all(checks.map(fn => fn()))
  const healthy = checkResults.every(item => item.status === 'ok')
  const result = {
    healthy,
    checks: checkResults.reduce(gatherCheckInfo, {}),
  }

  callback(addAppInfo(result))
}
