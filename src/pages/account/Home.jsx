import React, { PureComponent } from 'react'
import { Button, minorScale, Pane, Text } from 'evergreen-ui'
import { connect } from 'react-redux'
import pxlApi from 'pxl/Api'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
})
class AccountHome extends PureComponent {
  render() {
    return (
      <Pane>
        <Text>
          Welcome to your account dashboard. Select a tab on your left to get
          started.
        </Text>
        <Pane marginTop={minorScale(1)}>
          <Button onClick={pxlApi.logout} intent="danger" appearance="minimal">
            Logout
          </Button>
        </Pane>
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(AccountHome)
