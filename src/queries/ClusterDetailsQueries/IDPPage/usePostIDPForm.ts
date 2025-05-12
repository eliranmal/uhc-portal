import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';
import { IdentityProvider } from '~/types/clusters_mgmt.v1';

export const usePostIDPForm = (clusterID: string, region?: string) => {
  const { data, isPending, isError, error, mutate, isSuccess } = useMutation({
    mutationKey: ['postIDPForm'],
    mutationFn: async (formData: IdentityProvider) => {
      const editIDPForm = formData.id;
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = editIDPForm
          ? await clusterService.editClusterIdentityProvider(clusterID, formData)
          : await clusterService.createClusterIdentityProvider(clusterID, formData);
        return response;
      }
      const response = editIDPForm
        ? await clusterService.editClusterIdentityProvider(clusterID, formData)
        : await clusterService.createClusterIdentityProvider(clusterID, formData);
      return response;
    },
  });

  if (isError) {
    const formattedError = formatErrorData(isPending, isError, error);
    return {
      data,
      isPending,
      mutate,
      isError,
      error: formattedError,
      isSuccess,
    };
  }

  return {
    data,
    isPending,
    mutate,
    isError,
    error,
    isSuccess,
  };
};
