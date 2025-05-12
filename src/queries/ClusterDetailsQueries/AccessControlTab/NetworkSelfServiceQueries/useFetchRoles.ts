import { useQuery } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import { queryConstants } from '~/queries/queriesConstants';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const useFetchRoles = (region?: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'fetchRoles'],
    queryFn: async () => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = await clusterService.getRoles();
        return response;
      }
      const response = clusterService.getRoles();
      return response;
    },
  });

  if (isError) {
    const formattedError = formatErrorData(isLoading, isError, error);

    return {
      data: data?.data.items?.map((role) => ({
        id: role.id,
        displayName: role.display_name || role.id,
        description: role.description,
      })),
      isLoading,
      isError,
      error: formattedError,
    };
  }

  return {
    data: data?.data.items?.map((role) => ({
      id: role.id,
      displayName: role.display_name || role.id,
      description: role.description,
    })),
    isLoading,
    isError,
    error,
  };
};
