import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { formatErrorData } from '~/queries/helpers';
import { queryConstants } from '~/queries/queriesConstants';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';
import type { BreakGlassCredential } from '~/types/clusters_mgmt.v1';

export const refetchBreakGlassCredentials = () => {
  queryClient.invalidateQueries({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'useFetchBreakGlassCredentials'],
  });
};

export const useFetchBreakGlassCredentials = (
  canUpdateBreakGlassCredentials?: boolean,
  region?: string,
  clusterId: string = '',
) => {
  const { data, isLoading, isError, isFetching, error } = useQuery({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'useFetchBreakGlassCredentials'],
    queryFn: async () => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.getBreakGlassCredentials(clusterId);
        return response;
      }

      const response = clusterService.getBreakGlassCredentials(clusterId);
      return response;
    },
    enabled: !!canUpdateBreakGlassCredentials,
  });

  if (isError) {
    const formattedError = formatErrorData(isLoading, isError, error);

    return {
      data: data?.data.items as BreakGlassCredential[],
      isLoading,
      isError,
      error: formattedError,
      isFetching,
    };
  }

  return {
    data: data?.data.items as BreakGlassCredential[],
    isLoading,
    isError,
    error,
    isFetching,
  };
};
