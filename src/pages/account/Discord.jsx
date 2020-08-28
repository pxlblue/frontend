import React, { PureComponent } from 'react'
import { Pane, Text, Button } from 'evergreen-ui'
import { connect } from 'react-redux'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
  session: state.root.session,
})
class AccountDiscord extends PureComponent {
  render() {
    const { session } = this.props
    return (
      <Pane display="flex" flexDirection="column">
        <Text>
          Discord integration is not complete yet, but to get your member role
          you may DM relative.
        </Text>
        <Button
          appearance="primary"
          is="a"
          href={`https://api.pxl.blue/discord`}
          target="_blank"
        >
          Join discord
        </Button>
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(AccountDiscord)
