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
import { action, ActionType } from 'typesafe-actions';

import { SubscriptionPatchRequest } from '~/types/accounts_mgmt.v1';

import { accountsService } from '../../services';
import { subscriptionSettingsConstants } from '../constants';

const editSubscriptionSettings = (subscriptionID: string, data: SubscriptionPatchRequest) =>
  action(
    subscriptionSettingsConstants.EDIT_SUBSCRIPTION_SETTINGS,
    accountsService.editSubscription(subscriptionID, data),
  );

const clearEditSubscriptionSettingsResponse = () =>
  action(subscriptionSettingsConstants.CLEAR_EDIT_SUBSCRIPTION_SETTINGS_RESPONSE);

const subscriptionSettingsActions = {
  editSubscriptionSettings,
  clearEditSubscriptionSettingsResponse,
};

type SubscriptionSettingsAction = ActionType<typeof subscriptionSettingsActions>;

export {
  subscriptionSettingsActions,
  editSubscriptionSettings,
  clearEditSubscriptionSettingsResponse,
  SubscriptionSettingsAction,
};
