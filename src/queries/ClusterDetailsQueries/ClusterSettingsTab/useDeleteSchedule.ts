import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

import { refetchSchedules } from './useGetSchedules';

export const useDeleteSchedule = (clusterID: string, isHypershift: boolean, region?: string) => {
  const { data, isPending, isError, error, mutate, reset, isSuccess } = useMutation({
    mutationKey: ['deleteSchedule'],
    mutationFn: async (scheduleID: string) => {
      const clusterServiceFunc = region ? getClusterServiceForRegion(region) : clusterService;
      const requestDelete = isHypershift
        ? clusterServiceFunc.deleteControlPlaneUpgradeSchedule
        : clusterServiceFunc.deleteUpgradeSchedule;
      const response = await requestDelete(clusterID, scheduleID);
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
      reset,
      isSuccess,
    };
  }

  return {
    data,
    isPending,
    isError,
    error,
    mutate,
    reset,
    isSuccess,
  };
};
