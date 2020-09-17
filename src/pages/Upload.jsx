import React, { PureComponent, useCallback, useState } from 'react'
import {
  Pane,
  Heading,
  Text,
  majorScale,
  UploadIcon,
  Link,
  IconButton,
  toaster,
  Spinner,
  Select,
} from 'evergreen-ui'
import { useDropzone } from 'react-dropzone'
import { connect } from 'react-redux'
import Layout from 'components/Layout'
import pxlApi from 'pxl/Api'
import Loading from 'components/Loading'
import DomainSelector from 'components/DomainSelector'

const mapStateToProps = (state) => ({
  pathname: state.router.location.pathname,
  profile: state.root.profile,
  loggedIn: state.root.loggedIn,
})

async function upload(uploadKey, host, file) {
  let fd = new FormData()
  fd.append('key', uploadKey)
  fd.append('host', host)
  fd.append('file', file, file.name)
  let res = await fetch(pxlApi.base + '/upload/sharex', {
    method: 'POST',
    body: fd,
  })
  let url = await res.text()
  return url.replace('\u200b', '')
}

function copyToClipboard(text) {
  if ('clipboard' in navigator) {
    navigator.clipboard.writeText(text)
    toaster.notify('Copied link to clipboard')
  }
}

function Image({ file }) {
  const { name, url } = file
  return (
    <Pane
      display="flex"
      flexDirection="column"
      width="100%"
      marginBottom={majorScale(4)}
      elevation={1}
      background="tint1"
      padding={majorScale(2)}
    >
      <Heading size={400}>{name}</Heading>
      <Pane display="flex" alignItems="center" flexDirection="row">
        <Link href={url} target="_blank">
          {url}
        </Link>
        <IconButton
          icon="clipboard"
          appearance="minimal"
          intent="none"
          marginLeft={majorScale(2)}
          onClick={() => copyToClipboard(url)}
        />
      </Pane>
    </Pane>
  )
}

function Upload(props) {
  const { profile } = props
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [domain, setDomain_] = useState(
    localStorage.getItem('upload__defaultHost')
      ? localStorage.getItem('upload__defaultHost')
      : 'i.pxl.blue'
  )
  const [subdomain, setSubdomain_] = useState(
    localStorage.getItem('upload__defaultSubdomain')
      ? localStorage.getItem('upload__defaultSubdomain')
      : ''
  )
  const [value, setValue_] = useState(
    localStorage.getItem('upload__defaultValue')
      ? localStorage.getItem('upload__defaultValue')
      : '1'
  )
  const setDomain = (domain) => {
    localStorage.setItem('upload__defaultHost', domain)
    setDomain_(domain)
  }
  const setSubdomain = (subdomain) => {
    localStorage.setItem('upload__defaultSubdomain', subdomain)
    setSubdomain_(subdomain)
  }
  const setValue = (value) => {
    localStorage.setItem('upload__defaultValue', value)
    setValue_(value)
  }

  const setSt = (st) => {
    setDomain(st.fullDomain)
    setSubdomain(st.subdomain)
    setValue(st.value)
  }
  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true)
    let [file] = acceptedFiles
    let r = await upload(profile.uploadKey, domain, file)
    setFiles([
      {
        name: file.name,
        url: r,
        file,
      },
      ...files,
    ])
    setUploading(false)
    toaster.success('Image upload successful')
    copyToClipboard(r)
  })

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <Layout heading="File upload" enableMargins>
      <div {...getRootProps()}>
        <Pane
          background="tint2"
          elevation={2}
          display="flex"
          flexDirection="column"
          justifyContent="space-evenly"
          alignItems="center"
          hoverElevation={4}
          minHeight={majorScale(24)}
          style={{ cursor: 'pointer' }}
        >
          <input {...getInputProps()} />
          <UploadIcon size={48} color="rgba(16, 112, 202,0.85)" />
          <Pane
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Heading size={400}>
              Drag and drop your file, or click to open a file upload dialog
            </Heading>
            <Text color="muted">Max size: 100MB</Text>
          </Pane>
        </Pane>
      </div>
      <Pane>
        <Heading size={600} marginTop={majorScale(2)}>
          Selected host
        </Heading>
        <Heading size={300} marginBottom={majorScale(2)}>
          We'll remember this for you
        </Heading>
        <DomainSelector
          width={480}
          onChange={setSt.bind(this)}
          value={value}
          subdomain={subdomain}
        />
      </Pane>
      <Heading size={600} marginTop={majorScale(2)}>
        Recent uploads
      </Heading>
      <Heading size={300} marginBottom={majorScale(2)}>
        These links are lost when you navigate away
      </Heading>
      <Pane>
        {uploading && (
          <Pane
            display="flex"
            flexDirection="column"
            width="100%"
            marginBottom={majorScale(4)}
            elevation={1}
            background="tint1"
            padding={majorScale(2)}
          >
            <Heading size={400}>Uploading</Heading>
            <Spinner size={40} />
          </Pane>
        )}
        {files.map((file) => (
          <Image key={file.url} file={file} />
        ))}
      </Pane>
    </Layout>
  )
}

export default connect(mapStateToProps)(Upload)
