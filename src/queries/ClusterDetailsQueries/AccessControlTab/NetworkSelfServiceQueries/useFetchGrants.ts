import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const refetchGrants = () => {
  queryClient.invalidateQueries({ queryKey: ['fetchGrants'] });
};

export const useFetchGrants = (cluserID: string, refetchInterval?: boolean, region?: string) => {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['fetchGrants'],
    queryFn: async () => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = await clusterService.getGrants(cluserID);
        return response;
      }
      const response = clusterService.getGrants(cluserID);
      return response;
    },
    refetchInterval: refetchInterval ? 5000 : undefined,
  });

  if (isError) {
    const formattedError = formatErrorData(isLoading, isError, error);

    return {
      data: data?.data.items,
      isLoading,
      isError,
      error: formattedError,
      isFetching,
    };
  }

  return {
    data: data?.data.items,
    isLoading,
    isError,
    error,
    isFetching,
  };
};
