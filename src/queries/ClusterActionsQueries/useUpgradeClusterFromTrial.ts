import { useMutation } from '@tanstack/react-query';

import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';
import { Cluster } from '~/types/clusters_mgmt.v1';

import { formatErrorData } from '../helpers';

export const useUpgradeClusterFromTrial = () => {
  const { data, isPending, isError, error, mutate, isSuccess } = useMutation({
    mutationKey: ['upgradeClusterFromTrial'],
    mutationFn: ({
      clusterID,
      params,
      region,
    }: {
      clusterID: string;
      params: Cluster;
      region?: string;
    }) => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        return clusterService.upgradeTrialCluster(clusterID, params);
      }
      return clusterService.upgradeTrialCluster(clusterID, params);
    },
  });

  return {
    data,
    isPending,
    isError,
    error: isError ? formatErrorData(isPending, isError, error) : error,
    mutate,
    isSuccess,
  };
};
