import React, { PureComponent } from 'react'
import { Button, Heading, minorScale, Pane, Text } from 'evergreen-ui'
import { connect } from 'react-redux'
import pxlApi from 'pxl/Api'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
})
class AccountSettings extends PureComponent {
  render() {
    return (
      <Pane>
        <Heading size={800}>User Settings</Heading>
        <Pane marginTop={minorScale(1)}>
          <Button onClick={pxlApi.logout} intent="danger" appearance="minimal">
            Logout
          </Button>
        </Pane>
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(AccountSettings)
