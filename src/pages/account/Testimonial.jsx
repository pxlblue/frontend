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

class TestimonialForm extends Component {
  state = {
    testimonial: '',
  }
  async componentDidMount() {
    const res = await pxlApi.http_get('/users/@me/testimonial', true)
    if (!res.success) {
      toaster.danger('Failed to get testimonial', {
        description: res.errors.join('\n'),
      })
      return
    }
    this.setState({ testimonial: res.testimonial.testimonial })
  }
  async updateTestimonial(values, { setSubmitting }) {
    const res = await pxlApi.http_post('/users/@me/testimonial', true, {
      testimonial: values.testimonial,
    })
    if (!res.success) {
      toaster.danger('Failed to update testimonial', {
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
            testimonial: this.state.testimonial,
          }}
          validate={(values) => {
            if (!values.testimonial) {
              return { testimonial: 'Required' }
            }
            if (values.testimonial.length > 100) {
              return { testimonial: 'Must be more than 8 characters long' }
            }
            return {}
          }}
          onSubmit={this.updateTestimonial.bind(this)}
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
                  label="Testimonial"
                  description="Max 100 characters. No bad words!"
                  name="testimonial"
                  type="testimonial"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.testimonial}
                  maxLength={100}
                />
              </Pane>

              <Button
                appearance="primary"
                type="submit"
                disabled={isSubmitting}
                marginTop={minorScale(1)}
                marginBottom={majorScale(2)}
              >
                Update Testimonial
              </Button>
            </form>
          )}
        </Formik>
      </Pane>
    )
  }
}

class AccountTestimonial extends PureComponent {
  render() {
    const { profile } = this.props
    return (
      <Layout heading="Testimonial">
        <Pane>
          <Text>
            Create a testimonial that will display proudly on the home page of
            pxl.blue
          </Text>
        </Pane>

        <Heading size={500} marginTop={majorScale(1)}>
          Create or update
        </Heading>

        <TestimonialForm />
      </Layout>
    )
  }
}

export default connect(mapStateToProps)(AccountTestimonial)
