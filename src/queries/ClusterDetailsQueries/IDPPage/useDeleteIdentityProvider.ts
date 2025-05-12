import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const useDeleteIdentityProvider = (clusterID: string, region?: string) => {
  const { data, isPending, isError, error, mutate } = useMutation({
    mutationKey: ['deleteIdentityProvider'],
    mutationFn: async (idpID: string) => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = await clusterService.deleteIdentityProvider(clusterID, idpID);
        return response;
      }
      const response = await clusterService.deleteIdentityProvider(clusterID, idpID);
      return response;
    },
  });

  if (isError) {
    const formattedError = formatErrorData(isPending, isError, error);
    return {
      data,
      isPending,
      isError,
      error: formattedError,
      mutate,
    };
  }

  return {
    data,
    isPending,
    isError,
    error,
    mutate,
  };
};
