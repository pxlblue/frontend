import React, { PureComponent } from 'react'
import { Heading, Pane, Spinner, majorScale } from 'evergreen-ui'

export default class Loading extends PureComponent {
  render() {
    return (
      <Pane height="100%">
        <Pane
          marginLeft={majorScale(10)}
          marginRight={majorScale(10)}
          marginTop={majorScale(2)}
          display="flex"
          flexDirection="column"
          alignItems="center"
          height="100%"
          justifyContent="center"
        >
          <Spinner size={56} />
          <Heading size={100}>Loading</Heading>
        </Pane>
      </Pane>
    )
  }
}
