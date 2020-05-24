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
} from 'evergreen-ui'
import pxlApi from 'pxl/Api'

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
      <Pane width={'100%'}>
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
      </Pane>
    )
  }
}
