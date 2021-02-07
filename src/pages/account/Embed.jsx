import React, { PureComponent } from 'react'
import {
  Pane,
  Text,
  Button,
  minorScale,
  toaster,
  majorScale,
  Heading,
  TextInputField,
  Checkbox,
  Label,
} from 'evergreen-ui'
import { connect } from 'react-redux'
import pxlApi from 'pxl/Api'
import Layout from 'components/Layout'

import styles from './Embed.scss'
import Loading from 'components/Loading'

const mapStateToProps = (state) => ({
  profile: state.root.profile,
  session: state.root.session,
})
class AccountEmbed extends PureComponent {
  state = {
    loading: true,
  }
  constructor(props) {
    super()

    console.log(props)
    this.onChange = this.onChange.bind(this)
    this.save = this.save.bind(this)
  }
  onChange(name, chk = false) {
    return (e) =>
      this.setState({ [name]: chk ? e.target.checked : e.target.value })
  }
  async componentDidMount() {
    let embedSettings = await pxlApi.http_get('/users/@me/embed', true)
    console.log(embedSettings)
    if (!embedSettings.settings.authorStr)
      embedSettings.settings.authorStr = this.props.profile.username
    this.setState({ loading: false, ...embedSettings.settings })
  }
  async save() {
    console.log(this.state)
    let body = { ...this.state }
    delete body.loading
    let res = await pxlApi.http_post('/users/@me/embed', true, body)
    if (!res.success) {
      return toaster.danger('Error while saving embed settings', {
        description: res.errors.join('\n'),
      })
    }
    toaster.success('Saved embed settings successfully')
  }
  render() {
    const { profile } = this.props
    const {
      loading,
      author,
      authorStr,
      color,
      description,
      embed,
      title,
    } = this.state
    if (loading) return <Loading />
    return (
      <Layout heading="Embeds">
        <Text marginTop={minorScale(1)}>
          Create an embed that will display in Discord for your images
        </Text>

        <Pane marginTop={majorScale(1)}>
          <Checkbox
            label="Embeds enabled"
            checked={embed}
            onChange={this.onChange('embed', true)}
          />
          <Checkbox
            label="Show embed author"
            checked={author}
            onChange={this.onChange('author', true)}
          />

          <TextInputField
            label="Embed author"
            value={authorStr}
            disabled={!author}
            onChange={this.onChange('authorStr')}
          />
          <TextInputField
            label="Embed title"
            value={title}
            onChange={this.onChange('title')}
          />
          <TextInputField
            label="Embed description"
            value={description}
            onChange={this.onChange('description')}
          />
          <Pane display="flex" flexDirection="column">
            <Label>Embed color</Label>
            <input
              type="color"
              onChange={this.onChange('color')}
              value={color}
            />
          </Pane>
        </Pane>

        <Pane marginTop={majorScale(2)}>
          <Heading size={600}>Preview</Heading>

          <div className={styles.embedWrapper} style={{ borderColor: color }}>
            <div className={styles.embedGrid}>
              {author && (
                <div className={styles.embedAuthor}>
                  <span className={styles.embedAuthorName}>{authorStr}</span>
                </div>
              )}
              <div className={styles.embedTitle}>
                <span className={styles.embedTitleLink}>{title}</span>
              </div>
              <div className={styles.embedDescription}>{description}</div>
              <a className={styles.embedImage}>
                <img src="https://catgirls.shop/emFb849d5ad0B92aa9.png" />
              </a>
            </div>
          </div>
        </Pane>

        <Pane marginTop={majorScale(2)}>
          <Button appearance="primary" onClick={this.save.bind(this)}>
            Save
          </Button>
        </Pane>
      </Layout>
    )
  }
}

export default connect(mapStateToProps)(AccountEmbed)
