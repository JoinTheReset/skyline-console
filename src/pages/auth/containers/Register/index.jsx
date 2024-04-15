// Copyright 2021 99cloud
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { FormikWizard } from 'formik-wizard-form';
import globalSkylineStore from 'stores/skyline/skyline';
import globalOtpStore from 'stores/billing/otp';
import globalAccountStore from 'stores/billing/account';
import { Row, Steps, Space, Button } from 'antd';
import * as Yup from 'yup';

import { WebSocketContext } from 'components/WebsocketContext';
import CountryDetails from './CountryDetails';
import ContactDetails from './ContactDetails';
import VerificationDetails from './VerificationDetails';

const { Step } = Steps;
const StepDivision = 33.33;

function includeWebsocketIdHook(RealComponent) {
  return function WrappedComponent(props) {
    const { websocketId } = React.useContext(WebSocketContext);
    return <RealComponent {...props} websocketId={websocketId} />;
  };
}

export class Register extends Component {
  constructor(props) {
    super(props);
    this.init();
    const isTesting = true;
    this.state = {
      error: false, // eslint-disable-line react/no-unused-state
      initialValues: {
        account: {
          email: isTesting ? 'k@rl.ag' : '',
          emailConfirmation: isTesting ? 'k@rl.ag' : '',
          firstName: isTesting ? 'Karl' : '',
          lastName: isTesting ? 'Kloppenborg' : '',
          password: isTesting ? 'P@ssw0rd' : '',
          passwordConfirmation: isTesting ? 'P@ssw0rd' : '',
          otpCode: '',
          mobile: isTesting ? '+61437239565' : '',
        },
        address: {
          addressline1: isTesting ? '589 Paine Street' : '',
          addressline2: '',
          city: isTesting ? 'Albury' : '',
          state: isTesting ? 'New South Wales' : '',
          country: isTesting ? 'Australia' : '',
          postalCode: isTesting ? '2640' : '',
        },
      },
      message: '', // eslint-disable-line react/no-unused-state
      loading: false, // eslint-disable-line react/no-unused-state
    };
  }

  get rootStore() {
    return this.props.rootStore;
  }

  get info() {
    const { info = {} } = this.rootStore;
    return info || {};
  }

  init() {
    this.store = globalSkylineStore;
    this.formRef = React.createRef();
  }

  submitForm(values) {
    const sendingData = {
      ...values,
      websocketId: this.props.websocketId.current,
    };
    globalAccountStore
      .create(sendingData)
      .then((resp) => {
        this.rootStore.updateTempUser({
          ...values,
          domain_id: resp.domainId,
          default_region: resp.defaultRegion,
        });
        this.rootStore.routing.push('/auth/register/setup');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <>
        <h1>Registration</h1>
        <FormikWizard
          hidden={this.state.isSubmitted}
          initialValues={this.state.initialValues}
          validateOnNext
          activeStepIndex={0}
          onSubmit={(values) => {
            this.submitForm(values);
          }}
          steps={[
            {
              component: CountryDetails,
              validationSchema: Yup.object().shape({
                country: Yup.string().required('Country is required'),
                state: Yup.string().required('State or territory required'),
              }),
            },
            {
              component: ContactDetails,
              validationSchema: Yup.object().shape({
                account: Yup.object().shape({
                  firstName: Yup.string().required('First Name is required'),
                  lastName: Yup.string().required('Last Name is required'),
                  email: Yup.string()
                    .email()
                    .required('Valid email address required'),
                  emailConfirmation: Yup.string()
                    .email()
                    .required('Email confirmation required')
                    .oneOf([Yup.ref('email'), null], 'Emails must match'),
                }),
                address: Yup.object().shape({
                  addressline1: Yup.string().required('Address is required'),
                  city: Yup.string().required('City is required'),
                  state: Yup.string().required('State is required'),
                  postalCode: Yup.string().required('Post Code is required'),
                  country: Yup.string().required('Country is required'),
                }),
              }),
            },
            {
              component: VerificationDetails,
              validationSchema: Yup.object().shape({
                account: Yup.object().shape({
                  password: Yup.string()
                    .required('Password is required')
                    .min(6, 'Password must contain 6 or more characters')
                    .matches(
                      /^(?=.*[a-z])/,
                      'Password must contain at least one lowercase letter'
                    )
                    .matches(
                      /^(?=.*[A-Z])/,
                      'Password must contain at least one uppercase letter'
                    )
                    .matches(
                      /^(?=.*[0-9])/,
                      'Password must contain at least one number'
                    )
                    .matches(
                      /^(?=.*[!@#$%^&*])/,
                      'Password must contain at least one special character'
                    ),
                  passwordConfirmation: Yup.string()
                    .required('Confirmation is required')
                    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
                  otpCode: Yup.string()
                    .required('Code is required')
                    .min(6, 'Code is six numbers')
                    .test('verify', 'Code incorrect', function (code) {
                      if (globalOtpStore.verified) {
                        return true;
                      }
                      if (code.length === 6 && globalOtpStore.sent) {
                        return globalOtpStore.verify({
                          mobile: this.parent.mobile,
                          code,
                        });
                      }
                      return true;
                    }),
                }),
              }),
            },
          ]}
        >
          {({
            currentStepIndex,
            renderComponent,
            handlePrev,
            handleNext,
            isNextDisabled,
            isPrevDisabled,
            isSubmitting,
          }) => {
            return (
              <Space direction="vertical" size="middle">
                <Steps
                  current={currentStepIndex}
                  percent={StepDivision * (currentStepIndex + 1)}
                >
                  <Step title="Country" />
                  <Step title="Contact Details" />
                  <Step title="Verification" />
                </Steps>
                {renderComponent()}
                <Row justify="space-between">
                  <Button
                    disabled={isPrevDisabled}
                    type="primary"
                    onClick={handlePrev}
                  >
                    Previous
                  </Button>
                  <Button
                    disabled={isNextDisabled || isSubmitting}
                    type="primary"
                    onClick={handleNext}
                  >
                    {currentStepIndex === 2 ? 'Finish' : 'Next'}
                  </Button>
                </Row>
              </Space>
            );
          }}
        </FormikWizard>
      </>
    );
  }
}

export default inject('rootStore')(includeWebsocketIdHook(observer(Register)));
