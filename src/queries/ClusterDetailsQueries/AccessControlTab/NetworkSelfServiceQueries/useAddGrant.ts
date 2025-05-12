import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import { getClusterService, getClusterServiceForRegion } from '~/services/clusterService';

export const useAddGrant = (clusterID: string, region?: string) => {
  const { data, isPending, isError, error, mutateAsync, reset } = useMutation({
    mutationKey: ['addGrant'],
    mutationFn: async ({ roleId, arn }: { roleId: string; arn: string }) => {
      const clusterService = region ? getClusterServiceForRegion(region) : getClusterService();
      const response = await clusterService.addGrant(clusterID, roleId, arn);
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
      mutateAsync,
      reset,
    };
  }

  return {
    data,
    isPending,
    isError,
    error,
    mutateAsync,
    reset,
  };
};
