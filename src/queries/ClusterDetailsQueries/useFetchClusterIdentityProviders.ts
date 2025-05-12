import get from 'lodash/get';

import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

import { formatErrorData } from '../helpers';
import { queryConstants } from '../queriesConstants';

/**
 * Query for invalidating cluster IDPs (refetch)
 */
export const refetchClusterIdentityProviders = (clusterID: string, region?: string) => {
  queryClient.invalidateQueries({
    queryKey: [
      queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY,
      'clusterIdentityProviders',
      'clusterService',
      clusterID,
      region,
    ],
  });
};

/**
 * Query for fetching cluster IDP based on the region
 * @param clusterID cluster ID to pass into api call
 * @param region region for api endpoint
 * @returns cluster IDPs list
 */
export const useFetchClusterIdentityProviders = (clusterID: string, region?: string) => {
  const { isLoading, data, isError, error, isSuccess } = useQuery({
    queryKey: [
      queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY,
      'clusterIdentityProviders',
      'clusterService',
      clusterID,
      region,
    ],
    queryFn: async () => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.getIdentityProviders(clusterID).then((res) => {
          // eslint-disable-next-line no-param-reassign
          (res.data as any).items = get(res.data, 'items', []);
          return res;
        });
        return response;
      }
      const response = clusterService.getIdentityProviders(clusterID).then((res) => {
        // eslint-disable-next-line no-param-reassign
        (res.data as any).items = get(res.data, 'items', []);
        return res;
      });

      return response;
    },
    enabled: !!clusterID,
  });

  if (isError) {
    const formattedError = formatErrorData(isLoading, isError, error);

    return {
      clusterIdentityProviders: data?.data,
      isError,
      isLoading,
      error: formattedError,
      isSuccess,
    };
  }

  return {
    isLoading,
    clusterIdentityProviders: data?.data,
    isError,
    error,
    isSuccess,
  };
};
