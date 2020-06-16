import React, { PureComponent } from 'react'
import { Pane, Text } from 'evergreen-ui'
import { connect } from 'react-redux'
import PaginatedTable from 'components/PaginatedTable'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
})
class AdminInvites extends PureComponent {
  render() {
    return (
      <Pane>
        <Text>Listing all invites...</Text>
        <PaginatedTable
          endpoint="/invites"
          limit={10}
          schema={[
            {
              id: 'id',
              header: 'ID',
              member: 'id',
            },
            {
              id: 'code',
              header: 'Invite Code',
              member: 'invite',
            },
            {
              id: 'creator',
              header: 'Creator',
              member: 'creator',
            },
          ]}
        />
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(AdminInvites)
