import React from 'react';
import { Form, Input, Row, Col, List, Divider } from 'antd';
import useGoogle from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import { getIn } from 'formik';
import { GoogleAddressParser } from './AddressParser';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDil4cEpmsoIKZhvZpY87oYigk24xj4UJ8';

const ContactDetails = ({ errors, values, handleChange, setFieldValue }) => {
  const [displaySettings, setDisplaySettings] = React.useState({
    typed_address: '',
    computed_address: '',
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
      const address = new GoogleAddressParser(place.address_components);
      values.address = address.result();
      console.log(values.address);
      let computed_address = '';
      if (values.address.premise) {
        computed_address = `${values.address.premise}/${values.address.street_number} ${values.address.street_name}`;
      } else {
        computed_address = `${values.address.street_number} ${values.address.street_name}`;
      }
      values.address.addressline1 = computed_address;
      setDisplaySettings({
        address_components: address.result(),
        computed_address,
      });
      // We must set the formik field values to carry over the requirements here
      setFieldValue('address.addressline1', computed_address);
      setFieldValue('address.state', values.address.state);
      setFieldValue('address.city', values.address.city);
      setFieldValue('address.country', values.address.country);
      setFieldValue('address.postalCode', values.address.postal_code);
    });
  };

  return (
    <Form layout="vertical">
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label="First Name"
            required
            hasFeedback
            validateStatus={getIn(errors, 'account.firstName') ? 'error' : ''}
            help={getIn(errors, 'account.firstName')}
          >
            <Input
              name="account.firstName"
              placeholder="John"
              autoComplete="firstName"
              onChange={handleChange}
              value={values.account.firstName}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Last Name"
            required
            hasFeedback
            validateStatus={getIn(errors, 'account.lastName') ? 'error' : ''}
            help={getIn(errors, 'account.lastName')}
          >
            <Input
              name="account.lastName"
              placeholder="Smith"
              autoComplete="lastName"
              onChange={handleChange}
              value={values.account.lastName}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label="Email"
            required
            hasFeedback
            validateStatus={getIn(errors, 'account.email') ? 'error' : ''}
            help={getIn(errors, 'account.email')}
          >
            <Input
              name="account.email"
              placeholder="Email"
              autoComplete="email"
              onChange={handleChange}
              value={values.account.email}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Email Confirmation"
            required
            hasFeedback
            validateStatus={
              getIn(errors, 'account.emailConfirmation') ? 'error' : ''
            }
            help={getIn(errors, 'account.emailConfirmation')}
          >
            <Input
              name="account.emailConfirmation"
              placeholder="Email Confirmation"
              onChange={handleChange}
              value={values.account.emailConfirmation}
            />
          </Form.Item>
        </Col>
      </Row>
      <Divider gutter={24} />
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
      <Divider />
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label="Address Line 1"
            hasFeedback
            required
            validateStatus={
              getIn(errors, 'address.addressline1') ? 'error' : ''
            }
            help={getIn(errors, 'address.addressline1')}
          >
            <Input
              name="address.addressline1"
              placeholder="123 Wallaby"
              onChange={handleChange}
              value={values.address.addressline1}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Address Line 2"
            hasFeedback
            validateStatus={
              getIn(errors, 'address.addressline2') ? 'error' : ''
            }
            help={getIn(errors, 'address.addressline2')}
          >
            <Input
              name="address.addressline2"
              onChange={handleChange}
              value={values.address.addressline2}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label="City"
            hasFeedback
            required
            validateStatus={getIn(errors, 'address.city') ? 'error' : ''}
            help={getIn(errors, 'address.city')}
          >
            <Input
              name="address.city"
              placeholder="Sydney"
              onChange={handleChange}
              value={values.address.city}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="State"
            hasFeedback
            validateStatus={getIn(errors, 'address.state') ? 'error' : ''}
            help={getIn(errors, 'address.state')}
          >
            <Input
              name="address.state"
              placeholder="New South Wales"
              onChange={handleChange}
              value={values.address.state}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label="Country"
            hasFeedback
            required
            validateStatus={getIn(errors, 'address.country') ? 'error' : ''}
            help={getIn(errors, 'address.country')}
          >
            <Input
              name="address.country"
              placeholder="Australia"
              onChange={handleChange}
              value={values.address.country}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Postal Code"
            hasFeedback
            validateStatus={getIn(errors, 'address.postalCode') ? 'error' : ''}
            help={getIn(errors, 'address.postalCode')}
          >
            <Input
              name="address.postalCode"
              placeholder="2000"
              onChange={handleChange}
              value={values.address.postalCode}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default ContactDetails;
