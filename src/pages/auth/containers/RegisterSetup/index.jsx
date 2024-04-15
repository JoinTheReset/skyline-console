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
import { Row, Col, Space, Progress, Divider } from 'antd';

import { WebSocketContext } from 'components/WebsocketContext';

function includeWebsocketIdHook(RealComponent) {
  return function WrappedComponent(props) {
    const { websocketId, lastJsonMessage } = React.useContext(WebSocketContext);
    return (
      <RealComponent
        {...props}
        websocketId={websocketId}
        lastJsonMessage={lastJsonMessage}
      />
    );
  };
}
export class RegisterSetup extends Component {
  constructor(props) {
    super(props);
    this.init();
    this.state = {
      error: false, // eslint-disable-line react/no-unused-state
      message: '', // eslint-disable-line react/no-unused-state
      loading: false, // eslint-disable-line react/no-unused-state
      progress: {
        total: 6,
        step: 0,
        message: 'Starting setup process...',
      },
    };
  }

  componentDidUpdate() {
    if (this.props.lastJsonMessage.type === 'progress_report') {
      if (this.state.progress !== this.props.lastJsonMessage) {
        this.setState({ progress: this.props.lastJsonMessage }); // eslint-disable-line react/no-did-update-set-state
      }
    } else if (this.props.lastJsonMessage.type === 'redirect_to') {
      const body = {
        domain: this.rootStore.temp_new_user.domain_id,
        password: this.rootStore.temp_new_user.account.password,
        region: this.rootStore.temp_new_user.default_region,
        username: this.rootStore.temp_new_user.account.email,
      };
      this.rootStore.login(body).then(
        () => {
          this.rootStore.routing.push(this.props.lastJsonMessage.path);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  get currentPercentage() {
    return Math.trunc(
      (this.state.progress.step / this.state.progress.total) * 100
    );
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
        <Space
          align="center"
          direction="vertical"
          size="middle"
          style={{ display: 'flex' }}
        >
          <Row gutter={24} justify="center" align="top">
            <Col span={24}>
              <h1>Setting up Account</h1>
            </Col>
          </Row>
          <Divider />
          <Row gutter={24} justify="center" align="top">
            <Col span={24}>
              <Progress type="circle" percent={this.currentPercentage} />
            </Col>
          </Row>
          <Row gutter={24} justify="center" align="top">
            <Col span={24}>
              <h3>{this.state.progress.message}</h3>
            </Col>
          </Row>
        </Space>
      </>
    );
  }
}

export default inject('rootStore')(
  includeWebsocketIdHook(observer(RegisterSetup))
);
