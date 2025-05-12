import { AxiosError } from 'axios';

import type { Cluster as AICluster } from '@openshift-assisted/types/assisted-installer-service';

import { createViewQueryObject } from '~/common/queryHelpers';
import { getSubscriptionQueryType } from '~/services/accountsService';
import { type Subscription, SubscriptionCommonFieldsStatus } from '~/types/accounts_mgmt.v1';
import { Cluster } from '~/types/clusters_mgmt.v1';
import { ViewOptions } from '~/types/types';

import isAssistedInstallSubscription from '../../../../common/isAssistedInstallerCluster';
import { mapListResponse, normalizeSubscription } from '../../../../common/normalize';
import { accountsService, assistedService, clusterService } from '../../../../services';

import {
  createResponseForFetchClusters,
  ErrorResponse,
  formatClusterListError,
  MapEntry,
} from './createResponseForFetchCluster';

const PAGE_SIZE = 500;

const buildSearchClusterQuery = (items: { [field: string]: unknown }[], field: string): string => {
  const IDs = new Set();
  items.forEach((item) => {
    const objectID = item[field];
    if (objectID) {
      IDs.add(`'${objectID}'`);
    }
  });
  return `id in (${Array.from(IDs).join(',')})`;
};

const fetchAIClusters = async (subscriptionIds: string[]) => {
  if (!subscriptionIds) {
    return { aiClusters: [] };
  }
  try {
    const response = await assistedService.getAIClustersBySubscription(subscriptionIds);
    return { aiClusters: response.data };
  } catch (e) {
    return e;
  }
};

const fetchManagedClusters = async (managedSubscriptions: Subscription[] = []) => {
  if (!managedSubscriptions) {
    return { managedClusters: [] };
  }
  const clustersSearchQuery = buildSearchClusterQuery(managedSubscriptions, 'cluster_id');

  try {
    const response = await clusterService.searchClusters(clustersSearchQuery);
    return { managedClusters: response.data?.items };
  } catch (e) {
    return e;
  }
};

const fetchGlobalSubscriptions = async (
  page: number,
  pageSize: number | undefined,
  viewOptions?: ViewOptions,
  userName?: string,
  getMultiRegion: boolean = true,
) => {
  const params = createViewQueryObject(
    {
      currentPage: page,
      pageSize: pageSize || PAGE_SIZE,
      filter: viewOptions?.filter || '',
      sorting: {
        sortField: viewOptions?.sorting?.sortField || 'created_at',
        isAscending: viewOptions?.sorting?.isAscending || false,
        sortIndex: viewOptions?.sorting?.sortIndex || 1,
      },
      flags: viewOptions?.flags || {},
    } as ViewOptions,
    userName,
  );

  const multiRegionFilter = getMultiRegion ? "(rh_region_id='' OR rh_region_id IS NULL) AND " : '';

  params.filter = `${multiRegionFilter}${params.filter}`;

  const response = await accountsService.getSubscriptions(params as getSubscriptionQueryType);
  const subscriptions = mapListResponse(response, normalizeSubscription);

  const items =
    subscriptions?.data?.items?.filter(
      (item: Subscription) => !isAssistedInstallSubscription(item),
    ) || [];

  const subscriptionMap = new Map<string, MapEntry>();

  items.forEach((item) => {
    if (item.cluster_id) {
      subscriptionMap.set(item.cluster_id, {
        subscription: item,
      });
    }
  });

  const subscriptionIds: string[] = [];

  subscriptionMap.forEach(({ subscription }) => {
    if (isAssistedInstallSubscription(subscription) && subscription.id) {
      subscriptionIds.push(subscription.id);
    }
  });

  const managedSubscriptions = items.filter(
    (s) => s.managed && s.status !== SubscriptionCommonFieldsStatus.Deprovisioned,
  );

  return {
    subscriptionIds,
    subscriptionMap,
    managedSubscriptions,
    page: subscriptions?.data?.page || 0,
    total: subscriptions?.data?.total || 0,
  };
};

export const fetchPageOfGlobalClusters = async (
  page: number,
  pageSize: number | undefined,
  viewOptions: ViewOptions,
  userName?: string,
  getMultiRegion: boolean = true,
) => {
  // Get global region clusters
  // This gets the subscriptions list first then clusters

  let subscriptionResponse = {};
  let isError = false;
  const errors = [];

  try {
    subscriptionResponse = await fetchGlobalSubscriptions(
      page,
      pageSize,
      viewOptions,
      userName,
      getMultiRegion,
    );
  } catch (e) {
    const error = formatClusterListError({ error: e as ErrorResponse });
    return {
      items: [],
      page,
      total: 0,
      isError: true,
      errors: error ? [error] : [],
    };
  }

  const { subscriptionIds, subscriptionMap, managedSubscriptions, total } =
    subscriptionResponse as Awaited<Promise<ReturnType<typeof fetchGlobalSubscriptions>>>;

  const [aiClustersResponse, managedClustersResponse] = await Promise.all([
    subscriptionIds.length > 0 ? fetchAIClusters(subscriptionIds) : {},
    managedSubscriptions.length > 0 ? fetchManagedClusters(managedSubscriptions) : {},
  ]);

  if (managedClustersResponse instanceof AxiosError) {
    isError = true;
    errors.push(formatClusterListError({ error: managedClustersResponse as ErrorResponse }));
  } else {
    const { managedClusters } = managedClustersResponse as { managedClusters: Cluster[] };

    if (managedClusters) {
      managedClusters.forEach((cluster) => {
        if (cluster.id) {
          const entry = subscriptionMap.get(cluster.id);
          if (entry !== undefined) {
            // store cluster into subscription map
            entry.cluster = cluster;
          }
        }
      });
    }
  }

  if (aiClustersResponse instanceof AxiosError) {
    isError = true;
    errors.push(formatClusterListError({ error: aiClustersResponse as ErrorResponse }));
  } else {
    const { aiClusters } = aiClustersResponse as { aiClusters: AICluster[] };

    if (aiClusters) {
      aiClusters.forEach((aiCluster) => {
        if (aiCluster.id) {
          const entry = subscriptionMap.get(aiCluster.id);
          if (entry) {
            entry.aiCluster = aiCluster;
          }
        }
      });
    }
  }

  return {
    items: createResponseForFetchClusters(subscriptionMap),
    page,
    total,
    isError,
    errors,
  };
};
