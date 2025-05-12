import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { accountsService } from '~/services';

import { useFetchOrganizationQuota } from '../ClusterDetailsQueries/useFetchOrganizationQuota';
import { formatErrorData } from '../helpers';
import { queryConstants } from '../queriesConstants';

export type FetchQueryResults = UseQueryResult & {
  data?: {
    managedClusters?: any[];
    aiClusters?: any[];
  };
};

export const useFetchOrganizationAndQuota = () => {
  const {
    isLoading: isOrgIdLoading,
    isError: isOrgIdError,
    data: orgIdData,
    error: orgIdError,
    isFetched: isOrgIdFetched,
  } = useQuery({
    queryKey: [queryConstants.FETCH_ORG_AND_QUOTA, 'getCurrentOrganizationId'],
    queryFn: () => accountsService.getCurrentAccount(),
  });

  const orgID = orgIdData?.data?.organization?.id;

  const {
    isLoading: quotaIsLoading,
    isError: quotaIsError,
    data: quotaData,
    rawError: quotaError,
    // @ts-ignore technically orgID cannot be undefined, but the queryFn isn't run unless orgID has a value = see enabled inside of useFetchOrganizationQuota
  } = useFetchOrganizationQuota(orgID);

  const {
    isLoading: orgIsLoading,
    isError: orgIsError,
    data: orgData,
    error: orgError,
    isFetched: orgIsFetched,
  } = useQuery({
    queryKey: [queryConstants.FETCH_ORG_AND_QUOTA, 'getOrganization'],
    // @ts-ignore technically orgID cannot be undefined, but the queryFn isn't run unless orgID has a value = see enabled
    queryFn: () => accountsService.getOrganization(orgID),
    enabled: !!orgID,
  });

  const isLoading = isOrgIdLoading || quotaIsLoading || orgIsLoading;
  const isError = isOrgIdError || quotaIsError || orgIsError;
  const error = orgIdError || quotaError || orgError;

  return {
    isLoading,
    isError,
    error: isError && error ? formatErrorData(isLoading, isError, error)?.error : null,
    isFetched: isOrgIdFetched && !quotaIsLoading && orgIsFetched,
    id: orgID,
    quota: quotaData?.organizationQuota,
    organization: orgData,
  };
};
