import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';
import { ExternalAuth } from '~/types/clusters_mgmt.v1';

export const useAddEditExternalAuth = (clusterID: string, region?: string) => {
  const { data, isPending, isError, error, mutate } = useMutation({
    mutationKey: ['addEditExternalAuth'],
    mutationFn: async ({
      values,
      externalAuthProviderId,
    }: {
      values: ExternalAuth;
      externalAuthProviderId?: string;
    }) => {
      const service = region ? getClusterServiceForRegion(region) : clusterService;
      // Edit request
      if (externalAuthProviderId) {
        const request = service.patchExternalAuth;
        return request(clusterID || '', externalAuthProviderId, values);
      }

      // Creation request
      const request = service.postExternalAuth;
      return request(clusterID || '', values);
    },
  });

  if (isError) {
    const formattedError = formatErrorData(isPending, isError, error);

    return {
      data,
      isPending,
      isError,
      error: formattedError,
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
