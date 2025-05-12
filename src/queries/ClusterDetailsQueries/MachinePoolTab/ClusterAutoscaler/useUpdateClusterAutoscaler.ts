import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';
import { ClusterAutoscaler } from '~/types/clusters_mgmt.v1';

import { refetchClusterAutoscalerData } from './useFetchClusterAutoscaler';

export const useUpdateClusterAutoscaler = (clusterID: string, region?: string) => {
  const { data, isPending, isSuccess, isError, error, mutate, mutateAsync } = useMutation({
    mutationKey: ['clusterAutoscaler', 'updateClusterAutoscaler', clusterID],
    mutationFn: async (autoscaler: ClusterAutoscaler) => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.updateClusterAutoscaler(clusterID, autoscaler);
        return response;
      }

      const response = clusterService.updateClusterAutoscaler(clusterID, autoscaler);
      return response;
    },
    onSuccess: () => {
      refetchClusterAutoscalerData(clusterID);
    },
  });

  const errorData = formatErrorData(isPending, isError, error);

  return {
    data,
    isPending,
    isSuccess,
    isError,
    error: errorData,
    mutate,
    mutateAsync,
  };
};
