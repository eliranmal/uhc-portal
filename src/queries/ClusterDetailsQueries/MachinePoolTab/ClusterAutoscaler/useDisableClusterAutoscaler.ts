import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import { getClusterServiceForRegion } from '~/services/clusterService';

import { invalidateClusterDetailsQueries } from '../../useFetchClusterDetails';

import { refetchClusterAutoscalerData } from './useFetchClusterAutoscaler';

export const useDisableClusterAutoscaler = (clusterID: string, region?: string) => {
  const { data, isPending, isError, error, mutate, mutateAsync, isSuccess } = useMutation({
    mutationKey: ['clusterAutoscaler', 'disableClusterAutoscaler', clusterID],
    mutationFn: async () => {
      const clusterService = getClusterServiceForRegion(region);
      const response = clusterService.disableClusterAutoscaler(clusterID);
      return response;
    },
    onSuccess: () => {
      refetchClusterAutoscalerData(clusterID);
      invalidateClusterDetailsQueries();
    },
  });
  const errorData = formatErrorData(isPending, isError, error);

  return {
    data,
    isPending,
    isError,
    error: errorData,
    mutate,
    mutateAsync,
    isSuccess,
  };
};
