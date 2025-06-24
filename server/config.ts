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

  constructor(timeout) {
    this.timeout = timeout
  }
}

export interface ApiConfig {
  url: string
  timeout: {
    response: number
  }
  agent: AgentConfig
  retries?: number
}

export default {
  https: production,
  staticResourceCacheDuration: 20,
  redis: {
    host: get('REDIS_HOST', '127.0.0.1', requiredInProduction),
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
      url: get('HMPPS_AUTH_URL', 'http://127.0.0.1:9090/auth', requiredInProduction),
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://127.0.0.1:9090/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 1000)),
      },
      agent: new AgentConfig(1000),
      retries: 2,
      apiClientId: get('API_CLIENT_ID', 'manage-a-workforce-ui', requiredInProduction),
      apiClientSecret: get('API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    allocationsService: {
      url: get('ALLOCATIONS_SERVICE_URL', 'http://127.0.0.1:9091', requiredInProduction),
      timeout: {
        response: 10000,
      },
      agent: new AgentConfig(10000),
      retries: 2,
    },
    workloadService: {
      url: get('WORKLOAD_SERVICE_URL', 'http://127.0.0.1:9092', requiredInProduction),
      timeout: {
        response: 15000,
      },
      agent: new AgentConfig(15000),
    },
    probationEstateService: {
      url: get('PROBATION_ESTATE_SERVICE_URL', 'http://127.0.0.1:9093', requiredInProduction),
      timeout: {
        response: 3000,
      },
      agent: new AgentConfig(3000),
      retries: 2,
    },
    userPreferenceService: {
      url: get('USER_PREFERENCE_SERVICE_URL', 'http://127.0.0.1:9094', requiredInProduction),
      timeout: {
        response: 2000,
      },
      agent: new AgentConfig(2000),
      retries: 2,
    },
    staffLookupService: {
      url: get('STAFF_LOOKUP_SERVICE_URL', 'http://127.0.0.1:9095', requiredInProduction),
      timeout: {
        response: 5000,
      },
      agent: new AgentConfig(5000),
    },
    manageUsersService: {
      url: get('MANAGE_USERS_SERVICE_URL', 'http://127.0.0.1:9096', requiredInProduction),
      timeout: {
        response: 5000,
      },
      agent: new AgentConfig(5000),
    },
    tokenVerification: {
      url: get('TOKEN_VERIFICATION_API_URL', 'http://127.0.0.1:8100', requiredInProduction),
      timeout: {
        response: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 8000)),
      },
      agent: new AgentConfig(8000),
      enabled: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
    },
  },
  nav: {
    workloadMeasurement: {
      url: get('WORKLOAD_MEASUREMENT_URL', 'http://127.0.0.1:3010', requiredInProduction),
    },
  },
  domain: get('INGRESS_URL', 'http://127.0.0.1:3000', requiredInProduction),
  dateFormat: 'D MMMM YYYY',
  dateShortFormat: 'D MMM YYYY',
  casesAllocatedSinceDate: (): Date => {
    const sinceDate = new Date()
    sinceDate.setDate(sinceDate.getDate() - 30)
    return sinceDate
  },
  analytics: {
    tagManagerContainerId: get('TAG_MANAGER_CONTAINER_ID', null),
  },
  notification: {
    active: get('SHOW_NOTIFICATION', 'false'),
  },
  instrumentationKey: get('APPINSIGHTS_INSTRUMENTATIONKEY', null),
}
