import React, { PureComponent } from 'react'
import {
  Pane,
  Text,
  Button,
  Alert,
  Tooltip,
  minorScale,
  toaster,
} from 'evergreen-ui'
import { connect } from 'react-redux'
import pxlApi from 'pxl/Api'
import { Link } from 'react-router-dom'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
  session: state.root.session,
})
class AccountMail extends PureComponent {
  constructor() {
    super()
    this.resyncPassword = this.resyncPassword.bind(this)
    this.createMailbox = this.createMailbox.bind(this)
  }
  async resyncPassword() {
    const res = await pxlApi.http_post('/mail/resync_password', true)
    if (!res.success) {
      toaster.danger('failed to resync password', {
        description: res.errors.join('\n'),
      })
      return
    }
    toaster.success(res.message)
  }
  async createMailbox() {
    const res = await pxlApi.http_post('/mail/create', true)
    if (!res.success) {
      toaster.danger('failed to create mailbox', {
        description: res.errors.join('\n'),
      })
      return this.forceUpdate()
    }
    this.forceUpdate()
    await pxlApi.getMe()
    toaster.success(res.message)
  }
  render() {
    const { profile } = this.props
    if (!profile.mailAccess) {
      return (
        <Pane display="flex" flexDirection="column">
          <Alert intent="danger">
            You do not have mail access at this time.
          </Alert>
          <Pane marginTop={minorScale(1)}>
            <Button appearance="primary" is={Link} to={`/account`}>
              Go home
            </Button>
          </Pane>
        </Pane>
      )
    }
    if (!profile.mailAccountCreated) {
      return (
        <Pane display="flex" flexDirection="column">
          <Text>
            Creating your mail account will make an account with your pxl
            username and password.
          </Text>
          <Pane marginTop={minorScale(1)}>
            <Button appearance="primary" onClick={this.createMailbox}>
              Create mail account
            </Button>
          </Pane>
        </Pane>
      )
    }

    return (
      <Pane display="flex" flexDirection="column">
        <Alert intent="none">
          <Text>
            Your mail account already exists. Login with your pxl.blue
            username/password at{' '}
            <Link
              href={`https://pxl.so?_user=${encodeURIComponent(
                profile.username.toLowerCase()
              )}`}
              target="_blank"
            >
              pxl.so
            </Link>
          </Text>
        </Alert>
        <Pane marginTop={minorScale(1)}>
          <Button
            intent="success"
            is="a"
            href={`https://pxl.so?_user=${encodeURIComponent(
              profile.username.toLowerCase()
            )}`}
            target="_blank"
          >
            Go to webmail
          </Button>
          <Tooltip content="Resync your account password if your password is not working.">
            <Button
              appearance="minimal"
              intent="danger"
              onClick={this.resyncPassword}
            >
              Resync account password
            </Button>
          </Tooltip>
        </Pane>
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(AccountMail)
