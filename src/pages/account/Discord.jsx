import React, { PureComponent } from 'react'
import {
  Pane,
  Text,
  Button,
  minorScale,
  toaster,
  Alert,
  majorScale,
  Heading,
} from 'evergreen-ui'
import { connect } from 'react-redux'
import pxlApi from 'pxl/Api'
import Layout from 'components/Layout'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
  session: state.root.session,
})
class AccountDiscord extends PureComponent {
  async onLinkClicked() {
    let res = await pxlApi.http_post('/discord/login', true)
    if (!res.success) {
      toaster.danger('failed to link discord', {
        description: res.errors.join('\n'),
      })
    }
    window.open(res.url, '_blank')
  }
  render() {
    const { profile } = this.props
    return (
      <Layout heading="Discord">
        {profile && typeof profile.discordId === 'string' && (
          <Alert intent="none">
            <Text>
              Your discord, {profile.discordTag} is already linked. Linking a
              new account will remove your account's roles in the Discord.
            </Text>
          </Alert>
        )}
        <Text marginTop={minorScale(1)}>
          Pressing the link button below will begin the process of linking your
          Discord to your pxl.blue account. Linking your account will
          automatically join you to the Discord if you were not in it before.
        </Text>
        <Pane marginTop={majorScale(2)}>
          <Button appearance="primary" onClick={this.onLinkClicked.bind(this)}>
            Link discord
          </Button>
          <Button
            marginLeft={majorScale(1)}
            is="a"
            href={`https://api.pxl.blue/discord`}
            target="_blank"
          >
            Join discord
          </Button>
        </Pane>
      </Layout>
    )
    return (
      <Pane display="flex" flexDirection="column">
        <Heading size={800}>Discord</Heading>

        <Pane marginTop={majorScale(2)}></Pane>
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(AccountDiscord)
