import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { formatErrorData } from '~/queries/helpers';
import { queryConstants } from '~/queries/queriesConstants';
import accessRequestService from '~/services/accessTransparency/accessRequestService';

export const refetchPendingAccessRequests = () => {
  queryClient.invalidateQueries({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'fetchPendingAccessRequests'],
  });
};

export const useFetchPendingAccessRequests = (
  subscriptionId: string,
  isAccessProtectionLoading: boolean,
  accessProtection: { enabled: boolean },
  params?: { page: number; size: number },
) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: [
      queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY,
      'fetchPendingAccessRequests',
      subscriptionId,
    ],
    queryFn: async () => {
      const response = await accessRequestService.getAccessRequests({
        page: params?.page ?? 0,
        size: params?.size || 1,
        search: `subscription_id='${subscriptionId}' and status.state='Pending'`,
      });

      return response;
    },
    enabled: !isAccessProtectionLoading && accessProtection?.enabled,
  });

  return {
    data: data?.data,
    isLoading,
    isError,
    error: isError ? formatErrorData(isLoading, isError, error) : error,
    isSuccess,
  };
};
