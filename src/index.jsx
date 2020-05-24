import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store/index'
import history from './store/history'

import App from './App'

import 'styles/index.scss'
import pxlApi from 'pxl/Api'

render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('app-mount')
)

pxlApi.init()
