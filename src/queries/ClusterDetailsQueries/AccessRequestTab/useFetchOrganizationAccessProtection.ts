import { useQuery } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import { queryConstants } from '~/queries/queriesConstants';
import accessProtectionService from '~/services/accessTransparency/accessProtectionService';

export const useFetchOrganizationAccessProtection = (organizationId: string) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'fetchOrganizationAccessProtection'],
    queryFn: async () => {
      const response = await accessProtectionService.getAccessProtection({ organizationId });
      return response;
    },
  });

  return {
    data: data?.data,
    isLoading,
    isError,
    error: isError ? formatErrorData(isLoading, isError, error) : error,
    isSuccess,
  };
};
