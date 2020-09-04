import React, { PureComponent } from 'react'
import {
  Pane,
  Button,
  minorScale,
  toaster,
  Heading,
  majorScale,
  TextInputField,
} from 'evergreen-ui'
import { connect } from 'react-redux'
import pxlApi from 'pxl/Api'
import { Formik } from 'formik'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
  session: state.root.session,
})

class Aliases_ extends PureComponent {
  state = {
    loading: true,
    aliases: [],
    domains: [],
  }
  async createAlias(values, { setSubmitting }) {
    console.log(values)
    const res = await pxlApi.http_post('/mail/alias/create', true, {
      username: values.username,
      domain: values.domain,
    })
    if (!res.success) {
      toaster.danger('Failed to create alias', {
        description: res.errors.join('\n'),
      })
      return setSubmitting(false)
    }
    toaster.success(res.message)
    await this.refetchData()
    setSubmitting(false)
  }
  render() {}
}

class AccountRedeem extends PureComponent {
  constructor() {
    super()
    this.redeem = this.redeem.bind(this)
  }
  async redeem(values) {
    const res = await pxlApi.http_post('/voucher/redeem', true, values)
    if (!res.success) {
      toaster.danger('failed to redeem voucher', {
        description: res.errors.join('\n'),
      })
      return
    }
    toaster.success(res.message)
  }

  render() {
    const { profile } = this.props
    return (
      <Pane width={'100%'}>
        <Heading size={800}>Redeem a Voucher</Heading>

        <Formik
          initialValues={{
            voucher: '',
          }}
          validate={(values) => {
            let errors = {}
            if (!values.voucher) {
              errors.voucher = 'Required'
            }
            return errors
          }}
          onSubmit={this.redeem}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <TextInputField
                label="Voucher"
                onChange={handleChange}
                name="voucher"
                onBlur={handleBlur}
                value={values.voucher}
                isInvalid={errors.voucher && true}
                validationMessage={errors.voucher}
                maxLength={90}
              />

              <Button
                appearance="primary"
                type="submit"
                disabled={isSubmitting}
                marginBottom={majorScale(2)}
              >
                Redeem voucher
              </Button>
            </form>
          )}
        </Formik>
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(AccountRedeem)
