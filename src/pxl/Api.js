import store from 'store/index'
import { login, logout } from 'actions'
import { toaster } from 'evergreen-ui'
import * as Sentry from '@sentry/react'

//const API_BASE = 'http://localhost:3000'
//const API_BASE = 'https://api.pxl.blue'
const API_BASE = S_API_BASE
class PxlApi {
  constructor() {
    this.session = ''
    if (localStorage.getItem('session')) {
      this.session = localStorage.getItem('session')
    }
    this.base = API_BASE
  }

  setSession(session) {
    this.session = session
  }

  /**
   * Make an HTTP request to the pxl.blue api
   * @param {string} method - get, post, put, patch, etc.
   * @param {string} endpoint - part after the slash
   * @param {boolean} requiresAuth - whether the request requires authentication
   * @param {object} [body] - body of the request in js object
   */
  async http(method, endpoint, requiresAuth, body) {
    let opts = {
      headers: {
        'User-Agent': 'pxlblue-frontend/1.0',
      },
      method: method.toUpperCase(),
    }
    if (method !== 'GET' && body) {
      opts.headers['Content-Type'] = 'application/json'
      opts.body = JSON.stringify(body)
    }
    if (requiresAuth) {
      opts.headers['Authorization'] = this.session
    }
    let resp = await fetch(`${API_BASE}${endpoint}`, opts)
    let res = await resp.json()
    return res
  }

  /**
   * make a get request
   * @param {string} endpoint - part after the slash
   * @param {boolean} [requiresAuth=true] - does the endpoint require auth? (send auth header)
   */
  async http_get(endpoint, requiresAuth = true) {
    return this.http('get', endpoint, requiresAuth)
  }

  /**
   * make a post request
   * @param {string} endpoint - part after the slash
   * @param {boolean} [requiresAuth=true] - does the endpoint require auth? (send auth header)
   * @param {object} [body] - body of the request
   */
  async http_post(endpoint, requiresAuth = true, body) {
    return this.http('post', endpoint, requiresAuth, body)
  }

  /**
   * make a patch request
   * @param {string} endpoint - part after the slash
   * @param {boolean} [requiresAuth=true] - does the endpoint require auth? (send auth header)
   * @param {object} [body] - body of the request
   */
  async http_patch(endpoint, requiresAuth = true, body) {
    return this.http('patch', endpoint, requiresAuth, body)
  }

  async signup(username, email, password, invite) {
    let res = await this.http_post('/auth/register', false, {
      username,
      email,
      password,
      invite,
    })

    return res
  }

  async login(username, password, rememberMe) {
    let res = await this.http_post('/auth/login', false, {
      username,
      password,
      rememberMe,
    })

    if (!res.success) return res
    this.setSession(res.session)
    let me = await this.getMe()

    localStorage.setItem('session', res.session)
    localStorage.setItem('user', JSON.stringify(me))
    localStorage.setItem('loggedIn', 'true')
    store.dispatch(login(res.session, me))
    return res
  }

  async getMe() {
    let res = await this.http_get('/users/@me', true)
    if (!res.success) {
      toaster.danger('Error occurred while logging in', {
        description: res.errors.join('\n'),
      })
      localStorage.removeItem('loggedIn')
      localStorage.removeItem('user')
      store.dispatch(logout())
      //location.reload() likely dont need this, the issue was with App being a PureComponent.
      // TODO: turns out thats still a fucking issue, resolve login issues
    }
    Sentry.setContext('user', res.user)

    store.dispatch(login(this.session, res.user))
    return res.user
  }

  async logout() {
    localStorage.removeItem('loggedIn')
    localStorage.removeItem('user')
    toaster.success('logged out successfully')
    return store.dispatch(logout())
  }

  async getInvites() {
    let res = await this.http_get('/users/@me/invites', true)
    if (!res.success) {
      toaster.danger('Failed to fetch invites', {
        description: res.errors.join('\n'),
      })
      return {}
    }
    return res
  }

  async createInvite() {
    let res = await this.http_post('/users/@me/invites', true)
    if (!res.success) {
      toaster.danger('Failed to create invite', {
        description: res.errors.join('\n'),
      })
      return {}
    }
    return res.invite
  }

  async init() {
    if (localStorage.getItem('loggedIn')) {
      if (localStorage.getItem('loggedIn') === 'true') {
        let me = await this.getMe()
        if (me) {
          store.dispatch(login(this.session, me))
        }
      }
    }
  }

  async getDomains() {
    let res = await this.http_get('/domains', false)
    if (!res.success) {
      toaster.danger('Failed to get domains list', {
        description: res.errors.join('\n'),
      })
      return []
    }
    return res.domains
  }
}

const pxlApi = new PxlApi()
export default pxlApi
