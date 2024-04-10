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

import client from 'client';
import { action, observable } from 'mobx';
import Base from 'stores/base';

export class OTPStore extends Base {
  @observable verified = false;

  @observable sent = false;

  get client() {
    return client.billing.otp;
  }

  @action
  send(mobile) {
    return this.submitting(this.client.send({ mobile })).then(() => {
      this.sent = true;
      this.remaining = 60;
    });
  }

  @action
  verify(data) {
    if (this.sent) {
      return this.submitting(
        this.client
          .verify(data)
          .then((response) => {
            console.log('This is the response');
            console.log(response);
            if (response.status === 'approved') {
              console.log('OTP was correct');
              this.verified = true;
              return true;
            }
            return false;
          })
          .catch((err) => {
            console.log('There was an error');
            console.log(err);
            return false;
          })
      );
    }
    return false;
  }
}

const globalOtpStore = new OTPStore();
export default globalOtpStore;
