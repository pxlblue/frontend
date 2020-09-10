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
import Layout from 'components/Layout'

export default class AccountImages extends Component {
  render() {
    return (
      <Layout heading="Images">
        <PaginatedTable
          endpoint="/users/@me/images"
          limit={10}
          order="DESC"
          schema={[
            {
              id: 'path',
              header: 'Image',
              member: 'path',
              type: 'img_hyperlink',
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
      </Layout>
    )
  }
}
