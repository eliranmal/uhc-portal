import { useQuery } from '@tanstack/react-query';

import { createServiceLogQueryObject } from '~/common/queryHelpers';
import { queryClient } from '~/components/App/queryClient';
import { serviceLogService } from '~/services';
import { Cluster } from '~/types/clusters_mgmt.v1';
import { ViewOptions } from '~/types/types';

import { formatErrorData } from '../helpers';
import { queryConstants } from '../queriesConstants';

/**
 * Query to fetch cluster history logs based on cluster
 * @param clusterUUID clusterUUID from cluster
 * @param clusterID clusterID from cluster
 * @param params cluster history params
 * @param region result of rh_region_id
 * @param page page number from pagination
 * @returns query states. Loading, pending, error and cluster logs
 */

/**
 * Function responsible for invalidation of cluster logs (refetch)
 */
export const refetchClusterLogsQueries = () => {
  queryClient.invalidateQueries({
    queryKey: [queryConstants.FETCH_CLUSTER_LOGS_QUERY_KEY],
  });
};

export const useFetchClusterLogs = (
  clusterUUID: Cluster['external_id'],
  clusterID: Cluster['id'],
  params: ViewOptions,
  region?: string | undefined,
  page?: number | undefined,
  pageSize?: number | undefined,
) => {
  const { data, isError, error, dataUpdatedAt, isPending, isLoading } = useQuery({
    queryKey: [
      queryConstants.FETCH_CLUSTER_LOGS_QUERY_KEY,
      clusterID,
      'clusterLogService',
      params,
      page,
      pageSize,
    ],
    queryFn: async () => {
      if (region) {
        const response = await serviceLogService.getClusterHistoryForRegion(
          clusterUUID,
          clusterID,
          createServiceLogQueryObject(params, undefined, page, pageSize),
          region,
        );
        return response;
      }
      const response = await serviceLogService.getClusterHistory(
        clusterUUID,
        clusterID,
        createServiceLogQueryObject(params, undefined, page, pageSize),
      );
      return response;
    },
    retry: false,
  });

  const errorData = formatErrorData(isLoading, isError, error);

  return {
    data: data?.data,
    isError,
    error: errorData?.error,
    dataUpdatedAt,
    isPending,
  };
};
