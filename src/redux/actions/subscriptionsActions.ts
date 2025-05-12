/*
Copyright (c) 2018 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import type { AxiosResponse } from 'axios';
import { action, ActionType } from 'typesafe-actions';

import {
  SelfResourceReviewRequestAction,
  SelfResourceReviewRequestResource_type as SelfResourceReviewRequestResourceType,
} from '~/types/accounts_mgmt.v1';
import type { SubscriptionWithPermissionsList } from '~/types/types';

import { accountsService, authorizationsService } from '../../services';
import { subscriptionsConstants } from '../constants';
import { buildPermissionDict, INVALIDATE_ACTION } from '../reduxHelpers';

const fetchAccount = () =>
  action(subscriptionsConstants.GET_ACCOUNT, accountsService.getCurrentAccount());

const getSubscriptionsAndPermissions = async (
  params: Parameters<typeof accountsService.getSubscriptions>[0],
) => {
  let canEdit: { [clusterID: string]: boolean } = {};
  const permissionsResponse = await authorizationsService.selfResourceReview({
    action: SelfResourceReviewRequestAction.update,
    resource_type: SelfResourceReviewRequestResourceType.Cluster,
  });
  canEdit = buildPermissionDict(permissionsResponse);

  return (
    accountsService
      .getSubscriptions(params)
      // augmenting the SubscriptionList with permissions
      .then((response: AxiosResponse<SubscriptionWithPermissionsList>) => {
        response.data.items?.forEach((subscription) => {
          // TODO should avoid augmenting response types
          // eslint-disable-next-line no-param-reassign
          subscription.canEdit =
            canEdit['*'] || (!!subscription.cluster_id && !!canEdit[subscription.cluster_id]);
        });
        return response;
      })
  );
};

const getSubscriptions = (params: Parameters<typeof accountsService.getSubscriptions>[0]) =>
  action(subscriptionsConstants.GET_SUBSCRIPTIONS, getSubscriptionsAndPermissions(params));

const invalidateSubscriptions = () =>
  action(INVALIDATE_ACTION(subscriptionsConstants.GET_SUBSCRIPTIONS));

const fetchQuotaCost = (organizationID: string) =>
  action(
    subscriptionsConstants.GET_QUOTA_COST,
    accountsService.getOrganizationQuota(organizationID),
  );

const subscriptionsActions = {
  fetchAccount,
  fetchQuotaCost,
  getSubscriptions,
  invalidateSubscriptions,
};

type SubscriptionsAction = ActionType<typeof subscriptionsActions>;

export {
  fetchAccount,
  fetchQuotaCost,
  getSubscriptions,
  invalidateSubscriptions,
  SubscriptionsAction,
  subscriptionsActions,
};
