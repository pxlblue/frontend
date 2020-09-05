import React, { PureComponent } from 'react'
import {
  Button,
  Heading,
  majorScale,
  minorScale,
  Pane,
  Switch,
  Text,
  toaster,
} from 'evergreen-ui'
import { connect } from 'react-redux'
import pxlApi from 'pxl/Api'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
})

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
      <Pane>
        <Heading size={800}>User Settings</Heading>
        <Pane marginTop={minorScale(1)}>
          <SettingSwitch
            name="settings_discordLink"
            title="Discord link"
            description="Prevent Discord from hiding your image links"
            setState={this.setState.bind(this)}
            value={this.state.settings_discordLink}
          />
        </Pane>
        <Pane marginTop={majorScale(2)}>
          <Button appearance="primary" onClick={this.onClick.bind(this)}>
            Save
          </Button>
        </Pane>
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(AccountSettings)
