import React, { PureComponent } from 'react'
import {
  Pane,
  Heading,
  Text,
  TextInputField,
  Button,
  toaster,
  Switch,
  majorScale,
} from 'evergreen-ui'
import { Formik } from 'formik'
import pxlApi from 'pxl/Api'
import { connect } from 'react-redux'
import Layout from 'components/Layout'

const mapStateToProps = (state) => ({
  pathname: state.router.location.pathname,
  profile: state.root.profile,
  loggedIn: state.root.loggedIn,
})

class Signup extends PureComponent {
  async onSubmit(values, { setSubmitting }) {
    const res = await pxlApi.signup(
      values.username,
      values.email,
      values.password,
      values.invite
    )
    if (!res.success) {
      // failed to login :(
      toaster.danger('Failed to sign up', {
        description: res.errors.join('\n'),
      })
      return setSubmitting(false)
    }
    toaster.success('Successfully signed up', {
      description: res.message,
    })
    setSubmitting(false)
  }
  render() {
    const { loggedIn, profile } = this.props
    if (loggedIn) {
      return (
        <Layout heading="Register" enableMargins>
          <Text>You're already logged in as {profile.username}</Text>
        </Layout>
      )
    }
    return (
      <Layout heading="Register" enableMargins>
        <Formik
          initialValues={{
            username: '',
            email: '',
            invite: '',
            password: '',
          }}
          validate={(values) => {
            let errors = {}
            if (!values.username) {
              errors.username = 'Required'
            }
            if (!values.email) {
              errors.email = 'Required'
            }
            if (
              values.email &&
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = 'Invalid email address'
            }
            if (!values.invite) {
              errors.invite = 'Required'
            }
            if (values.invite && values.invite.length !== 40) {
              errors.invite = 'Invalid invite code'
            }
            if (!values.password) {
              errors.password = 'Required'
            }
            return errors
          }}
          onSubmit={this.onSubmit.bind(this)}
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
                label="Username"
                onChange={handleChange}
                name="username"
                onBlur={handleBlur}
                value={values.username}
                isInvalid={errors.username && true}
                validationMessage={errors.username}
              />
              <TextInputField
                label="E-mail Address"
                onChange={handleChange}
                name="email"
                onBlur={handleBlur}
                value={values.email}
                isInvalid={errors.email && true}
                validationMessage={errors.email}
              />
              <TextInputField
                label="Invite Code"
                onChange={handleChange}
                name="invite"
                onBlur={handleBlur}
                value={values.invite}
                isInvalid={errors.invite && true}
                validationMessage={errors.invite}
                maxLength={40}
              />
              <TextInputField
                label="Password"
                onChange={handleChange}
                name="password"
                type="password"
                onBlur={handleBlur}
                value={values.password}
                isInvalid={errors.password && true}
                validationMessage={errors.password}
              />
              <Button
                appearance="primary"
                type="submit"
                disabled={isSubmitting}
              >
                Sign up
              </Button>
            </form>
          )}
        </Formik>
      </Layout>
    )
  }
}

export default connect(mapStateToProps)(Signup)
