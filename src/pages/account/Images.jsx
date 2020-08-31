import React, { Component } from 'react'
import {
  Pane,
  Spinner,
  Heading,
  Button,
  Tooltip,
  Table,
  Code,
  toaster,
} from 'evergreen-ui'
import pxlApi from 'pxl/Api'
import PaginatedTable from 'components/PaginatedTable'

export default class AccountImages extends Component {
  render() {
    return (
      <Pane width={'100%'}>
        <PaginatedTable
          endpoint="/users/@me/images"
          limit={10}
          order="DESC"
          schema={[
            {
              id: 'path',
              header: 'Image',
              member: 'path',
            },
            {
              id: 'originalName',
              header: 'File name',
              member: 'originalName',
            },
            {
              id: 'uploadTime',
              header: 'Upload time',
              member: 'uploadTime',
            },
            {
              id: 'hash',
              header: 'Hash',
              member: 'hash',
              type: 'code',
            },
          ]}
        />
      </Pane>
    )
  }
}
