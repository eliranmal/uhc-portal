import { getClusterServiceForRegion } from '~/services/clusterService';
import { type Subscription } from '~/types/accounts_mgmt.v1';

import { assistedService } from '../../../services';

import { buildSearchClusterQuery } from './useFetchClustersHelpers';

export const fetchManagedClusters = async (
  managedSubscriptions: Subscription[],
  region?: string,
) => {
  if (!managedSubscriptions || managedSubscriptions.length === 0) {
    return { managedClusters: [] };
  }
  const clusterService = getClusterServiceForRegion(
    region === 'global' || !region ? undefined : region,
  );

  const clustersSearchQuery = buildSearchClusterQuery(managedSubscriptions, 'cluster_id');

  const response = await clusterService.searchClusters(clustersSearchQuery);
  return { managedClusters: response.data?.items };
};

export const fetchAIClusters = async (subscriptionIds: string[]) => {
  if (!subscriptionIds || subscriptionIds.length === 0) {
    return { aiClusters: [] };
  }

  const response = await assistedService.getAIClustersBySubscription(subscriptionIds);
  return { aiClusters: response.data };
};
