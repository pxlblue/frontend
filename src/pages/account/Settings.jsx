import React, { PureComponent, useState } from 'react'
import {
  Button,
  Card,
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
import Loading from 'components/Loading'
import DomainSelector from 'components/DomainSelector'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
})

class UploadKey extends PureComponent {
  state = { hidden: true }
  constructor() {
    super()
    this.copyToClipboard = this.copyToClipboard.bind(this)
    this.regenerate = this.regenerate.bind(this)
    this.toggleVisibility = this.toggleVisibility.bind(this)
  }
  copyToClipboard() {
    let val = this.props.value

    try {
      if ('clipboard' in navigator) {
        navigator.clipboard.writeText(val)
        toaster.notify('Upload key copied to clipboard')
      } else {
        toaster.danger(
          'Your browser does not have support for copying automatically'
        )
      }
    } catch (err) {
      toaster.danger('Failed to write to clipboard', {
        description: err.toString(),
      })
    }
  }
  async regenerate() {
    let res = await pxlApi.http_post(
      `/users/@me/keys/${this.props.keyType}/regenerate`
    )
    if (!res.success) {
      return toaster.danger('Failed to regenerate key', {
        description: res.errors.join('\n'),
      })
    }
    toaster.notify(res.message)
    if (typeof this.props.regenerated === 'function') this.props.regenerated()
  }
  toggleVisibility() {
    this.setState({ hidden: !this.state.hidden })
  }
  render() {
    const { hidden } = this.state
    return (
      <Pane display="flex" flexDirection="row" justifyItems="center">
        <TextInput
          value={this.props.value}
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
          onClick={this.copyToClipboard}
        >
          Copy
        </Button>

        <Button
          iconBefore={'refresh'}
          height={32}
          marginLeft={minorScale(4)}
          appearance="minimal"
          intent="danger"
          onClick={this.regenerate}
        >
          Regenerate
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

function RandomDomains({ domains, setState }) {
  const [domain, setDomain] = useState('i.pxl.blue')
  const [subdomain, setSubdomain] = useState('')
  const [value, setValue] = useState('')
  const setSt = (st) => {
    setValue(st.value)
    setDomain(st.fullDomain)
    setSubdomain(st.subdomain)
    console.log(st)
  }
  const deleteDomain = (domain) => {
    return () => {
      let dms = domains.filter((dm) => dm !== domain)
      setState({ settings_randomDomains: dms })
    }
  }
  const addDomain = () => {
    setState({ settings_randomDomains: [...domains, domain] })
  }
  return (
    <Pane>
      <Card
        elevation={1}
        hoverElevation={2}
        padding={majorScale(2)}
        width={480}
      >
        <Heading size={500}>Selected Domains</Heading>
        {domains.map((domain) => (
          <Pane display="flex" flexDirection="row" alignItems="center">
            <Text>{domain}</Text>
            <IconButton
              marginLeft={majorScale(2)}
              intent="danger"
              icon={'trash'}
              appearance="minimal"
              onClick={deleteDomain(domain)}
            />
          </Pane>
        ))}
      </Card>
      <Pane>
        <DomainSelector
          width={480}
          onChange={setSt}
          value={value}
          subdomain={subdomain}
        />
        <Button intent="success" appearance="primary" onClick={addDomain}>
          Add
        </Button>
      </Pane>
    </Pane>
  )
}

class AccountSettings extends PureComponent {
  state = {
    settings_discordLink: false,
    settings_randomDomains: [],
  }
  componentDidMount() {
    this.setState({
      settings_discordLink: this.props.profile.settings_discordLink,
      settings_apiIpSecurity: this.props.profile.settings_apiIpSecurity,
      settings_imageMiddleware: this.props.profile.settings_imageMiddleware,
      settings_randomDomains: this.props.profile.settings_randomDomains,
      settings_secureURLs: this.props.profile.settings_secureURLs,
      settings_invisibleShortURLs: this.props.profile
        .settings_invisibleShortURLs,
      settings_ipSecurity: this.props.profile.settings_ipSecurity,
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
  async regenerated() {
    await pxlApi.getMe()
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

          <SettingSwitch
            name="settings_secureURLs"
            title="Secure URLs"
            description="Your image URLs will have 16 characters instead of 7 (increasing space to 22^16)"
            setState={this.setState.bind(this)}
            value={this.state.settings_secureURLs}
          />
          <SettingSwitch
            name="settings_invisibleShortURLs"
            title="Invisible Short URLs"
            description="URLs shortened by pxl.blue will not have anything visible after the slash"
            setState={this.setState.bind(this)}
            value={this.state.settings_invisibleShortURLs}
          />

          <SettingSwitch
            name="settings_ipSecurity"
            title="IP checking for sessions"
            description="Prevents malicious actors from stealing your session and logging in as you without your password. (Only disable if you have a dynamic ip and it is a problem)"
            setState={this.setState.bind(this)}
            value={this.state.settings_ipSecurity}
          />

          <SettingSwitch
            name="settings_apiIpSecurity"
            title="Strict IP checking for API keys"
            description="Prevents IP addresses which have not logged into your account before from using your API key"
            setState={this.setState.bind(this)}
            value={this.state.settings_apiIpSecurity}
          />
          <SettingSwitch
            name="settings_imageMiddleware"
            title="Image middleware"
            description="Server-side rendering of image effects (beta-testers only)"
            setState={this.setState.bind(this)}
            value={this.state.settings_imageMiddleware}
          />

          <Pane marginBottom={majorScale(2)}>
            <Heading size={500}>Random domains</Heading>
            <Text>
              Select domains to randomly select when uploading (must redownload
              config and select Random)
            </Text>
            <RandomDomains
              domains={this.state.settings_randomDomains}
              setState={this.setState.bind(this)}
            />
          </Pane>

          <Pane marginBottom={majorScale(2)}>
            <Heading size={500}>Upload key</Heading>
            <Text>For use in third-party upload scripts</Text>
            <UploadKey
              value={this.props.profile.uploadKey}
              keyType="uploadKey"
              regenerated={this.regenerated.bind(this)}
            />
          </Pane>
          <Pane marginBottom={majorScale(2)}>
            <Heading size={500}>API key</Heading>
            <Text>For use in third-party utilities</Text>
            <UploadKey
              value={this.props.profile.apiKey}
              keyType="apiKey"
              regenerated={this.regenerated.bind(this)}
            />
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
