import 'dotenv/config'
import moment from 'moment-business-days'

const production = process.env.NODE_ENV === 'production'

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (!production || !options.requireInProduction) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

export class AgentConfig {
  timeout: number

  constructor(timeout = 8000) {
    this.timeout = timeout
  }
}

export interface ApiConfig {
  url: string
  timeout: {
    response: number
    deadline: number
  }
  agent: AgentConfig
}

export default {
  https: production,
  staticResourceCacheDuration: 20,
  redis: {
    host: get('REDIS_HOST', 'localhost', requiredInProduction),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
  },
  apis: {
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9090/auth', requiredInProduction),
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9090/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(),
      apiClientId: get('API_CLIENT_ID', 'manage-a-workforce-ui', requiredInProduction),
      apiClientSecret: get('API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    allocationsService: {
      url: get('ALLOCATIONS_SERVICE_URL', 'http://localhost:9091', requiredInProduction),
      timeout: {
        response: 15000,
        deadline: 15000,
      },
      agent: new AgentConfig(15000),
    },
    workloadService: {
      url: get('WORKLOAD_SERVICE_URL', 'http://localhost:9092', requiredInProduction),
      timeout: {
        response: 15000,
        deadline: 15000,
      },
      agent: new AgentConfig(15000),
    },
    probationEstateService: {
      url: get('PROBATION_ESTATE_SERVICE_URL', 'http://localhost:9093', requiredInProduction),
      timeout: {
        response: 15000,
        deadline: 15000,
      },
      agent: new AgentConfig(15000),
    },
    userPreferenceService: {
      url: get('USER_PREFERENCE_SERVICE_URL', 'http://localhost:9094', requiredInProduction),
      timeout: {
        response: 5000,
        deadline: 5000,
      },
      agent: new AgentConfig(5000),
    },
    tokenVerification: {
      url: get('TOKEN_VERIFICATION_API_URL', 'http://localhost:8100', requiredInProduction),
      timeout: {
        response: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(),
      enabled: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
    },
  },
  nav: {
    workloadMeasurement: {
      url: get('WORKLOAD_MEASUREMENT_URL', 'http://localhost:3010', requiredInProduction),
    },
  },
  domain: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
  dateFormat: 'D MMMM YYYY',
  currentDate: () => get('CURRENT_DATE', moment().format('YYYY-MM-DD')),
  googleAnalyticsKey: get('GOOGLE_ANALYTICS_KEY', null),
}
