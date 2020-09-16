import React, { Component, PureComponent } from 'react'
import {
  Pane,
  Text,
  Button,
  minorScale,
  toaster,
  Alert,
  majorScale,
  Heading,
  Link,
  TextInputField,
} from 'evergreen-ui'
import { connect } from 'react-redux'
import pxlApi from 'pxl/Api'
import Layout from 'components/Layout'
import { Formik } from 'formik'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
  session: state.root.session,
})

class MatrixForm extends Component {
  async createAccount(values, { setSubmitting }) {
    const res = await pxlApi.http_post('/matrix/register', true, {
      password: values.password,
    })
    if (!res.success) {
      toaster.danger('Failed to create matrix account', {
        description: res.errors.join('\n'),
      })
      return setSubmitting(false)
    }
    toaster.success(res.message)
    await pxlApi.getMe()
    setSubmitting(false)
  }
  render() {
    return (
      <Pane display="flex" flexDirection="column">
        <Formik
          initialValues={{
            password: '',
          }}
          validate={(values) => {
            if (!values.password) {
              return { password: 'Required' }
            }
            if (values.password.length < 8) {
              return { password: 'Must be more than 8 characters long' }
            }
            return {}
          }}
          onSubmit={this.createAccount.bind(this)}
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
              <Pane display="flex" flexDirection="row" alignItems="center">
                <TextInputField
                  label="Password"
                  description="We cannot transfer your password from pxl to Matrix, so you must enter a password. We won't help you recover your account unless you add an email to your Matrix account."
                  name="password"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
              </Pane>

              <Button
                appearance="primary"
                type="submit"
                disabled={isSubmitting}
                marginTop={minorScale(1)}
                marginBottom={majorScale(2)}
              >
                Create account
              </Button>
            </form>
          )}
        </Formik>
      </Pane>
    )
  }
}

class AccountMatrix extends PureComponent {
  render() {
    const { profile } = this.props
    return (
      <Layout heading="Matrix account">
        {profile && profile.matrixAccountCreated && (
          <Alert intent="warning">
            <Text>
              You have already created a matrix account. Its user ID is{' '}
              <Link
                href={`https://matrix.to/#/@${profile.username.toLowerCase()}:pxl.blue`}
              >
                @{profile.username.toLowerCase()}:pxl.blue
              </Link>
            </Text>
          </Alert>
        )}

        <Pane>
          <Text>
            After creating your account, you may use{' '}
            <Link href="https://app.element.io/">Element.io</Link> to sign in.
            Use username @{profile.username.toLowerCase()}:pxl.blue or sign in
            with homeserver URL https://synapse.pxl.so
          </Text>
        </Pane>

        <Heading size={500} marginTop={majorScale(1)}>
          Create account
        </Heading>

        <MatrixForm />
      </Layout>
    )
  }
}

export default connect(mapStateToProps)(AccountMatrix)
