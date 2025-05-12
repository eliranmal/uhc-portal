import { useQuery } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import { queryConstants } from '~/queries/queriesConstants';
import accessRequestService from '~/services/accessTransparency/accessRequestService';

export const useFetchOrganizationPendingAccessRequests = (
  organizationId: string,
  params?: { page: number; size: number },
) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: [
      queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY,
      'useFetchOrganizationPendingAccessRequests',
    ],
    queryFn: async () => {
      const response = await accessRequestService.getAccessRequests({
        page: params?.page ?? 0,
        size: params?.size || 10,
        search: `organization_id='${organizationId}' and status.state='Pending'`,
      });

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
