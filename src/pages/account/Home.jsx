import React, { PureComponent } from 'react'
import {
  Button,
  ClipboardIcon,
  Heading,
  IconButton,
  majorScale,
  minorScale,
  Pane,
  Text,
  TextInput,
  toaster,
} from 'evergreen-ui'
import { connect } from 'react-redux'
import pxlApi from 'pxl/Api'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
})

class UploadKey extends PureComponent {
  state = { hidden: true }
  constructor() {
    super()
    this.copyKeyToClipboard = this.copyKeyToClipboard.bind(this)
    this.toggleVisibility = this.toggleVisibility.bind(this)
  }
  copyKeyToClipboard() {
    let key = this.props.uploadKey

    if ('clipboard' in navigator) {
      navigator.clipboard.writeText(key)
      toaster.notify('Upload key copied to clipboard')
    } else {
      toaster.danger(
        'Your browser does not have support for copying automatically'
      )
    }
  }
  toggleVisibility() {
    this.setState({ hidden: !this.state.hidden })
  }
  render() {
    const { hidden } = this.state
    return (
      <Pane display="flex" flexDirection="row" justifyItems="center">
        <TextInput
          value={this.props.uploadKey}
          ref={(textarea) => (this.textArea = textarea)}
          disabled
          type={hidden ? 'password' : 'text'}
        />
        <IconButton
          icon={hidden ? 'eye-off' : 'eye-open'}
          intent={hidden ? 'none' : 'danger'}
          onClick={this.toggleVisibility}
        />

        <Button
          iconBefore={'clipboard'}
          height={32}
          marginLeft={minorScale(4)}
          appearance="minimal"
          intent="none"
          onClick={this.copyKeyToClipboard}
        >
          Copy
        </Button>
      </Pane>
    )
  }
}

class AccountHome extends PureComponent {
  render() {
    return (
      <Pane>
        <Text>
          Welcome to your account dashboard. Select a tab on your left to get
          started.
        </Text>
        <Pane marginTop={majorScale(2)}>
          <Heading size={500}>Upload key</Heading>
          <Text>For use in third-party upload scripts</Text>
          <UploadKey uploadKey={this.props.profile.uploadKey} />
        </Pane>
        <Pane marginTop={minorScale(1)}>
          <Button onClick={pxlApi.logout} intent="danger" appearance="minimal">
            Logout
          </Button>
        </Pane>
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(AccountHome)
