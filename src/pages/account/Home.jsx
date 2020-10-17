import React, { PureComponent } from 'react'
import {
  Button,
  majorScale,
  Pane,
  Text,
  TextInputField,
  Heading,
  toaster,
  Alert,
} from 'evergreen-ui'
import { connect } from 'react-redux'
import pxlApi from 'pxl/Api'
import { Formik } from 'formik'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
})

function ChangePassword() {
  async function onSubmit(values, { setSubmitting }) {
    setSubmitting(true)
    const res = await pxlApi.http_patch('/users/@me', true, {
      password: values.oldPassword,
      newPassword: values.password,
    })
    if (!res.success) {
      toaster.danger('error setting password', {
        description: res.errors.join('\n'),
      })
      setSubmitting(false)
      return
    }
    toaster.success(res.message)
    setSubmitting(false)
  }
  return (
    <Formik
      initialValues={{
        oldPassword: '',
        password: '',
        confirmPassword: '',
      }}
      validate={(values) => {
        let errors = {}
        if (!values.oldPassword) {
          errors.oldPassword = 'Required'
        }
        if (!values.password) {
          errors.password = 'Required'
        }
        if (
          values.confirmPassword !== values.password &&
          !values.password.startsWith(values.confirmPassword)
        ) {
          errors.confirmPassword = 'Password does not match'
        }
        return errors
      }}
      onSubmit={onSubmit}
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
            label="Existing Password"
            description="We need your existing password to authorize the request"
            onChange={handleChange}
            name="oldPassword"
            type="password"
            onBlur={handleBlur}
            value={values.oldPassword}
            isInvalid={errors.oldPassword && true}
            validationMessage={errors.oldPassword}
          />
          <TextInputField
            label="New Password"
            onChange={handleChange}
            name="password"
            type="password"
            onBlur={handleBlur}
            value={values.password}
            isInvalid={errors.password && true}
            validationMessage={errors.password}
          />
          <TextInputField
            label="Confirm Password"
            onChange={handleChange}
            name="confirmPassword"
            type="password"
            onBlur={handleBlur}
            value={values.confirmPassword}
            isInvalid={errors.confirmPassword && true}
            validationMessage={errors.confirmPassword}
          />
          <Button appearance="primary" type="submit" disabled={isSubmitting}>
            Change password
          </Button>
        </form>
      )}
    </Formik>
  )
}

function ChangeEmail() {
  async function onSubmit(values, { setSubmitting }) {
    setSubmitting(true)
    const res = await pxlApi.http_patch('/users/@me', true, {
      password: values.password,
      email: values.email,
    })
    if (!res.success) {
      toaster.danger('error setting email', {
        description: res.errors.join('\n'),
      })
      setSubmitting(false)
      return
    }
    toaster.success(res.message)
    setSubmitting(false)
  }
  return (
    <Formik
      initialValues={{
        password: '',
        email: '',
      }}
      validate={(values) => {
        let errors = {}

        if (!values.password) {
          errors.password = 'Required'
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
        return errors
      }}
      onSubmit={onSubmit}
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
            label="Password"
            description="We need your existing password to authorize the request"
            onChange={handleChange}
            name="password"
            type="password"
            onBlur={handleBlur}
            value={values.password}
            isInvalid={errors.password && true}
            validationMessage={errors.password}
          />
          <TextInputField
            label="Email"
            onChange={handleChange}
            name="email"
            type="email"
            onBlur={handleBlur}
            value={values.email}
            isInvalid={errors.email && true}
            validationMessage={errors.email}
          />
          <Button appearance="primary" type="submit" disabled={isSubmitting}>
            Change email
          </Button>
        </form>
      )}
    </Formik>
  )
}

class AccountHome extends PureComponent {
  render() {
    return (
      <Pane>
        <Text>
          Welcome to your account dashboard. Select a tab on your left to get
          started.
        </Text>
        {this.props.profile.limited && (
          <Alert intent="warning" marginBottom={majorScale(2)}>
            <Text>
              Your account is limited and locked to a Discord user with ID{' '}
              {this.props.profile.limitedId}. You may unlimit your account by
              pressing the Unlimit tab on the sidebar and entering a full
              invite.
            </Text>
          </Alert>
        )}
        <Pane marginTop={majorScale(2)}>
          <Heading size={500}>Identity</Heading>
          <Pane width={500}>
            <Heading size={400}>Update Password</Heading>
            <ChangePassword />

            <Heading size={400} marginTop={majorScale(2)}>
              Update Email
            </Heading>
            <ChangeEmail />
          </Pane>
        </Pane>
        <Pane marginTop={majorScale(2)}>
          <Button onClick={pxlApi.logout} intent="danger" appearance="minimal">
            Logout
          </Button>
        </Pane>
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(AccountHome)
