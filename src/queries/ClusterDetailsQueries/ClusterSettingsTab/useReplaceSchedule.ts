import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';
import { UpgradePolicy } from '~/types/clusters_mgmt.v1';

import { refetchSchedules } from './useGetSchedules';

export const useReplaceSchedule = (clusterID: string, isHypershift: boolean, region?: string) => {
  const { data, isPending, isError, error, mutate } = useMutation({
    mutationKey: ['replaceSchedule'],
    mutationFn: async ({
      oldScheduleID,
      newSchedule,
    }: {
      oldScheduleID: string;
      newSchedule: UpgradePolicy;
    }) => {
      const clusterServiceFunc = region ? getClusterServiceForRegion(region) : clusterService;
      const requestDelete = isHypershift
        ? clusterServiceFunc.deleteControlPlaneUpgradeSchedule
        : clusterServiceFunc.deleteUpgradeSchedule;
      const requestPost = isHypershift
        ? clusterServiceFunc.postControlPlaneUpgradeSchedule
        : clusterServiceFunc.postUpgradeSchedule;

      const response = await requestDelete(clusterID, oldScheduleID).then(() =>
        requestPost(clusterID, newSchedule),
      );

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
