import {
  Heading,
  majorScale,
  minorScale,
  Pane,
  Select,
  Text,
  TextInput,
} from 'evergreen-ui'
import pxlApi from 'pxl/Api'
import React, { Component } from 'react'
import Loading from './Loading'

export default class DomainSelector extends Component {
  state = {
    loading: true,
    domains: [],
    domain: { domain: 'i.pxl.blue', id: 1, wildcard: false },
    subdomain: '',
    value: 1,
  }
  static defaultProps = {
    enableRandomDomain: false,
  }
  async componentDidMount() {
    let domains = await pxlApi.getDomains()
    let domain = this.state.domain
    if (this.props.value) {
      domain = domains.find((d) => d.id == this.props.value) || domain
    }
    if (this.props.enableRandomDomain) {
      domains = [
        {
          id: 'pxl_rand',
          domain: 'pxl_rand',
          public: true,
          system: true,
          ownerId: 1,
          disabled: false,
          wildcard: false,
        },
        ...domains,
      ]
    }
    this.setState({ loading: false, domains, domain })
  }

  updated() {
    const { domain, subdomain, value } = this.state
    let fullDomain = domain.domain
    if (domain.wildcard && subdomain) fullDomain = `${subdomain}.${fullDomain}`

    if (this.props.onChange) {
      this.props.onChange({ domain, subdomain, value, fullDomain })
    }
  }

  async changeSubdomain(e) {
    let value = e.target.value.replace(/ /gi, '-')
    this.setState({ subdomain: value }, this.updated)
  }

  async setDomain(e) {
    let domain = this.state.domains.find((d) => d.id == e.target.value)
    this.setState(
      {
        domain: domain,
        value: e.target.value,
        subdomain: domain.wildcard ? this.state.subdomain : '',
      },
      this.updated
    )
  }

  render() {
    const { loading, domains, domain } = this.state
    if (loading) {
      return <Loading />
    }

    const { enableRandomDomain } = this.props

    return (
      <Pane width={this.props.width || 240}>
        <Heading size={400}>Select a domain</Heading>

        <Pane display="flex" flexDirection="row">
          <TextInput
            value={this.props.subdomain}
            onChange={this.changeSubdomain.bind(this)}
            disabled={domain && !domain.wildcard}
            width={majorScale(24)}
            maxLength={63}
            placeholder="Subdomain"
          />
          <Text
            alignSelf="center"
            marginLeft={minorScale(1)}
            marginRight={minorScale(1)}
          >
            .
          </Text>
          <Select
            name="domain"
            onChange={this.setDomain.bind(this)}
            value={this.props.value}
            marginBottom={majorScale(1)}
            width="fit-content"
          >
            {enableRandomDomain && (
              <option key="pxl_rand" value="pxl_rand">
                Random (configure in Settings)
              </option>
            )}
            {domains.map(
              (domain) =>
                domain.id > 0 && (
                  <option key={domain.id} value={domain.id}>
                    {domain.domain}
                  </option>
                )
            )}
          </Select>
        </Pane>
      </Pane>
    )
  }
}
