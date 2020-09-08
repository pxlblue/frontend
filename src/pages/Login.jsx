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

class Login extends PureComponent {
  async onSubmit(values, { setSubmitting }) {
    const res = await pxlApi.login(values.username, values.password)
    if (!res.success) {
      // failed to login :(
      toaster.danger('Failed to login', {
        description: res.errors.join('\n'),
      })
      return setSubmitting(false)
    }

    setSubmitting(false)
  }
  render() {
    const { loggedIn, profile } = this.props
    if (loggedIn) {
      return (
        <Layout heading="Login">
          <Text>You're already logged in as {profile.username}</Text>
        </Layout>
      )
    }
    return (
      <Layout heading="Login">
        <Formik
          initialValues={{
            username: '',
            password: '',
            rememberMe: true,
          }}
          validate={(values) => {
            let errors = {}
            if (!values.username) {
              errors.username = 'Required'
            } else if (
              values.username.includes('@') &&
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.username)
            ) {
              errors.username = 'Invalid email address'
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
                label="Password"
                onChange={handleChange}
                name="password"
                type="password"
                onBlur={handleBlur}
                value={values.password}
                isInvalid={errors.password && true}
                validationMessage={errors.password}
              />
              <Pane
                display="flex"
                flexDirection="row"
                alignItems="center"
                marginBottom={majorScale(3)}
              >
                <Switch
                  name="rememberMe"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  checked={values.rememberMe}
                />
                <Text marginLeft={majorScale(1)}>Remember me</Text>
              </Pane>
              <Button
                appearance="primary"
                type="submit"
                disabled={isSubmitting}
              >
                Login
              </Button>
            </form>
          )}
        </Formik>
      </Layout>
    )
  }
}

export default connect(mapStateToProps)(Login)
