import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const useRevokeBreakGlassCredentials = (clusterID: string, region?: string) => {
  const { data, isPending, isError, error, mutate, reset } = useMutation({
    mutationKey: ['revokeBreakGlassCredentials'],
    mutationFn: async () => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.revokeBreakGlassCredentials(clusterID);
        return response;
      }

      const response = clusterService.revokeBreakGlassCredentials(clusterID);
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
