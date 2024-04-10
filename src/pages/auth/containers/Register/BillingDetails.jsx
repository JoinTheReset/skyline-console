import React from 'react';
import { Form, Input, Row, Col } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const BillingDetails = ({ errors, values, handleChange }) => (
  <Form layout="vertical">
    <Row gutter={24}>
      <Col span={24}>
        <Form.Item
          label="Company Name"
          required
          hasFeedback
          validateStatus={errors.company_name ? 'error' : ''}
          help={errors.company_name}
        />
      </Col>
    </Row>

    <Row gutter={24}>
      <Col span={12}>
        <Form.Item
          label="Password"
          required
          hasFeedback
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password}
        >
          <Input.Password
            name="password"
            placeholder="Account Password"
            autoComplete="new-password"
            onChange={handleChange}
            value={values.password}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Password Confirm"
          required
          hasFeedback
          validateStatus={errors.passwordConfirmation ? 'error' : ''}
          help={errors.passwordConfirmation}
        >
          <Input.Password
            name="passwordConfirmation"
            placeholder="Confirm Password"
            autoComplete="new-password"
            onChange={handleChange}
            value={values.passwordConfirmation}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
      </Col>
    </Row>
  </Form>
);

export default BillingDetails;
