import { useMutation } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { formatErrorData } from '~/queries/helpers';
import { getOrganizationAndQuota } from '~/redux/actions/userActions';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';
import { AddOnInstallation } from '~/types/clusters_mgmt.v1';

export const useAddClusterAddOn = (region?: string) => {
  const { data, isError, error, isPending, mutate, mutateAsync, isSuccess, reset } = useMutation({
    mutationKey: ['addClusterAddOn'],
    mutationFn: async ({
      clusterID,
      addOnData,
    }: {
      clusterID: string;
      addOnData: AddOnInstallation;
    }) => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.addClusterAddOn(clusterID, addOnData);
        return response;
      }

      const response = clusterService.addClusterAddOn(clusterID, addOnData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clusterAddOns'] });
      queryClient.invalidateQueries({ queryKey: ['addOns'] });
      getOrganizationAndQuota();
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
      reset,
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
    reset,
  };
};
