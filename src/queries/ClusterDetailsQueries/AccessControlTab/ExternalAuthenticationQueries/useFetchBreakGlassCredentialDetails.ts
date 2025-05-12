import { useQuery } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import { queryConstants } from '~/queries/queriesConstants';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const useFetchBreakGlassCredentialDetails = (
  region?: string,
  clusterID: string = '',
  credentialID: string = '',
) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY,
      'useFetchBreakGlassCredentialDetails',
    ],
    queryFn: async () => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.getBreakGlassCredentialDetails(clusterID, credentialID);
        return response;
      }

      const response = clusterService.getBreakGlassCredentialDetails(clusterID, credentialID);
      return response;
    },
    enabled: !!clusterID && !!credentialID,
  });

  if (isError) {
    const formattedError = formatErrorData(isLoading, isError, error);
    return {
      data: data?.data,
      isLoading,
      isError,
      error: formattedError,
    };
  }

  return {
    data: data?.data,
    isLoading,
    isError,
    error,
  };
};
