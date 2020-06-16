import React, { PureComponent } from 'react'
import { Pane, Text } from 'evergreen-ui'
import { connect } from 'react-redux'
import PaginatedTable from 'components/PaginatedTable'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
})
class AdminImages extends PureComponent {
  render() {
    return (
      <Pane>
        <Text>Listing all images...</Text>
        <PaginatedTable
          endpoint="/images"
          limit={10}
          schema={[
            {
              id: 'id',
              header: 'ID',
              member: 'id',
            },
            {
              id: 'path',
              header: 'Path',
              member: 'path',
            },
            {
              id: 'uploader',
              header: 'Uploader',
              member: 'uploader',
            },
          ]}
        />
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(AdminImages)
