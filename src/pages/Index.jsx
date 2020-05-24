import React, { PureComponent } from 'react'
import {
  Pane,
  Heading,
  Text,
  defaultTheme,
  majorScale,
  Alert,
} from 'evergreen-ui'

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
              A private screenshot uploader
            </Heading>
          </Pane>
        </Pane>
        <Pane marginTop={majorScale(1)}>
          <Alert intent="warning">
            Some previous Mirage users may be eligible for free access for 3
            months. Join the Discord and DM clearing for more information
          </Alert>
          <Alert intent="none" marginTop={majorScale(2)}>
            Currently registrations are closed. Join the Discord to get an
            announcement when invite requests are open or to win giveaways!
          </Alert>
        </Pane>
      </Pane>
    )
  }
}
