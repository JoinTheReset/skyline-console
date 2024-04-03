export class GoogleAddressParser {
  address = {};

  constructor(address_components) {
    this.address_components = address_components;
    this.parseAddress();
  }

  parseAddress() {
    if (!Array.isArray(this.address_components)) {
      throw Error('Address Components is not an array');
    }

    if (!this.address_components.length) {
      throw Error('Address Components is empty');
    }

    for (let i = 0; i < this.address_components.length; i++) {
      const component = this.address_components[i];

      if (this.isSubAddress(component)) {
        this.address.premise = component.long_name;
      }

      if (this.isStreetNumber(component)) {
        this.address.street_number = component.long_name;
      }

      if (this.isStreetName(component)) {
        this.address.street_name = component.long_name;
      }

      if (this.isCity(component)) {
        this.address.city = component.long_name;
      }

      if (this.isCountry(component)) {
        this.address.country = component.long_name;
      }

      if (this.isState(component)) {
        this.address.state = component.long_name;
      }

      if (this.isPostalCode(component)) {
        this.address.postal_code = component.long_name;
      }
    }
  }

  isStreetNumber(component) {
    return component.types.includes('street_number');
  }

  isStreetName(component) {
    return component.types.includes('route');
  }

  isCity(component) {
    return component.types.includes('locality');
  }

  isState(component) {
    return component.types.includes('administrative_area_level_1');
  }

  isCountry(component) {
    return component.types.includes('country');
  }

  isPostalCode(component) {
    return component.types.includes('postal_code');
  }

  isSubAddress(component) {
    return component.types.includes('subpremise');
  }

  result() {
    return this.address;
  }
}
