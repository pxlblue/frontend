import React, { PureComponent } from 'react'
import {
  Pane,
  Button,
  minorScale,
  Heading,
  majorScale,
  Spinner,
  Select,
  Text,
} from 'evergreen-ui'
import { connect } from 'react-redux'
import pxlApi from 'pxl/Api'
import Loading from 'components/Loading'
import Layout from 'components/Layout'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
  session: state.root.session,
})
class AccountShareX extends PureComponent {
  state = {
    loading: true,
    domains: [],
  }
  async componentDidMount() {
    let domains = await pxlApi.getDomains()
    this.setState({ loading: false, domains })
  }
  render() {
    const { session } = this.props
    const { loading, domains } = this.state
    if (loading) return <Loading />

    return (
      <Layout heading="ShareX config generator">
        <Text>Select a domain: </Text>
        <Select
          name="domain"
          onChange={(e) => this.setState({ domain: e.target.value })}
          value={this.state.domain}
          marginBottom={minorScale(2)}
        >
          {domains.map((domain) => (
            <option value={domain.domain}>{domain.domain}</option>
          ))}
        </Select>
        <Pane marginTop={minorScale(1)}>
          <Button
            appearance="primary"
            is="a"
            href={`https://api.pxl.blue/users/@me/generate_sharex_config?auth=${encodeURIComponent(
              session
            )}&domain=${encodeURIComponent(this.state.domain)}`}
            target="_blank"
          >
            Download Config
          </Button>
        </Pane>
      </Layout>
    )
  }
}

export default connect(mapStateToProps)(AccountShareX)
