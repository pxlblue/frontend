import React, { PureComponent } from 'react'
import {
  Button,
  Heading,
  IconButton,
  majorScale,
  minorScale,
  Pane,
  Switch,
  Text,
  TextInput,
  toaster,
} from 'evergreen-ui'
import { connect } from 'react-redux'
import pxlApi from 'pxl/Api'
import Layout from 'components/Layout'
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

class SettingSwitch extends PureComponent {
  state = {
    value: false,
  }
  static defaultProps = {
    value: false,
  }
  constructor() {
    super()
    this.onChange = this.onChange.bind(this)
  }
  componentDidUpdate() {
    this.setState({ value: this.props.value })
  }
  onChange(e) {
    this.setState({ value: e.target.checked })
    this.props.setState({ [this.props.name]: e.target.checked })
  }
  render() {
    const { name, title, description } = this.props
    return (
      <Pane marginBottom={majorScale(2)}>
        <Heading size={500}>{title}</Heading>
        <Text>{description}</Text>
        <Switch
          height={24}
          checked={this.state.value}
          onChange={this.onChange.bind(this)}
        />
      </Pane>
    )
  }
}

class AccountSettings extends PureComponent {
  state = {
    settings_discordLink: false,
  }
  componentDidMount() {
    this.setState({
      settings_discordLink: this.props.profile.settings_discordLink,
    })
  }
  async onClick() {
    let res = await pxlApi.http_patch('/users/@me', true, this.state)
    if (!res.success) {
      return toaster.danger('Failed to save settings', {
        description: res.errors.join('\n'),
      })
    }
    toaster.success(res.message)
  }
  render() {
    return (
      <Layout heading="User Settings">
        <Pane marginTop={majorScale(2)}>
          <SettingSwitch
            name="settings_discordLink"
            title="Discord link"
            description="Prevent Discord from hiding your image links"
            setState={this.setState.bind(this)}
            value={this.state.settings_discordLink}
          />
          <Pane marginBottom={majorScale(2)}>
            <Heading size={500}>Upload key</Heading>
            <Text>For use in third-party upload scripts</Text>
            <UploadKey uploadKey={this.props.profile.uploadKey} />
          </Pane>
        </Pane>
        <Pane marginTop={majorScale(2)}>
          <Button appearance="primary" onClick={this.onClick.bind(this)}>
            Save
          </Button>
        </Pane>
      </Layout>
    )
  }
}

export default connect(mapStateToProps)(AccountSettings)
