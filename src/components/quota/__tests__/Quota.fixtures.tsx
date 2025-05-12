import React from 'react';
import type { AxiosResponse } from 'axios';

import { Account, QuotaCost, QuotaCostList } from '~/types/accounts_mgmt.v1';

import { subscriptionsConstants } from '../../../redux/constants';
import { subscriptionsReducer } from '../../../redux/reducers/subscriptionsReducer';
import { FULFILLED_ACTION } from '../../../redux/reduxHelpers';
import {
  dbaAddon,
  dedicatedRhInfra,
  unlimitedROSA,
} from '../../clusters/common/__tests__/quota_cost.fixtures';
import Quota from '../Quota';

const fetchAccount = jest.fn();
const fetchQuotaCost = jest.fn();
const invalidateClusters = jest.fn();

const organizationID = 'org-1';

const account: React.ComponentProps<typeof Quota>['account'] = {
  error: false,
  fulfilled: true,
  pending: false,
  valid: true,
  data: {
    username: 'test',
    organization: {
      id: organizationID,
    },
  } as Account,
};

const buildState = (quotaCostItems: QuotaCost[]) => {
  const action = {
    type: FULFILLED_ACTION(subscriptionsConstants.GET_QUOTA_COST),
    payload: { data: { items: quotaCostItems } } as unknown as AxiosResponse<QuotaCostList>,
  };
  return subscriptionsReducer(undefined, action).quotaCost;
};

const emptyQuotaCost = buildState([]);
const quotaCost = buildState([...dedicatedRhInfra, ...unlimitedROSA, ...dbaAddon] as QuotaCost[]);
// unlimitedROSA only contains 0-cost quota so is not shown.
const expectedRowsForQuotaCost = dedicatedRhInfra.length + 0 + dbaAddon.length;

const rows: string[][] = [];

export {
  account,
  emptyQuotaCost,
  expectedRowsForQuotaCost,
  fetchAccount,
  fetchQuotaCost,
  invalidateClusters,
  organizationID,
  quotaCost,
  rows,
};
