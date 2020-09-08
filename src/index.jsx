import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store/index'
import history from './store/history'

import App from './App'

import 'styles/index.scss'
import pxlApi from 'pxl/Api'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    /*navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered', registration)
      })
      .catch((registrationError) => {
        console.error('SW registration failed', registrationError)
      })*/
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister()
      }
    })
  })
}

render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('app-mount')
)

pxlApi.init()
