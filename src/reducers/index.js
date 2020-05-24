import { LOGIN, LOGOUT } from 'constants/actionTypes'

let loggedIn = localStorage.getItem('loggedIn') === 'true'
let profile = null
if (loggedIn) {
  profile = JSON.parse(localStorage.getItem('user'))
}
const initialState = {
  loggedIn,
  session: null,
  profile,
  realUser: false,
}

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        session: action.payload.session,
        profile: action.payload.profile,
        loggedIn: true,
        realUser: true,
      }
    case LOGOUT:
      return {
        ...state,
        profile: null,
        loggedIn: false,
        realUser: false,
        session: null,
      }
    default:
      return state
  }
}
export default rootReducer
