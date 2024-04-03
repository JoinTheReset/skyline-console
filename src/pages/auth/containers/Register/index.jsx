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
import { Row, Steps, Space, Button } from 'antd';
import * as Yup from 'yup';

import CountryDetails from './CountryDetails';
import ContactDetails from './ContactDetails';

const { Step } = Steps;
const StepDivision = 33.33;

export class Register extends Component {
  constructor(props) {
    super(props);
    this.init();
    this.state = {
      error: false, // eslint-disable-line react/no-unused-state
      initialValues: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        country: '',
        should_hide_address_results: true,
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

  renderExtra() {
    return null;
  }

  render() {
    return (
      <>
        <h1>Registration</h1>
        <FormikWizard
          initialValues={this.state.initialValues}
          validateOnNext
          activeStepIndex={0}
          onSubmit={(values) => {
            console.log('Here is values');
            console.log(values);
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
          }) => {
            return (
              <Space direction="vertical" size="middle">
                <Steps
                  current={currentStepIndex}
                  percent={StepDivision * currentStepIndex}
                >
                  <Step title="Country" />
                  <Step title="Contact Details" />
                  <Step title="Billing Details" />
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
                    disabled={isNextDisabled}
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
        {this.renderExtra()}
      </>
    );
  }
}

export default inject('rootStore')(observer(Register));
