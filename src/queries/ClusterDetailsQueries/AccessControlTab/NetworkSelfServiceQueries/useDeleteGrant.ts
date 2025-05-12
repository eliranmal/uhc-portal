import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const useDeleteGrant = (clusterID: string, region?: string) => {
  const { data, isPending, isError, error, mutate, reset } = useMutation({
    mutationKey: ['deleteGrant'],
    mutationFn: async (grantId: string) => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.deleteGrant(clusterID, grantId);
        return response;
      }

      const response = clusterService.deleteGrant(clusterID, grantId);
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
      reset,
      mutate,
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
