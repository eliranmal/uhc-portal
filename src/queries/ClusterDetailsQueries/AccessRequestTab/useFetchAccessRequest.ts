import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { formatErrorData } from '~/queries/helpers';
import { queryConstants } from '~/queries/queriesConstants';
import accessRequestService from '~/services/accessTransparency/accessRequestService';

export const refetchAccessRequest = () => {
  queryClient.invalidateQueries({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'useFetchAccessRequest'],
  });
};

export const useFetchAccessRequest = (id: string) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'useFetchAccessRequest'],
    queryFn: async () => {
      const response = await accessRequestService.getAccessRequest(id);

      return response;
    },
    enabled: !!id,
  });

  return {
    data: data?.data,
    isLoading,
    isError,
    error: isError ? formatErrorData(isLoading, isError, error) : error,
    isSuccess,
  };
};
