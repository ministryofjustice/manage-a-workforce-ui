import { defineConfig } from 'cypress'
import plugins from './plugins'

export default defineConfig({
  chromeWebSecurity: false,
  viewportWidth: 1280,
  viewportHeight: 750,
  fixturesFolder: 'integration_tests/fixtures',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  screenshotsFolder: 'integration_tests/screenshots',
  e2e: {
    baseUrl: 'http://127.0.0.1:3007',
    specPattern: 'integration_tests/integration/*.spec.ts',
    setupNodeEvents: plugins,
    supportFile: 'integration_tests/support/index.ts',
    experimentalRunAllSpecs: true,
  },
  videosFolder: 'integration_tests/videos',
})
