import { defineConfig } from 'cypress'
import plugins from './plugins'

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests/fixtures',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  screenshotsFolder: 'integration_tests/screenshots',
  e2e: {
    baseUrl: 'http://localhost:3007',
    specPattern: 'integration_tests/integration/*.spec.ts',
    setupNodeEvents: plugins,
    supportFile: 'integration_tests/support/index.ts',
  },
  videosFolder: 'integration_tests/videos',
  videoUploadOnPasses: false,
})
