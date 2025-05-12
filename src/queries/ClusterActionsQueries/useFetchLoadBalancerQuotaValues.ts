import { useQuery } from '@tanstack/react-query';

import { getClusterServiceForRegion } from '~/services/clusterService';

import { formatErrorData } from '../helpers';
import { queryConstants } from '../queriesConstants';

export const useFetchLoadBalancerQuotaValues = (region?: string) => {
  const { isPending, isFetched, isError, error, data } = useQuery({
    queryKey: ['ClusterService', 'getLoadBalancerQuotaValues', region || 'global'],
    queryFn: async () => {
      const clusterService = getClusterServiceForRegion(region);

      const results = await clusterService.getLoadBalancerQuotaValues();
      return results.data.items;
    },
    staleTime: queryConstants.STALE_TIME_60_SEC,
  });
  return {
    isPending,
    isFetched,
    isError,
    error: isError && error ? formatErrorData(isPending, isError, error)?.error : null,
    data,
  };
};
