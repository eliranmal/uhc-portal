import { useQuery } from '@tanstack/react-query';

import { getClusterServiceForRegion } from '~/services/clusterService';

import { formatErrorData } from '../helpers';
import { queryConstants } from '../queriesConstants';

export const useFetchStorageQuotaValues = (region?: string) => {
  const { isPending, isFetched, isError, error, data } = useQuery({
    queryKey: ['ClusterService', 'getStorageQuotaValues', region || 'global'],
    queryFn: async () => {
      const clusterService = getClusterServiceForRegion(region);

      const results = await clusterService.getStorageQuotaValues();
      return results.data.items;
    },
    // This doesn't change depending on what cluster you use, so it can
    // have a longer stale time
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
