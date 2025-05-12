import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { formatErrorData } from '~/queries/helpers';
import { queryConstants } from '~/queries/queriesConstants';
import { isRestrictedEnv } from '~/restrictedEnv';
import accessProtectionService from '~/services/accessTransparency/accessProtectionService';

export const refetchAccessProtection = () => {
  queryClient.invalidateQueries({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'fetchAccessProtection'],
  });
};

export const useFetchAccessProtection = (subscriptionId: string) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'fetchAccessProtection'],
    queryFn: async () => {
      const response = await accessProtectionService.getAccessProtection({ subscriptionId });
      return response;
    },
    enabled: !!subscriptionId && !isRestrictedEnv(),
  });

  return {
    data: data?.data,
    isLoading,
    isError,
    error: isError ? formatErrorData(isLoading, isError, error) : error,
    isSuccess,
  };
};
