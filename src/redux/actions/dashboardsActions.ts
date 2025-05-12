/*
Copyright (c) 2020 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an 'AS IS' BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { action, ActionType } from 'typesafe-actions';

import { SummaryVector } from '~/types/accounts_mgmt.v1';

import { accountManager, accountsService } from '../../services';
import { dashboardsConstants } from '../constants';

const getDashboard = () =>
  accountsService
    .getCurrentAccount()
    .then((organizationResponse) => organizationResponse.data?.organization?.id)
    .then((orgId) => {
      if (orgId) {
        return accountManager.getDashboard(orgId);
      }
      return Promise.reject(new Error('No logged in user'));
    })
    .then((dashboardResponse) => {
      const metrics: { [name: string]: SummaryVector[] } = {};
      const dashboard: { [name: string]: typeof metrics } = {};
      dashboardResponse.data.metrics.forEach((metric) => {
        if (metric.name) {
          metrics[metric.name] = metric.vector ?? [];
        }
      });
      if (dashboardResponse.data.name) {
        dashboard[dashboardResponse.data.name] = metrics;
      }
      return dashboard;
    });

const getSummaryDashboard = () => action(dashboardsConstants.GET_SUMMARY_DASHBOARD, getDashboard());

type QueryParams = Parameters<typeof accountsService.getUnhealthyClusters>[1];

const getUnhealthy = (params: QueryParams) =>
  accountsService
    .getCurrentAccount()
    .then((organizationResponse) => organizationResponse.data?.organization?.id)
    .then((orgId) => {
      if (orgId) {
        return accountsService.getUnhealthyClusters(orgId, params);
      }
      return Promise.reject(new Error('No logged in user'));
    });

const getUnhealthyClusters = (params: QueryParams) =>
  action(dashboardsConstants.GET_UNHEALTHY_CLUSTERS, getUnhealthy(params));

export { getSummaryDashboard, getUnhealthyClusters };

const dashboardsActions = {
  getSummaryDashboard,
  getUnhealthyClusters,
};

export type DashboardsAction = ActionType<typeof dashboardsActions>;

export default dashboardsActions;
