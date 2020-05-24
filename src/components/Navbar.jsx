import React, { PureComponent } from 'react'
import {
  majorScale,
  Heading,
  Pane,
  TabNavigation,
  Tab,
  Text,
} from 'evergreen-ui'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  pathname: state.router.location.pathname,
  profile: state.root.profile,
  loggedIn: state.root.loggedIn,
  realUser: state.root.realUser,
})

class Navbar extends PureComponent {
  render() {
    const { pathname, profile, loggedIn } = this.props
    return (
      <Pane
        borderBottom="muted"
        marginBottom={5}
        display="flex"
        flexDirection="row"
        alignItems="center"
      >
        <Heading
          size={700}
          marginTop={0}
          marginLeft={majorScale(10)}
          marginBottom={10}
        >
          pxl
        </Heading>
        <TabNavigation marginLeft={majorScale(4)} marginBottom={7}>
          <Tab is={Link} to="/" isSelected={pathname.match(/^\/$/gi) && true}>
            Home
          </Tab>
          <Tab
            is={Link}
            to="/domains"
            isSelected={pathname.match(/^\/domains$/gi) && true}
          >
            Domains
          </Tab>
          <Tab is="a" href="https://api.pxl.blue/discord" target="_blank">
            Discord
          </Tab>
        </TabNavigation>
        <Pane flexGrow={1} />
        <Pane marginRight={majorScale(10)} marginBottom={7}>
          {!loggedIn && (
            <TabNavigation marginLeft={majorScale(4)}>
              <Tab
                is={Link}
                to="/login"
                isSelected={pathname.match(/^\/login$/gi) && true}
              >
                Login
              </Tab>
              <Tab
                is={Link}
                to="/signup"
                isSelected={pathname.match(/^\/signup$/gi) && true}
              >
                Sign Up
              </Tab>
            </TabNavigation>
          )}
          {loggedIn && (
            <TabNavigation marginLeft={majorScale(4)}>
              <Tab
                is={Link}
                to="/account"
                isSelected={pathname.match(/^\/account/gi) && true}
              >
                Account
              </Tab>
              {profile.moderator && (
                <Tab
                  is={Link}
                  to="/mod"
                  isSelected={pathname.match(/^\/mod/gi) && true}
                >
                  Moderator
                </Tab>
              )}
              {profile.admin && (
                <Tab
                  is={Link}
                  to="/admin"
                  isSelected={pathname.match(/^\/admin/gi) && true}
                >
                  Admin
                </Tab>
              )}
            </TabNavigation>
          )}
        </Pane>
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(Navbar)
