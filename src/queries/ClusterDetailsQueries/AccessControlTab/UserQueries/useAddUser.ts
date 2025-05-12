import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import { clusterService } from '~/services';
import { getClusterServiceForRegion } from '~/services/clusterService';

export const useAddUser = (clusterID: string, region?: string) => {
  const { data, isPending, isError, error, mutate, isSuccess, reset } = useMutation({
    mutationKey: ['addUser'],
    mutationFn: async ({ selectedGroup, userId }: { selectedGroup: string; userId: string }) => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.addClusterGroupUser(clusterID, selectedGroup, userId);
        return response;
      }
      const response = clusterService.addClusterGroupUser(clusterID, selectedGroup, userId);
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
      isSuccess,
      reset,
    };
  }

  return {
    data,
    isPending,
    isError,
    error,
    mutate,
    isSuccess,
    reset,
  };
};
