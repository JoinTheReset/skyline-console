import React from 'react';
import { Form, Input, Row, Col, Button } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { InputOTP } from 'antd-input-otp';
import { getIn } from 'formik';
import globalOtpStore from 'stores/billing/otp';

const VerificationDetails = ({
  errors,
  values,
  handleChange,
  setFieldValue,
}) => {
  const [otpDisplay, setOtpDisplay] = React.useState(false);
  const otpRefText = 'Send Code';
  const otpButtonDisable = false;
  const [otpText, setOtpText] = React.useState(otpRefText);
  const textRef = React.useRef(otpRefText);
  const otpButtonDisableRef = React.useRef(otpButtonDisable);
  const [otpButtonDisabled, setOtpButtonDisabled] =
    React.useState(otpButtonDisable);
  React.useEffect(() => {
    textRef.current = otpText;
    otpButtonDisableRef.current = otpButtonDisabled;
  });
  const sendOTP = () => {
    console.log('Send OTP now');
    setOtpDisplay(true);
    setOtpButtonDisabled(true);
    globalOtpStore
      .send(values.account.mobile)
      .then(() => {
        setOtpText('Retry in 60');

        let countDown = 60;
        const timer = setInterval(() => {
          if (globalOtpStore.verified) {
            clearInterval(timer);
            return;
          }
          if (countDown < 1) {
            clearInterval(timer);
            setOtpButtonDisabled(otpButtonDisable);
            setOtpText(otpRefText);
          } else {
            countDown--;
            setOtpText(`Retry in ${countDown}`);
          }
        }, 1000);
      })
      .catch(() => {
        setOtpButtonDisabled(otpButtonDisable);
        setOtpText(otpRefText);
      });
  };

  return (
    <Form layout="vertical">
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label="Mobile Phone Number"
            required
            hasFeedback
            validateStatus={getIn(errors, 'account.mobile') ? 'error' : ''}
            help={getIn(errors, 'account.mobile')}
          >
            <PhoneInput
              name="account.mobile"
              placeholder="Enter phone number"
              value={values.account.mobile}
              onChange={(ev) => {
                setFieldValue('account.mobile', ev);
                if (ev) {
                  handleChange(ev);
                }
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Send OTP">
            <Button
              type="primary"
              disabled={
                !isValidPhoneNumber(
                  values.account.mobile ? values.account.mobile : ''
                ) ||
                otpButtonDisabled ||
                globalOtpStore.verified
              }
              onClick={sendOTP}
            >
              {globalOtpStore.verified ? 'Code Verified' : otpText}
            </Button>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            label="Please enter the code sent to your mobile"
            name="otp"
            hidden={!otpDisplay}
            required
            hasFeedback
            validateStatus={getIn(errors, 'account.otpCode') ? 'error' : ''}
            help={getIn(errors, 'account.otpCode')}
          >
            <InputOTP
              name="account.otpCode"
              inputType="numeric"
              hidden={!otpDisplay}
              disabled={globalOtpStore.verified}
              length={6}
              value={values.account.otpCode}
              onChange={(ev) => {
                setFieldValue('account.otpCode', ev.filter((n) => n).join(''));
                handleChange(ev.filter((n) => n).join(''));
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label="Password"
            required
            hasFeedback
            validateStatus={getIn(errors, 'account.password') ? 'error' : ''}
            help={getIn(errors, 'account.password')}
          >
            <Input.Password
              name="account.password"
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
            validateStatus={
              getIn(errors, 'account.passwordConfirmation') ? 'error' : ''
            }
            help={getIn(errors, 'account.passwordConfirmation')}
          >
            <Input.Password
              name="account.passwordConfirmation"
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
};

export default VerificationDetails;
