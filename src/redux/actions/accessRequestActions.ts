import { action, ActionType } from 'typesafe-actions';

import { authorizationsService } from '~/services';
import accessRequestService from '~/services/accessTransparency/accessRequestService';
import { Decision } from '~/types/access_transparency.v1';
import {
  SelfAccessReviewAction,
  SelfAccessReviewResource_type as SelfAccessReviewResourceType,
} from '~/types/accounts_mgmt.v1';
import { ViewOptions } from '~/types/types';

import { accessRequestConstants } from '../constants';

const getAccessRequests = (subscriptionId: string, params: ViewOptions) =>
  action(
    accessRequestConstants.GET_ACCESS_REQUESTS,
    accessRequestService.getAccessRequests({
      page: params.currentPage,
      size: params.pageSize,
      search: `subscription_id='${subscriptionId}'`,
      orderBy: params.sorting.sortField
        ? `${params.sorting.sortField} ${params.sorting.isAscending ? 'asc' : 'desc'}`
        : undefined,
    }),
  );

const getAccessRequest = (id: string) =>
  action(
    accessRequestConstants.GET_ACCESS_REQUEST,
    accessRequestService.getAccessRequest(id).then((response) => response),
  );

const getPendingAccessRequests = (
  subscriptionId: string,
  params?: { page: number; size: number },
) =>
  action(
    accessRequestConstants.GET_PENDING_ACCESS_REQUESTS,
    accessRequestService.getAccessRequests({
      page: params?.page ?? 0,
      size: params?.size || 1,
      search: `subscription_id='${subscriptionId}' and status.state='Pending'`,
    }),
  );

const getOrganizationPendingAccessRequests = (
  organizationId: string,
  params?: { page: number; size: number },
) =>
  action(
    accessRequestConstants.GET_ORGANIZATION_PENDING_ACCESS_REQUESTS,
    accessRequestService.getAccessRequests({
      page: params?.page ?? 0,
      size: params?.size || 10,
      search: `organization_id='${organizationId}' and status.state='Pending'`,
    }),
  );

const postAccessRequestDecision = (id: string, decision: Decision) =>
  action(
    accessRequestConstants.POST_ACCESS_REQUEST_DECISION,
    accessRequestService.postAccessRequestDecision(id, decision),
  );

const canMakeDecision = (subscriptionId: string, organizationId: string) =>
  action(
    accessRequestConstants.CAN_MAKE_ACCESS_REQUEST_DECISION,
    authorizationsService.selfAccessReview({
      action: SelfAccessReviewAction.create,
      resource_type: SelfAccessReviewResourceType.AccessRequestDecision,
      subscription_id: subscriptionId,
      organization_id: organizationId,
    }),
  );

const resetAccessRequests = () => action(accessRequestConstants.RESET_ACCESS_REQUESTS);
const resetAccessRequest = () => action(accessRequestConstants.RESET_ACCESS_REQUEST);
const resetGetPendingAccessRequests = () =>
  action(accessRequestConstants.RESET_GET_PENDING_ACCESS_REQUESTS);
const resetOrganizationPendingAccessRequests = () =>
  action(accessRequestConstants.RESET_ORGANIZATION_PENDING_ACCESS_REQUESTS);
const resetPostAccessRequestDecision = () =>
  action(accessRequestConstants.RESET_POST_ACCESS_REQUEST_DECISION);
const resetCanMakeDecision = () =>
  action(accessRequestConstants.RESET_CAN_MAKE_ACCESS_REQUEST_DECISION);

const accessRequestActions = {
  getAccessRequests,
  getAccessRequest,
  getPendingAccessRequests,
  getOrganizationPendingAccessRequests,
  postAccessRequestDecision,
  canMakeDecision,
  resetAccessRequests,
  resetAccessRequest,
  resetGetPendingAccessRequests,
  resetOrganizationPendingAccessRequests,
  resetPostAccessRequestDecision,
  resetCanMakeDecision,
} as const;

type AccessRequestAction = ActionType<
  (typeof accessRequestActions)[keyof typeof accessRequestActions]
>;

export {
  AccessRequestAction,
  accessRequestActions,
  canMakeDecision,
  getAccessRequest,
  getAccessRequests,
  getPendingAccessRequests,
  postAccessRequestDecision,
  resetAccessRequest,
  resetAccessRequests,
  resetCanMakeDecision,
  resetGetPendingAccessRequests,
  resetPostAccessRequestDecision,
};
