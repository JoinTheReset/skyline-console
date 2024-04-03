import React from 'react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Form, Input, Row, Col, List, Divider } from 'antd';
import useGoogle from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import { GoogleAddressParser } from './AddressParser';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDil4cEpmsoIKZhvZpY87oYigk24xj4UJ8';

const ContactDetails = ({ errors, values, handleChange }) => {
  const [displaySettings, setDisplaySettings] = React.useState({
    typed_address: '',
    should_hide_address_results: false,
  });
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = useGoogle({
    apiKey: GOOGLE_MAPS_API_KEY,
    options: {
      componentRestrictions: {
        country: values.country,
      },
    },
  });
  const setPlaceDetails = (place_name, place_id) => {
    placesService?.getDetails({ placeId: place_id }, (place) => {
      values.typed_address = place_name;
      values.address_components = place.address_components;
      console.log(values);
      const address = new GoogleAddressParser(values.address_components);
      console.log(address.result());
      values.address = address.result();
      setDisplaySettings({ address_components: address.result() });
    });
  };

  return (
    <Form layout="vertical">
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label="Email"
            required
            hasFeedback
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email}
          >
            <Input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={values.email}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Phone"
            required
            hasFeedback
            validateStatus={errors.phone ? 'error' : ''}
            help={errors.phone}
          >
            <Input
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              value={values.phone}
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
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password}
          >
            <Input.Password
              name="password"
              placeholder="Account Password"
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
            validateStatus={errors.password_confirm ? 'error' : ''}
            help={errors.password_confirm}
          >
            <Input.Password
              name="password_confirm"
              placeholder="Confirm Password"
              onChange={handleChange}
              value={values.password_confirm}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={24}>
          <Input.Search
            style={{ color: 'black' }}
            value={displaySettings.typed_address}
            placeholder="123 Wallaby Way Sydney"
            onChange={(evt) => {
              getPlacePredictions({ input: evt.target.value });
              if (evt.target.value.length > 3) {
                setDisplaySettings({ should_display_address_results: true });
              } else {
                setDisplaySettings({ should_display_address_results: false });
              }
            }}
            loading={isPlacePredictionsLoading}
          />
          <div style={{}}>
            {displaySettings.should_display_address_results &&
              !isPlacePredictionsLoading && (
                <List
                  dataSource={placePredictions}
                  renderItem={(item) => (
                    <List.Item
                      onClick={() => {
                        setPlaceDetails(
                          item.description,
                          item.place_id,
                          values
                        );
                        values.typed_address = item.description;
                        setDisplaySettings({
                          typed_address: item.description,
                          should_display_address_results: false,
                        });
                      }}
                    >
                      <List.Item.Meta title={item.description} />
                    </List.Item>
                  )}
                />
              )}
          </div>
        </Col>
      </Row>
      {displaySettings.address_components && (
        <>
          <Row gutter={24}>
            <Divider />

            <Col span={12}>
              <Form.Item
                label="Address Line 1"
                required
                hasFeedback
                validateStatus={errors.addressline1 ? 'error' : ''}
                help={errors.addressline1}
              >
                <Input
                  name="addressline1"
                  placeholder="123 Wallaby"
                  onChange={handleChange}
                  value={`${
                    values.address.premise
                      ? `${values.address.premise}/${values.address.street_number}`
                      : values.address.street_number
                  } ${values.address.street_name}`}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Address Line 2"
                hasFeedback
                validateStatus={errors.addressline2 ? 'error' : ''}
                help={errors.addressline2}
              >
                <Input name="addressline2" onChange={handleChange} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label="City"
                hasFeedback
                required
                validateStatus={errors.city ? 'error' : ''}
                help={errors.city}
              >
                <Input
                  name="city"
                  value={values.address.city}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="State"
                hasFeedback
                required
                validateStatus={errors.state ? 'error' : ''}
                help={errors.state}
              >
                <Input
                  name="state"
                  value={values.address.state}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label="Country"
                hasFeedback
                required
                validateStatus={errors.country ? 'error' : ''}
                help={errors.country}
              >
                <Input
                  name="country"
                  value={values.address.country}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Postal Code"
                hasFeedback
                required
                validateStatus={errors.postal_code ? 'error' : ''}
                help={errors.postal_code}
              >
                <Input
                  name="postal_code"
                  value={values.address.postal_code}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
    </Form>
  );
};
export default ContactDetails;
