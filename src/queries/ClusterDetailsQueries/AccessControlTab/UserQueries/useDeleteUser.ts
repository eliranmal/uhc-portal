import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const useDeleteUser = (clusterID: string, region?: string) => {
  const { data, isPending, isError, error, mutate } = useMutation({
    mutationKey: ['deleteUser'],
    mutationFn: async ({ groupID, userID }: { groupID: string; userID: string }) => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.deleteClusterGroupUser(clusterID, groupID, userID);
        return response;
      }
      const response = clusterService.deleteClusterGroupUser(clusterID, groupID, userID);
      return response;
    },
  });

  if (isError) {
    const formatedError = formatErrorData(isPending, isError, error);

    return {
      data,
      isPending,
      isError,
      error: formatedError,
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
