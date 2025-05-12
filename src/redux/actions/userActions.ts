import type { AxiosResponse } from 'axios';
import { action, ActionType } from 'typesafe-actions';

import { normalizeQuotaCost } from '../../common/normalize';
import { accountsService, authorizationsService } from '../../services';
import type { Organization, QuotaCost, QuotaCostList } from '../../types/accounts_mgmt.v1';
import type { UserInfo } from '../../types/types';
import { userConstants } from '../constants';
import type { AppThunk } from '../types';

const userInfoResponse = (payload: UserInfo) => action(userConstants.USER_INFO_RESPONSE, payload);

/** Normalize incoming quota. */
const processQuota = (
  response: AxiosResponse<QuotaCostList>,
): {
  items?: QuotaCost[] | undefined;
} => ({
  items: (response.data?.items ?? []).map(normalizeQuotaCost),
});

const fetchQuota = (organizationID: string) =>
  accountsService.getOrganizationQuota(organizationID).then(processQuota);

const fetchQuotaAndOrganization = (
  organizationID: string,
  organization?: Organization,
): Promise<{ quota: { items?: QuotaCost[] }; organization: Organization }> => {
  const promises: [ReturnType<typeof fetchQuota>, Promise<{ data: Organization }>] = [
    fetchQuota(organizationID),
    organization
      ? Promise.resolve({ data: organization })
      : accountsService.getOrganization(organizationID),
  ];
  return Promise.all(promises).then(([quota, organizationResponse]) => ({
    quota,
    organization: organizationResponse.data,
  }));
};

const fetchAccountThenQuotaAndOrganization = () =>
  accountsService.getCurrentAccount().then((response) => {
    const organizationID = response.data?.organization?.id;
    return organizationID !== undefined
      ? fetchQuotaAndOrganization(organizationID)
      : Promise.reject(Error('No organization'));
  });

const getOrganizationAndQuotaAction = (
  payload: Promise<{ quota: { items?: Array<QuotaCost> }; organization: Organization }>,
) => action(userConstants.GET_ORGANIZATION, payload);

const getOrganizationAndQuota = (): AppThunk => (dispatch, getState) => {
  const { userProfile } = getState();
  const organizationDetails = userProfile?.organization.fulfilled
    ? userProfile?.organization?.details
    : undefined;
  const organizationID = organizationDetails?.id;
  dispatch(
    getOrganizationAndQuotaAction(
      organizationID !== undefined
        ? fetchQuotaAndOrganization(organizationID, organizationDetails)
        : fetchAccountThenQuotaAndOrganization(),
    ),
  );
};

const selfTermsReview = () =>
  action(userConstants.SELF_TERMS_REVIEW, authorizationsService.selfTermsReview());

const userActions = {
  userInfoResponse,
  getOrganizationAndQuota,
  processQuota,
  selfTermsReview,
};

type UserAction = ActionType<
  typeof userInfoResponse | typeof getOrganizationAndQuotaAction | typeof selfTermsReview
>;

export { getOrganizationAndQuota, selfTermsReview, UserAction, userActions, userInfoResponse };
