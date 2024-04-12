import React from 'react';
import { Form, Row, Col } from 'antd';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

const CountryDetails = ({ errors, values, handleChange, handleBlur }) => {
  return (
    <Form layout="vertical">
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            label="Country"
            required
            hasFeedback
            validateStatus={errors.email ? 'error' : ''}
            help={errors.country}
          >
            <CountryDropdown
              name="country"
              priorityOptions={['AU', 'CA', 'US', 'GB']}
              valueType="short"
              value={values.country}
              onChange={(_, e) => handleChange(e)}
              onBlur={handleBlur}
              style={{
                fontSize: 14,
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={24}>
          <Form.Item label="State or Territory">
            <RegionDropdown
              name="state"
              countryValueType="short"
              disableWhenEmpty
              country={values.country}
              value={values.state}
              onChange={(_, e) => handleChange(e)}
              onBlur={handleBlur}
              style={{
                fontSize: 14,
              }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default CountryDetails;
