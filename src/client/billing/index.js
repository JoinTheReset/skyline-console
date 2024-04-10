import { billingBase, billingEndpoint } from 'client/client/constants';

import Base from '../client/base';

export class BillingClient extends Base {
  get baseUrl() {
    return billingBase();
  }

  get enable() {
    return !!billingEndpoint();
  }

  get resources() {
    return [
      {
        key: 'otp',
        isResource: false,
        extendOperations: [
          {
            key: 'send',
            method: 'post',
          },
          {
            key: 'verify',
            method: 'post',
          },
        ],
      },
    ];
  }
}

const billingClient = new BillingClient();
export default billingClient;
