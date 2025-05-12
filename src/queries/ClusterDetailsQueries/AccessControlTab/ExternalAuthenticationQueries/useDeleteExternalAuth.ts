import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const useDeleteExternalAuth = (region?: string, clusterID: string = '') => {
  const { data, isPending, isError, error, mutate, reset } = useMutation({
    mutationKey: ['deleteExternalAuth'],
    mutationFn: async (externalAuthProviderId: string) => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.deleteExternalAuth(clusterID, externalAuthProviderId);
        return response;
      }
      const response = clusterService.deleteExternalAuth(clusterID, externalAuthProviderId);
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
      reset,
    };
  }
  return {
    data,
    isPending,
    isError,
    error,
    mutate,
    reset,
  };
};
