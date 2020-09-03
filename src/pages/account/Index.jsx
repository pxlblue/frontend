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

import AccountShareX from './ShareX'
import AccountDiscord from './Discord'
import AccountMail from './Mail'
import AccountInvites from './Invites'
import AccountImageNuke from './ImageNuke'
import AccountImages from './Images'
import AccountHome from './Home'
import AccountRedeem from './Redeem'

const mapStateToProps = (state) => ({
  pathname: state.router.location.pathname,
  profile: state.root.profile,
  loggedIn: state.root.loggedIn,
  realUser: state.root.realUser,
})

class AccountIndex extends PureComponent {
  render() {
    const { profile, loggedIn, pathname } = this.props
    return (
      <Pane>
        <Heading size={800}>Account Dashboard</Heading>
        <Text>Logged in as {profile.username}</Text>
        <Pane display="flex" flexDirection="row" width="100%">
          <Pane
            elevation={1}
            width={'20%'}
            height={80}
            padding={majorScale(2)}
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
            <UserIcon
              color={defaultTheme.colors.icon.info}
              size={majorScale(6)}
            />
            <Pane marginLeft={majorScale(1)}>
              <Text>{profile.id}</Text>
              <Heading size={100}>User ID</Heading>
            </Pane>
          </Pane>
          <Pane
            elevation={1}
            width={'20%'}
            height={80}
            padding={majorScale(2)}
            display="flex"
            flexDirection="row"
            alignItems="center"
            marginLeft={majorScale(6)}
          >
            <CameraIcon
              color={defaultTheme.colors.icon.success}
              size={majorScale(6)}
            />
            <Pane marginLeft={majorScale(1)}>
              <Text>{profile.imageCount.toString()}</Text>
              <Heading size={100}>Images Uploaded</Heading>
            </Pane>
          </Pane>
        </Pane>
        <Pane
          display="flex"
          flexDirection="row"
          width={'100%'}
          marginTop={majorScale(4)}
          marginLeft={majorScale(2)}
        >
          <TabNavigation width={'25%'}>
            <SidebarTab
              is={Link}
              to="/account"
              isSelected={pathname.match(/^\/account\/?$/gi) && true}
            >
              Account
            </SidebarTab>
            <SidebarTab
              is={Link}
              to="/account/discord"
              isSelected={pathname.match(/^\/account\/discord\/?$/gi) && true}
            >
              Discord
            </SidebarTab>
            <SidebarTab
              is={Link}
              to="/account/redeem"
              isSelected={pathname.match(/^\/account\/redeem\/?$/gi) && true}
            >
              Redeem
            </SidebarTab>
            <SidebarTab
              is={Link}
              to="/account/mail"
              isSelected={pathname.match(/^\/account\/mail\/?$/gi) && true}
            >
              E-mail
            </SidebarTab>

            <Heading size={300}>Images</Heading>
            <SidebarTab
              is={Link}
              to="/account/images"
              isSelected={pathname.match(/^\/account\/images\/?$/gi) && true}
            >
              Images
            </SidebarTab>
            <SidebarTab
              is={Link}
              to="/account/images/nuke"
              isSelected={
                pathname.match(/^\/account\/images\/nuke\/?$/gi) && true
              }
            >
              Nuke
            </SidebarTab>

            <Heading size={300}>Invites</Heading>
            <SidebarTab
              is={Link}
              to="/account/invites"
              isSelected={pathname.match(/^\/account\/invites\/?$/gi) && true}
            >
              Invites
            </SidebarTab>

            <Heading size={300}>Upload</Heading>
            <SidebarTab
              is={Link}
              to="/account/sharex"
              isSelected={pathname.match(/^\/account\/sharex\/?$/gi) && true}
            >
              ShareX
            </SidebarTab>
          </TabNavigation>
          <Pane marginLeft={majorScale(4)} width={'100%'}>
            <Switch>
              <Route exact path="/account" component={AccountHome} />
              <Route exact path="/account/images" component={AccountImages} />
              <Route
                exact
                path="/account/images/nuke"
                component={AccountImageNuke}
              />
              <Route exact path="/account/invites" component={AccountInvites} />
              <Route exact path="/account/discord" component={AccountDiscord} />
              <Route exact path="/account/mail" component={AccountMail} />
              <Route exact path="/account/sharex" component={AccountShareX} />
              <Route exact path="/account/redeem" component={AccountRedeem} />
            </Switch>
          </Pane>
        </Pane>
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(AccountIndex)
