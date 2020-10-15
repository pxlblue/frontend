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
import DomainSelector from 'components/DomainSelector'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
  session: state.root.session,
})
class AccountShareX extends PureComponent {
  state = {
    fullDomain: 'i.pxl.blue',
    subdomain: '',
    value: 1,
  }
  domainChange(st) {
    console.log(st)
    this.setState(st)
  }
  render() {
    const { session } = this.props

    return (
      <Layout heading="ShareX config generator">
        <DomainSelector
          width={480}
          onChange={this.domainChange.bind(this)}
          value={this.state.value}
          subdomain={this.state.subdomain}
          enableRandomDomain
        />
        <Pane marginTop={minorScale(1)}>
          <Button
            appearance="primary"
            is="a"
            href={`https://api.pxl.blue/users/@me/generate_sharex_config?auth=${encodeURIComponent(
              session
            )}&domain=${encodeURIComponent(this.state.fullDomain)}`}
            target="_blank"
          >
            Download Config
          </Button>

          <Button
            appearance="primary"
            intent="warning"
            is="a"
            href={`https://api.pxl.blue/users/@me/generate_shortener_config?auth=${encodeURIComponent(
              session
            )}&domain=${encodeURIComponent(this.state.fullDomain)}`}
            target="_blank"
            marginLeft={majorScale(1)}
          >
            Download URL Shortener Config
          </Button>
        </Pane>
      </Layout>
    )
  }
}

export default connect(mapStateToProps)(AccountShareX)
