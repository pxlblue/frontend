import React, { PureComponent } from 'react'
import {
  Pane,
  Heading,
  Text,
  Spinner,
  majorScale,
  Table,
  Badge,
} from 'evergreen-ui'

import pxlApi from 'pxl/Api'

export default class Domains extends PureComponent {
  state = {
    loading: true,
    domains: [],
  }
  async componentDidMount() {
    let domains = await pxlApi.getDomains()
    this.setState({ loading: false, domains })
  }
  render() {
    const { loading, domains } = this.state
    if (loading)
      return (
        <Pane>
          <Heading size={800}>Domains</Heading>
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
      <Pane>
        <Heading size={800}>Domains</Heading>
        <Table marginTop={majorScale(2)}>
          <Table.Head>
            <Table.TextHeaderCell flexBasis={340} flexGrow={0} flexShrink={0}>
              Domain
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>Tags</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height="70vh">
            {domains.map((domain) => (
              <Table.Row key={domain.id}>
                <Table.TextCell flexBasis={340} flexGrow={0} flexShrink={0}>
                  {domain.domain}
                </Table.TextCell>
                <Table.TextCell>
                  {domain.system && (
                    <Badge color="green" isSolid marginRight={8}>
                      official
                    </Badge>
                  )}
                  {domain.public && (
                    <Badge color="blue" isSolid marginRight={8}>
                      public
                    </Badge>
                  )}
                </Table.TextCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Pane>
    )
  }
}
