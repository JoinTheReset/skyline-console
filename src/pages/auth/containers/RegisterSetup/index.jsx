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
import globalSkylineStore from 'stores/skyline/skyline';
// import { Row, Steps, Space, Button } from 'antd';

export class RegisterSetup extends Component {
  constructor(props) {
    super(props);
    this.init();
    this.state = {
      error: false, // eslint-disable-line react/no-unused-state
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
  }

  render() {
    return (
      <>
        <h1>Setting up Account</h1>
      </>
    );
  }
}

export default inject('rootStore')(observer(RegisterSetup));
