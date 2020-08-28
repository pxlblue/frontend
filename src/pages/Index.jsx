import React, { PureComponent } from 'react'
import { Pane, Heading, defaultTheme, majorScale, Alert } from 'evergreen-ui'

export default class Index extends PureComponent {
  render() {
    return (
      <Pane>
        <Pane
          background={defaultTheme.colors.background.purpleTint}
          borderTop={'1px solid ' + defaultTheme.colors.border.default}
          borderBottom={'1px solid ' + defaultTheme.colors.border.default}
          marginLeft={majorScale(-11)}
          marginRight={majorScale(-11)}
          marginTop={majorScale(-3)}
        >
          <Pane padding={majorScale(11)}>
            <Heading size={900}>pxl.blue</Heading>
            <Heading size={600} marginTop={majorScale(1)}>
              A private image uploader
            </Heading>
          </Pane>
        </Pane>
        <Pane marginTop={majorScale(1)}>
          <Alert intent="none">
            Join the Discord to get an announcement when registrations are open
            or to win invite giveaways!
          </Alert>
        </Pane>
      </Pane>
    )
  }
}
