import React, { Component } from 'react'
import {
  Pane,
  Spinner,
  Heading,
  Button,
  Tooltip,
  Table,
  Code,
  toaster,
  majorScale,
} from 'evergreen-ui'
import pxlApi from 'pxl/Api'
import Loading from 'components/Loading'
import Layout from 'components/Layout'

export default class AccountInvites extends Component {
  state = {
    loading: true,
    invites: null,
    canCreateInvites: null,
  }

  async componentDidMount() {
    let res = await pxlApi.getInvites()
    this.setState({
      loading: false,
      invites: res.invites,
      canCreateInvites: res.canCreateInvites,
    })
  }
  async createInvite() {
    let inv = await pxlApi.createInvite()
    if (inv) {
      let invites = this.state.invites
      invites.push(inv)
      this.setState({ invites })
      toaster.success('Invite created')
    }
  }
  render() {
    const { loading, invites, canCreateInvites } = this.state
    if (loading) {
      return <Loading />
    }
    return (
      <Layout heading="Invites">
        <Tooltip
          content={
            !canCreateInvites
              ? 'You cannot create invites at this time'
              : 'You can create x more invites'
          }
        >
          <Button
            intent="default"
            disabled={!canCreateInvites}
            onClick={this.createInvite.bind(this)}
            marginBottom={majorScale(2)}
          >
            Create Invite
          </Button>
        </Tooltip>
        <Table width={'100%'}>
          <Table.Head>
            <Table.TextHeaderCell>Invite Code</Table.TextHeaderCell>
            <Table.TextHeaderCell>Created At</Table.TextHeaderCell>
            <Table.TextHeaderCell>Redeemed</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body>
            {invites.map((invite) => (
              <Table.Row key={invite.id}>
                <Table.TextCell>
                  <Code>{invite.invite}</Code>
                </Table.TextCell>
                <Table.TextCell>{invite.createdAt.toString()}</Table.TextCell>
                <Table.TextCell>
                  {invite.redeemed ? 'Yes' : 'No'}
                </Table.TextCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Layout>
    )
  }
}
