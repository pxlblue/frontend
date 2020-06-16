import React, { PureComponent } from 'react'
import { Pane, Text } from 'evergreen-ui'
import { connect } from 'react-redux'
import PaginatedTable from 'components/PaginatedTable'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
})
class AdminUsers extends PureComponent {
  render() {
    return (
      <Pane>
        <Text>Listing all users...</Text>
        <PaginatedTable
          endpoint="/users"
          limit={10}
          schema={[
            {
              id: 'uid',
              header: 'UID',
              member: 'id',
            },
            {
              id: 'username',
              header: 'Username',
              member: 'username',
            },
            {
              id: 'email',
              header: 'Email Address',
              member: 'email',
            },
            {
              id: 'images',
              header: 'Image Count',
              member: 'imageCount',
            },
          ]}
        />
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(AdminUsers)
