import React, { PureComponent } from 'react'
import {
  Pane,
  Heading,
  Text,
  TabNavigation,
  SidebarTab,
  majorScale,
  defaultTheme,
  UserIcon,
  CameraIcon,
} from 'evergreen-ui'
import { Link, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import AdminHome from './Home'
import AdminUsers from './Users'
import AdminInvites from './Invites'
import AdminImages from './Images'
const mapStateToProps = (state) => ({
  pathname: state.router.location.pathname,
  profile: state.root.profile,
  loggedIn: state.root.loggedIn,
  realUser: state.root.realUser,
})

class AdminIndex extends PureComponent {
  render() {
    const { profile, loggedIn, pathname } = this.props
    return (
      <Pane>
        <Heading size={800}>Admin Dashboard</Heading>
        <Text>Logged in as {profile.username}</Text>
        <Pane
          display="flex"
          flexDirection="row"
          width={'100%'}
          marginTop={majorScale(4)}
          marginLeft={majorScale(2)}
        >
          <TabNavigation width={'20%'}>
            <SidebarTab
              is={Link}
              to="/admin"
              isSelected={pathname.match(/^\/admin$/gi) && true}
            >
              Admin
            </SidebarTab>
            <SidebarTab
              is={Link}
              to="/admin/users"
              isSelected={pathname.match(/^\/admin\/users$/gi) && true}
            >
              Users
            </SidebarTab>
            <SidebarTab
              is={Link}
              to="/admin/invites"
              isSelected={pathname.match(/^\/admin\/invites$/gi) && true}
            >
              Invites
            </SidebarTab>
            <SidebarTab
              is={Link}
              to="/admin/images"
              isSelected={pathname.match(/^\/admin\/images$/gi) && true}
            >
              Images
            </SidebarTab>
          </TabNavigation>
          <Pane marginLeft={majorScale(4)} width={'100%'}>
            <Switch>
              <Route exact path="/admin" component={AdminHome} />
              <Route exact path="/admin/users" component={AdminUsers} />
              <Route exact path="/admin/invites" component={AdminInvites} />
              <Route exact path="/admin/images" component={AdminImages} />
            </Switch>
          </Pane>
        </Pane>
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(AdminIndex)
