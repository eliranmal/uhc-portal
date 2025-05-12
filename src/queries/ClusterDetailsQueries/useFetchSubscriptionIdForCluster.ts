import { AxiosResponse } from 'axios';
import { validate as isUuid } from 'uuid';

import { useQuery } from '@tanstack/react-query';

import { SubscriptionList } from '~/types/accounts_mgmt.v1';

import { accountsService } from '../../services';
import { formatErrorData } from '../helpers';

export const useFetchSubscriptionIdForCluster = (clusterID: string) => {
  const { data, isLoading, isError, error, isFetched } = useQuery({
    queryKey: ['accountService', 'getSubscription', 'clusterId', clusterID],
    queryFn: async () => {
      let response: AxiosResponse<SubscriptionList, any>;
      if (isUuid(clusterID)) {
        response = await accountsService.fetchSubscriptionByExternalId(clusterID);
      } else {
        response = await accountsService.fetchSubscriptionByClusterId(clusterID);
      }

      return response?.data;
    },
  });

  return {
    subscriptionID: data?.items?.[0]?.id,
    isLoading,
    isError,
    isFetched,
    error: formatErrorData(isLoading, isError, error)?.error,
  };
};
