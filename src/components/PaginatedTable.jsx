import React, { Component } from 'react'
import pxlApi from 'pxl/Api'
import {
  Pane,
  Spinner,
  Heading,
  Table,
  Code,
  Button,
  Text,
  minorScale,
} from 'evergreen-ui'

export default class PaginatedTable extends Component {
  state = {
    loading: true,
    response: null,
    page: 0,
  }
  static defaultProps = {
    order: 'ASC',
  }
  async fetchData(page) {
    const { endpoint, limit, order } = this.props
    const res = await pxlApi.http_get(
      `${endpoint}?limit=${limit}&page=${page}&order=${order}`,
      true
    )
    return res
  }
  async setPage(page) {
    if (page < 0) {
      page = 0
    }
    if (page > this.state.response.pages) {
      page = this.state.response.pages
    }
    let data = await this.fetchData(page)
    this.setState({
      loading: false,
      response: data,
      data: data[data.message],
      page,
    })
  }
  async prevPage() {
    return this.setPage(this.state.page - 1)
  }
  async nextPage() {
    return this.setPage(this.state.page + 1)
  }
  async componentWillMount() {
    let data = await this.fetchData(this.state.page)
    this.setState({
      loading: false,
      response: data,
      data: data[data.message],
    })
  }
  render() {
    const { loading, data } = this.state
    if (loading) {
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
    const { schema } = this.props
    return (
      <Pane display="flex" flexDirection="column">
        <Table width={'100%'}>
          <Table.Head>
            {schema.map((r) => (
              <Table.TextHeaderCell id={r.id}>{r.header}</Table.TextHeaderCell>
            ))}
          </Table.Head>
          <Table.Body>
            {data.map((row) => (
              <Table.Row key={row.id}>
                {schema.map((r) => (
                  <Table.TextCell>
                    {r.type && r.type === 'code' && (
                      <Code children={row[r.member]} />
                    )}
                    {(!r.type || r.type !== 'code') && row[r.member]}
                  </Table.TextCell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Pane
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          marginTop={minorScale(1)}
        >
          <Button
            onClick={this.prevPage.bind(this)}
            marginRight={12}
            iconBefore="arrow-left"
          >
            Back
          </Button>
          <Text>
            Page {this.state.page + 1}/{this.state.response.pages + 1}
          </Text>
          <Button
            onClick={this.nextPage.bind(this)}
            marginLeft={12}
            iconBefore="arrow-right"
          >
            Forward
          </Button>
        </Pane>
      </Pane>
    )
  }
}
