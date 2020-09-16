import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import store from './store/index'
import history from './store/history'

import App from './App'

import 'typeface-inter'
import 'styles/index.scss'
import pxlApi from 'pxl/Api'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered', registration)
      })
      .catch((registrationError) => {
        console.error('SW registration failed', registrationError)
      })
  })
}

Sentry.init({
  dsn: DSN,
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
    }),
  ],
  tracesSampleRate: 1.0,
  release: 'frontend@' + RELEASE,
})

render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('app-mount')
)

pxlApi.init()
