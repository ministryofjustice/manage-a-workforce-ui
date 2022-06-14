import { defineConfig } from 'cypress'
import { resetStubs } from './integration_tests/mockApis/allocation-wiremock'
import { resetWorkloadStubs } from './integration_tests/mockApis/workload-wiremock'
import auth from './integration_tests/mockApis/auth'
import tokenVerification from './integration_tests/mockApis/tokenVerification'
import allocations from './integration_tests/mockApis/allocations'
import probationRecord from './integration_tests/mockApis/probationRecord'
import risk from './integration_tests/mockApis/risk'
import allocateOffenderManagers from './integration_tests/mockApis/allocateOffenderManagers'
import allocationConfirm from './integration_tests/mockApis/allocationConfirm'
import overview from './integration_tests/mockApis/overview'
import allocationCase from './integration_tests/mockApis/allocationCase'
import offenderManagerCases from './integration_tests/mockApis/offenderManagerCases'
import staff from './integration_tests/mockApis/staff'
import allocationComplete from './integration_tests/mockApis/allocationComplete'
import person from './integration_tests/mockApis/person'

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests/fixtures',
  screenshotsFolder: 'integration_tests/screenshots',
  videosFolder: 'integration_tests/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  videoUploadOnPasses: false,
  taskTimeout: 60000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on) {
      on('task', {
        reset: () => resetStubs().then(() => resetWorkloadStubs()),
        ...auth,
        ...tokenVerification,
        ...allocations,
        ...probationRecord,
        ...risk,
        ...allocateOffenderManagers,
        ...allocationConfirm,
        ...overview,
        ...allocationCase,
        ...offenderManagerCases,
        ...staff,
        ...allocationComplete,
        ...person,
      })
    },
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'integration_tests/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration_tests/support/index.ts',
  },
})
