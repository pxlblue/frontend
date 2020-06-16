import React, { PureComponent } from 'react'
import { Pane, Text } from 'evergreen-ui'
import { connect } from 'react-redux'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
})
class AdminHome extends PureComponent {
  render() {
    return (
      <Pane>
        <Text>
          Welcome to the admin dashboard. Select a tab on your left to get
          started.
        </Text>
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(AdminHome)
