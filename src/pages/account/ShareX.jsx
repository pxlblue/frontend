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
    if (loading)
      return (
        <Pane>
          <Heading size={800}>ShareX config generator</Heading>
          <Pane
            marginLeft={majorScale(10)}
            marginRight={majorScale(10)}
            marginTop={majorScale(2)}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Spinner size={56} />
            <Heading size={100}>Loading</Heading>
          </Pane>
        </Pane>
      )

    return (
      <Pane display="flex" flexDirection="column">
        <Heading size={800}>ShareX config generator</Heading>

        <Pane marginTop={majorScale(2)}>
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
        </Pane>
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(AccountShareX)
