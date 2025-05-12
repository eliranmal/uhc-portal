import { useMutation } from '@tanstack/react-query';

import { getClusterServiceForRegion } from '~/services/clusterService';

import { formatErrorData } from '../helpers';

export const useHibernateCluster = () => {
  const { isSuccess, error, isError, isPending, mutate, reset } = useMutation({
    mutationKey: ['clusterService', 'hibernate_cluster'],
    mutationFn: ({ clusterID, region }: { clusterID: string; region?: string }) => {
      const clusterService = getClusterServiceForRegion(region);
      return clusterService.hibernateCluster(clusterID);
    },
  });

  return {
    isSuccess,
    error: isError && error ? formatErrorData(isPending, isError, error)?.error : null,
    isError,
    isPending,
    mutate,
    reset,
  };
};
