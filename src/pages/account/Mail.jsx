import React, { PureComponent } from 'react'
import {
  Pane,
  Text,
  Button,
  Alert,
  Tooltip,
  minorScale,
  toaster,
  Heading,
  Spinner,
  Table,
  majorScale,
  TextInput,
  Select,
} from 'evergreen-ui'
import { connect } from 'react-redux'
import pxlApi from 'pxl/Api'
import { Link } from 'react-router-dom'
import { Formik } from 'formik'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
  session: state.root.session,
})

class Aliases_ extends PureComponent {
  state = {
    loading: true,
    aliases: [],
    domains: [],
  }
  async refetchData() {
    const vdRes = await pxlApi.http_get('/mail/virtual_domains', true)
    if (!vdRes.success) {
      toaster.danger('failed to get domain list', {
        description: vdRes.errors.join('\n'),
      })
      return
    }
    const aliasRes = await pxlApi.http_get('/mail/alias', true)
    if (!aliasRes.success) {
      toaster.danger('failed to get alias list', {
        description: aliasRes.errors.join('\n'),
      })
      return
    }
    this.setState({
      loading: false,
      domains: vdRes.domains,
      aliases: aliasRes.aliases,
    })
  }
  async componentDidMount() {
    await this.refetchData()
  }
  async createAlias(values, { setSubmitting }) {
    const res = await pxlApi.http_post('/mail/alias/create', true, {
      username: values.username,
      domain: values.domain,
    })
    if (!res.success) {
      toaster.danger('Failed to create alias', {
        description: res.errors.join('\n'),
      })
      return setSubmitting(false)
    }
    toaster.success(res.message)
    await this.refetchData()
    setSubmitting(false)
  }
  render() {
    if (this.state.loading) {
      return (
        <Pane
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height={'100%'}
        >
          <Spinner size={56} />
          <Heading size={100}>Loading Data</Heading>
        </Pane>
      )
    }

    return (
      <Pane display="flex" flexDirection="column">
        <Heading size={500}>Aliases</Heading>
        <Table width={'100%'}>
          <Table.Head>
            <Table.TextHeaderCell>Alias</Table.TextHeaderCell>
            <Table.TextHeaderCell>Actions</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body>
            {this.state.aliases.map((alias) => (
              <Table.Row key={alias}>
                <Table.TextCell>{alias}</Table.TextCell>
                <Table.TextCell> </Table.TextCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Heading size={400}>Create an Alias</Heading>
        <Formik
          initialValues={{
            username: '',
            domain: 'niggers.forsale',
          }}
          validate={(values) => {
            return {}
          }}
          onSubmit={this.createAlias.bind(this)}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <Pane display="flex" flexDirection="row" alignItems="center">
                <TextInput
                  name="username"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                />
                <TextInput disabled={true} width={minorScale(8)} value="@" />
                <Select
                  name="domain"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.domain}
                >
                  {this.state.domains.map((domain) => (
                    <option value={domain}>{domain}</option>
                  ))}
                </Select>
              </Pane>

              <Button
                appearance="primary"
                type="submit"
                disabled={isSubmitting}
                marginTop={minorScale(1)}
                marginBottom={majorScale(2)}
              >
                Create alias
              </Button>
            </form>
          )}
        </Formik>
      </Pane>
    )
  }
}

const Aliases = connect(mapStateToProps)(Aliases_)

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
          <Alert intent="none" marginBottom={majorScale(2)}>
            <Text>
              Your mail access expires on {profile.mailAccessExpiresFriendly}
            </Text>
          </Alert>
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
        <Alert intent="none" marginBottom={majorScale(2)}>
          <Text>
            Your mail access expires on {profile.mailAccessExpiresFriendly}
          </Text>
        </Alert>
        <Alert intent="none">
          <Text>
            Your mail account already exists. Login with your pxl.blue
            username/password at{' '}
            <a
              href={`https://pxl.so?_user=${encodeURIComponent(
                profile.username.toLowerCase()
              )}`}
              target="_blank"
            >
              pxl.so
            </a>
          </Text>
        </Alert>
        <Pane marginTop={majorScale(1)}>
          <Aliases />
        </Pane>
        <Pane marginTop={minorScale(1)}>
          <Button
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
