import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';
import { BreakGlassCredential } from '~/types/clusters_mgmt.v1';

export const usePostBreakGlassCredentials = (region?: string, clusterID: string = '') => {
  const { data, isPending, isError, error, mutate, reset } = useMutation({
    mutationKey: ['postBreakGlassCredentials'],
    mutationFn: async (data: BreakGlassCredential) => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.postBreakGlassCredentials(clusterID, data);
        return response;
      }

      const response = clusterService.postBreakGlassCredentials(clusterID, data);
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
