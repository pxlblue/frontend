import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Heading, majorScale, Pane } from 'evergreen-ui'
export default class Layout extends PureComponent {
  static propTypes = {
    heading: PropTypes.string.isRequired,
  }
  render() {
    const { heading, children } = this.props
    return (
      <Pane>
        <Heading size={800}>{heading}</Heading>
        <Pane marginTop={majorScale(2)}>{children}</Pane>
      </Pane>
    )
  }
}
