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
    this.close = this.close.bind(this)
  }
  toggleNav(val) {
    this.setState({ open: typeof val === 'boolean' ? val : !this.state.open })
  }
  close() {
    this.toggleNav(false)
  }
  render() {
    const { pathname, profile, loggedIn } = this.props
    const { open } = this.state
    const close = this.close
    const leftNav = (
      <TabNavigation
        marginLeft={majorScale(4)}
        marginBottom={9}
        className={styles.tabnav}
      >
        <Tab
          is={Link}
          to="/"
          isSelected={pathname.match(/^\/$/gi) && true}
          onSelect={close}
        >
          Home
        </Tab>
        <Tab
          is={Link}
          to="/domains"
          isSelected={pathname.match(/^\/domains$/gi) && true}
          onSelect={close}
        >
          Domains
        </Tab>
        <Tab
          is="a"
          href="https://api.pxl.blue/discord"
          rel="noopener"
          target="_blank"
          onSelect={close}
        >
          Discord
        </Tab>
        {loggedIn && profile && (
          <Tab
            is={Link}
            to="/upload"
            isSelected={pathname.match(/^\/upload$/gi) && true}
            onSelect={close}
          >
            Upload
          </Tab>
        )}
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
              onSelect={close}
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
          onSelect={close}
        >
          Login
        </Tab>
        <Tab
          is={Link}
          to="/signup"
          isSelected={pathname.match(/^\/signup$/gi) && true}
          onSelect={close}
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
          onSelect={close}
        >
          Account
        </Tab>
        {profile && profile.moderator && (
          <Tab
            is={Link}
            to="/mod"
            isSelected={pathname.match(/^\/mod/gi) && true}
            onSelect={close}
          >
            Moderator
          </Tab>
        )}
        {profile && profile.admin && (
          <Tab
            is={Link}
            to="/admin"
            isSelected={pathname.match(/^\/admin/gi) && true}
            onSelect={close}
          >
            Admin
          </Tab>
        )}
      </TabNavigation>
    )

    return (
      <Pane
        borderBottom="muted"
        marginBottom={5}
        display="flex"
        flexDirection="row"
        alignItems="center"
        maxHeight={40}
        margin={8}
      >
        <Heading
          size={700}
          marginTop={0}
          marginLeft={majorScale(10)}
          marginBottom={10}
          className={styles.brand}
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
          paddingRight={4}
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
              paddingLeft={4}
              paddingRight={16}
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
