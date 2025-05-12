import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { queryConstants } from '~/queries/queriesConstants';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const useInvalidateFetchClusterStatus = async () => {
  await queryClient.invalidateQueries({ queryKey: ['clusterStatus'] });
};

export const useFetchClusterStatus = (
  clusterID: string,
  region?: string,
  refetchInterval?: boolean,
) => {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: [
      queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY,
      'clusterStatus',
      'clusterService',
      clusterID,
    ],
    queryFn: async () => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = await clusterService.getClusterStatus(clusterID);
        return response;
      }
      const response = await clusterService.getClusterStatus(clusterID);
      return response;
    },
    retry: false,
    refetchInterval: refetchInterval ? 5000 : undefined,
    enabled: !!clusterID,
  });
  return {
    isLoading,
    data: data?.data,
    isError,
    error,
  };
};
