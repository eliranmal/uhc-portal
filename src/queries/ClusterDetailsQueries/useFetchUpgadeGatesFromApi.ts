import { useQuery } from '@tanstack/react-query';

import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

import { formatErrorData } from '../helpers';
import { queryConstants } from '../queriesConstants';

export const useFetchUpgradeGatesFromApi = (isManaged: boolean, region?: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'upgradeGatesFromApi'],
    queryFn: async () => {
      const clusterServiceFunc = region ? getClusterServiceForRegion(region) : clusterService;
      const response = clusterServiceFunc.getUpgradeGates();
      return response;
    },
    enabled: isManaged,
  });

  if (isError) {
    const formattedError = formatErrorData(isLoading, isError, error);
    return {
      data: data?.data.items,
      isLoading,
      isError,
      error: formattedError,
    };
  }

  return {
    data: data?.data.items,
    isLoading,
    isError,
    error,
  };
};
