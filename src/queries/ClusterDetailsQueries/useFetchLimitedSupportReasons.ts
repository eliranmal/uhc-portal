import { useQuery } from '@tanstack/react-query';

import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';
import { SubscriptionCommonFieldsStatus } from '~/types/accounts_mgmt.v1';

import { SubscriptionResponseType } from '../types';

/**
 * Query for fetching limited support reasons based on region
 * @param clusterID cluster ID to pass into api call
 * @param subscription Axios response from subscription (required this way for query enablement)
 * @param mainQueryKey used for refetch
 * @returns list of Limited Support Reasons
 */
export const useFetchLimitedSupportReasons = (
  clusterID: string,
  subscription: SubscriptionResponseType | undefined,
  mainQueryKey: string,
) => {
  const { isLoading, data, isFetching } = useQuery({
    queryKey: [mainQueryKey, 'limitedSupportReasons', 'clusterService', clusterID, subscription],
    queryFn: async () => {
      if (subscription?.subscription.rh_region_id) {
        const clusterService = getClusterServiceForRegion(subscription?.subscription.rh_region_id);
        const response = await clusterService.getLimitedSupportReasons(clusterID);
        return response;
      }
      const response = await clusterService.getLimitedSupportReasons(clusterID);
      return response;
    },
    enabled:
      !!subscription &&
      subscription.subscription.status !== SubscriptionCommonFieldsStatus.Deprovisioned &&
      (subscription.subscription.managed || subscription.isAROCluster),
  });

  return {
    isLoading,
    data,
    isFetching,
  };
};
