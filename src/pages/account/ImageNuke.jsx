import React, { PureComponent } from 'react'
import { Pane, Text, Button, minorScale, toaster } from 'evergreen-ui'
import { connect } from 'react-redux'
import pxlApi from 'pxl/Api'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
  session: state.root.session,
})
class AccountImageNuke extends PureComponent {
  async nuke() {
    let res = await pxlApi.http_post('/users/@me/images/nuke', true)
    if (!res.success) {
      return toaster.danger('error while nuking images', {
        description: res.errors.join('\n'),
      })
    }
    toaster.success(res.message)
  }
  render() {
    return (
      <Pane display="flex" flexDirection="column">
        <Text>
          Once you nuke your images they CANNOT be recovered. They are deleted
          from the storage. Nuking your images is a PERMANENT action.
        </Text>
        <Text>
          Please only press the button below if you are ABSOLUTELY sure you want
          to delete all of your images.
        </Text>
        <Text>There is NO confirmation.</Text>
        <Pane marginTop={minorScale(1)}>
          <Button
            appearance="default"
            intent="danger"
            onClick={this.nuke.bind(this)}
          >
            Nuke images
          </Button>
        </Pane>
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(AccountImageNuke)
