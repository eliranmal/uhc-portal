import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { getCompleteFormClusterAutoscaling } from '~/components/clusters/common/clusterAutoScalingValues';
import { formatErrorData } from '~/queries/helpers';
import { queryConstants } from '~/queries/queriesConstants';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const refetchClusterAutoscalerData = (clusterID: string) => {
  queryClient.invalidateQueries({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'clusterAutoscaler', clusterID],
  });
};

export const useFetchClusterAutoscaler = (clusterID: string, region?: string) => {
  const { isLoading, data, isError, error, refetch, isStale, isRefetching } = useQuery({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'clusterAutoscaler', clusterID],
    queryFn: async () => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = await clusterService.getClusterAutoscaler(clusterID);
        const data = getCompleteFormClusterAutoscaling(response.data);
        return {
          data,
          hasAutoscaler: true,
        };
      }

      const response = await clusterService.getClusterAutoscaler(clusterID);
      const data = getCompleteFormClusterAutoscaling(response.data);

      return {
        data,
        hasAutoscaler: true,
      };
    },
    retry: false,
    enabled: !!clusterID,
  });
  if (isError) {
    return {
      isLoading,
      data,
      hasClusterAutoscaler: false,
      isError,
      error: formatErrorData(isLoading, isError, error),
      isRefetching,
    };
  }

  return {
    isLoading,
    data,
    hasClusterAutoscaler: data?.hasAutoscaler,
    isError,
    error,
    refetch,
    isStale,
    isRefetching,
  };
};
