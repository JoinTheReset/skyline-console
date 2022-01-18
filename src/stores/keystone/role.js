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

import { action, observable } from 'mobx';
import client from 'client';
import Base from 'stores/base';

export class RoleStore extends Base {
  get client() {
    return client.keystone.roles;
  }

  @observable
  implyRoles = {};

  @action
  async fetchImpliedRoles({ id }) {
    const rolesResult = await this.client.implies.list(id);
    const {
      role_inference: { implies },
    } = rolesResult;
    const sources = [
      'nova',
      'neutron',
      'glance',
      'placement',
      'heat',
      'keystone',
      'cinder',
    ];
    const sourceRole = {};
    sources.forEach((source) => {
      const roles = [];
      implies.forEach((it) => {
        if (it.name.indexOf(source) !== -1) {
          const role = it.name.split(`${source}_`)[1];
          roles.push(role);
        }
      });
      sourceRole[source] = roles;
    });
    this.isLoading = false;
    this.implyRoles = sourceRole;
  }
}

const globalRoleStore = new RoleStore();
export default globalRoleStore;
