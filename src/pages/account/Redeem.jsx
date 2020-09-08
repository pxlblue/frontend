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
import Layout from 'components/Layout'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
  session: state.root.session,
})

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
    return (
      <Layout heading="Redeem a Voucher">
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
      </Layout>
    )
  }
}

export default connect(mapStateToProps)(AccountRedeem)
