import React, { PureComponent } from 'react'
import { Text, Button, toaster, majorScale, TextInputField } from 'evergreen-ui'
import { connect } from 'react-redux'
import pxlApi from 'pxl/Api'
import { Formik } from 'formik'
import Layout from 'components/Layout'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
  session: state.root.session,
})

class AccountUnlimit extends PureComponent {
  constructor() {
    super()
    this.submit = this.submit.bind(this)
  }
  async submit(values) {
    const res = await pxlApi.http_post('/users/@me/unlimit', true, values)
    if (!res.success) {
      toaster.danger('failed to unlimit account', {
        description: res.errors.join('\n'),
      })
      return
    }
    toaster.success(res.message)
  }

  render() {
    if (!this.props.profile.limited) {
      return (
        <Layout heading="Unlimit your account">
          <Text>Your account is not limited.</Text>
        </Layout>
      )
    }
    return (
      <Layout heading="Unlimit your account">
        <Formik
          initialValues={{
            invite: '',
          }}
          validate={(values) => {
            let errors = {}
            if (!values.invite) {
              errors.invite = 'Required'
            }
            if (values.invite && values.invite.length !== 40) {
              errors.invite = 'Invalid invite code'
            }
            return errors
          }}
          onSubmit={this.submit}
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
                label="Invite"
                onChange={handleChange}
                name="invite"
                onBlur={handleBlur}
                value={values.invite}
                isInvalid={errors.invite && true}
                validationMessage={errors.invite}
                maxLength={40}
              />

              <Button
                appearance="primary"
                type="submit"
                disabled={isSubmitting}
                marginBottom={majorScale(2)}
              >
                Unlimit
              </Button>
            </form>
          )}
        </Formik>
      </Layout>
    )
  }
}

export default connect(mapStateToProps)(AccountUnlimit)
