import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';
import { UpgradePolicy } from '~/types/clusters_mgmt.v1';

import { refetchSchedules } from './useGetSchedules';

export const useEditSchedule = (clusterID: string, isHypershift?: boolean, region?: string) => {
  const { data, isPending, isError, error, mutate, mutateAsync, isSuccess } = useMutation({
    mutationKey: ['editSchedule'],
    mutationFn: async ({ policyID, schedule }: { policyID: string; schedule: UpgradePolicy }) => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        if (isHypershift) {
          const response = await clusterService.patchControlPlaneUpgradeSchedule(
            clusterID,
            policyID,
            schedule,
          );
          return response;
        }
        const response = await clusterService.patchUpgradeSchedule(clusterID, policyID, schedule);
        return response;
      }
      if (isHypershift) {
        const response = clusterService.patchControlPlaneUpgradeSchedule(
          clusterID,
          policyID,
          schedule,
        );
        return response;
      }
      const response = clusterService.patchUpgradeSchedule(clusterID, policyID, schedule);
      return response;
    },
    onSuccess: () => {
      refetchSchedules();
    },
  });

  if (isError) {
    const formattedError = formatErrorData(isPending, isError, error);
    return {
      data,
      isPending,
      isError,
      error: formattedError.error,
      mutate,
      mutateAsync,
      isSuccess,
    };
  }

  return {
    data,
    isPending,
    isError,
    error,
    mutate,
    mutateAsync,
    isSuccess,
  };
};
