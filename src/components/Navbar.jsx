import React, { Component } from 'react'
import {
  majorScale,
  Heading,
  Pane,
  TabNavigation,
  Tab,
  Text,
  IconButton,
  Portal,
} from 'evergreen-ui'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import styles from './Navbar.scss'

const mapStateToProps = (state) => ({
  pathname: state.router.location.pathname,
  profile: state.root.profile,
  loggedIn: state.root.loggedIn,
  realUser: state.root.realUser,
})

class Navbar extends Component {
  state = {
    open: false,
  }
  constructor() {
    super()
    this.toggleNav = this.toggleNav.bind(this)
  }
  toggleNav(val) {
    this.setState({ open: typeof val === 'boolean' ? val : !this.state.open })
  }
  render() {
    const { pathname, profile, loggedIn } = this.props
    const { open } = this.state
    const leftNav = (
      <TabNavigation
        marginLeft={majorScale(4)}
        marginBottom={9}
        className={styles.tabnav}
      >
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
        <Tab
          is="a"
          href="https://api.pxl.blue/discord"
          rel="noopener"
          target="_blank"
        >
          Discord
        </Tab>
        {loggedIn &&
          profile &&
          profile.mailAccess &&
          profile.mailAccountCreated && (
            <Tab
              is="a"
              href={`https://pxl.so?_user=${encodeURIComponent(
                profile.username.toLowerCase()
              )}`}
              target="_blank"
            >
              Webmail
            </Tab>
          )}
      </TabNavigation>
    )
    const rightNav = !loggedIn ? (
      <TabNavigation marginLeft={majorScale(4)} className={styles.tabnav}>
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
    ) : (
      <TabNavigation marginLeft={majorScale(4)} className={styles.tabnav}>
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
    )

    const c = (
      <Pane>
        <Text>cummies</Text>
      </Pane>
    )
    return (
      <Pane
        borderBottom="muted"
        marginBottom={5}
        display="flex"
        flexDirection="row"
        alignItems="center"
        maxHeight={40}
      >
        <Heading
          size={700}
          marginTop={0}
          marginLeft={majorScale(10)}
          marginBottom={10}
        >
          pxl
        </Heading>
        <Pane
          className={styles.items}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
          paddingRight={majorScale(10)}
        >
          {leftNav}
          {rightNav}
        </Pane>
        <Pane
          className={styles.mobile}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignContent="center"
          width="100%"
          paddingRight={majorScale(10)}
          marginBottom={8}
        >
          <div style={{ flexGrow: '1' }} />
          <IconButton icon={open ? 'cross' : 'menu'} onClick={this.toggleNav} />
          <Portal>
            <Pane
              background="tint2"
              elevation={2}
              position="fixed"
              top={48}
              left={0}
              width="100%"
              paddingLeft={majorScale(11)}
              paddingRight={majorScale(10)}
              display={open ? 'flex' : 'none'}
              className={styles.portalpane}
            >
              {leftNav}
              {rightNav}
            </Pane>
          </Portal>
        </Pane>
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(Navbar)
