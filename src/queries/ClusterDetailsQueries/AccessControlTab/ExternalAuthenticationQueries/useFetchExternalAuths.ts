import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { formatErrorData } from '~/queries/helpers';
import { queryConstants } from '~/queries/queriesConstants';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const refetchExternalAuths = () => {
  queryClient.invalidateQueries({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'useFetchExternalAuths'],
  });
};

export const useFetchExternalAuths = (region?: string, clusterID: string = '') => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'useFetchExternalAuths'],
    queryFn: async () => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = await clusterService.getExternalAuths(clusterID);
        return response;
      }

      const response = await clusterService.getExternalAuths(clusterID);
      return response;
    },
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
