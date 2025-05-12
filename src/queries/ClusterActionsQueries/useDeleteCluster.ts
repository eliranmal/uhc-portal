import { useMutation } from '@tanstack/react-query';

import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

import { formatErrorData } from '../helpers';

export const useDeleteCluster = () => {
  const { isSuccess, error, isError, isPending, mutate, reset } = useMutation({
    mutationKey: ['clusterService', 'delete_cluster'],
    mutationFn: ({ clusterID, region }: { clusterID: string; region?: string }) => {
      if (region) {
        const regionalClusterService = getClusterServiceForRegion(region);

        return regionalClusterService.deleteCluster(clusterID);
      }

      return clusterService.deleteCluster(clusterID);
    },
  });

  const errorData = formatErrorData(isPending, isError, error);

  return {
    isSuccess,
    error: errorData?.error,
    isError,
    isPending,
    mutate,
    reset,
  };
};
