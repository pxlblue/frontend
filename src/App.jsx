import React, { PureComponent } from 'react'
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route, Redirect } from 'react-router'
import { majorScale, Pane, Spinner, Heading, toaster } from 'evergreen-ui'
import { connect } from 'react-redux'

import Navbar from './components/Navbar'
import Index from 'pages/Index'
import Domains from 'pages/Domains'
import Login from 'pages/Login'
import Signup from 'pages/Signup'

import AccountIndex from 'pages/account/Index'

const mapRouteStateToProps = (state) => ({
  profile: state.root.profile,
  loggedIn: state.root.loggedIn,
})

const NewRoute = connect(mapRouteStateToProps)(
  ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) => {
        return <Component {...props} {...rest} />
      }}
    />
  )
)
const LoggedInRoute = connect(mapRouteStateToProps)(
  ({ component: Component, profile, loggedIn, ...rest }) => {
    if (!loggedIn) {
      return (
        <Route
          {...rest}
          render={(props) => {
            //toastr.error('Error', 'Please login before accessing this page.')
            toaster.danger('Not logged in', {
              description: 'Please login before accessing this page.',
            })
            return <Redirect to="/" />
          }}
        />
      )
    }
    return (
      <Route
        {...rest}
        render={(props) => {
          return (
            <Component
              {...props}
              profile={profile}
              loggedIn={loggedIn}
              {...rest}
            />
          )
        }}
      />
    )
  }
)

const mapStateToProps = (state) => ({
  profile: state.root.profile,
  loggedIn: state.root.loggedIn,
  realUser: state.root.realUser,
})

class App extends PureComponent {
  render() {
    const { loggedIn, realUser } = this.props
    if (loggedIn && !realUser) {
      return (
        <ConnectedRouter history={this.props.history}>
          <Navbar />
          <Pane
            marginLeft={majorScale(10)}
            marginRight={majorScale(10)}
            marginTop={majorScale(2)}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height={'100%'}
          >
            <Spinner size={56} />
            <Heading size={100}>Loading</Heading>
          </Pane>
        </ConnectedRouter>
      )
    }
    return (
      <ConnectedRouter
        history={this.props.history}
        /*className={classNames(styles.root)}*/
      >
        <Navbar />
        <Pane
          marginLeft={majorScale(10)}
          marginRight={majorScale(10)}
          marginTop={majorScale(2)}
        >
          <Switch>
            <Route exact path="/" component={Index} />
            <Route exact path="/domains" component={Domains} />

            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />

            <LoggedInRoute path="/account" component={AccountIndex} />
          </Switch>
        </Pane>
      </ConnectedRouter>
    )
  }
}
export default connect(mapStateToProps)(App)
