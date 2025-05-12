import { useDispatch } from 'react-redux';

import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { formatErrorData } from '~/queries/helpers';
import { queryConstants } from '~/queries/queriesConstants';
import { onSetTotal } from '~/redux/actions/viewOptionsActions';
import { viewConstants } from '~/redux/constants';
import { useGlobalState } from '~/redux/hooks';
import accessRequestService from '~/services/accessTransparency/accessRequestService';
import { ViewOptions } from '~/types/types';

export const refetchAccessRequests = () => {
  queryClient.invalidateQueries({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'fetchAccessRequests'],
  });
};

export const useFetchAccessRequests = (
  subscriptionId: string,
  params: ViewOptions,
  isAccessProtectionLoading?: boolean,
  accessProtection?: { enabled: boolean },
) => {
  const viewType = viewConstants.ACCESS_REQUESTS_VIEW;
  const viewOptions = useGlobalState((state) => state.viewOptions[viewType]);

  const dispatch = useDispatch();

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: [
      queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY,
      'fetchAccessRequests',
      params,
      isAccessProtectionLoading,
      accessProtection,
      subscriptionId,
    ],
    queryFn: async () => {
      const response = await accessRequestService.getAccessRequests({
        page: params.currentPage,
        size: params.pageSize,
        search: `subscription_id='${subscriptionId}'`,
        orderBy: params.sorting.sortField
          ? `${params.sorting.sortField} ${params.sorting.isAscending ? 'asc' : 'desc'}`
          : undefined,
      });

      if (response?.data?.total !== viewOptions.totalCount) {
        dispatch(onSetTotal(response?.data?.total, viewType));
      }

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
