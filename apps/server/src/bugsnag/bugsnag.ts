import Bugsnag from '@bugsnag/js'
import BugsnagPluginExpress from '@bugsnag/plugin-express'

Bugsnag.start({
  apiKey: process.env.BUGSNAG_KEY || '1a33a03202febef0248d4e0c63c0b9f4',
  plugins: [BugsnagPluginExpress],
  releaseStage: process.env.ENVIRONMENT,
  enabledReleaseStages: ['production', 'staging'],
  appVersion: '0.4.0'
})

export { Bugsnag }


