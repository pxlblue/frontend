import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Heading, majorScale, Pane } from 'evergreen-ui'
import styles from '../styles/container.scss'
export default class Layout extends PureComponent {
  static propTypes = {
    heading: PropTypes.string.isRequired,
    enableMargins: PropTypes.bool,
  }
  static defaultProps = {
    enableMargins: false,
  }

  render() {
    const { heading, children, enableMargins } = this.props

    return (
      <Pane
        marginLeft={enableMargins ? majorScale(10) : 0}
        marginRight={majorScale(10)}
        className={enableMargins ? styles.container : ''}
      >
        <Heading size={800}>{heading}</Heading>
        <Pane marginTop={majorScale(2)}>{children}</Pane>
      </Pane>
    )
  }
}
