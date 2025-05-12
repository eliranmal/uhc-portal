import { useMutation } from '@tanstack/react-query';

import { getClusterServiceForRegion } from '~/services/clusterService';

import { formatErrorData } from '../helpers';
//
export const useUpdateDeleteProtections = () => {
  const { data, isPending, isError, error, isSuccess, mutate, reset } = useMutation({
    mutationKey: ['updateDeleteProtection'],
    mutationFn: async ({
      clusterID,
      region,
      isProtected,
    }: {
      clusterID: string;
      region?: string;
      isProtected: boolean;
    }) => {
      const clusterService = getClusterServiceForRegion(region);
      const response = await clusterService.updateDeleteProtection(clusterID, isProtected);
      return response;
    },
  });

  return {
    data,
    isPending,
    isError,
    error: isError && error ? formatErrorData(isPending, isError, error)?.error : null,
    mutate,
    isSuccess,
    reset,
  };
};
