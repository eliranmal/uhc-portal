import { getClusterServiceForRegion } from '~/services/clusterService';
import { ClusterWithPermissions, ViewOptions } from '~/types/types';

import { normalizeSubscription } from '../../../../common/normalize';
import { accountsService } from '../../../../services';
import { Region } from '../types/types';

import {
  createResponseForFetchClusters,
  ErrorResponse,
  formatClusterListError,
} from './createResponseForFetchCluster';

const PAGE_SIZE = 500;

export const fetchPageOfRegionalClusters = async (
  page: number,
  region: Region,
  viewOptions?: ViewOptions,
  userName?: string,
) => {
  // Get clusters for a region
  // This gets clusters for a region and then subscriptions
  const clusterService = getClusterServiceForRegion(region.url);
  const clusterRequestParams = {
    page,
    size: PAGE_SIZE,
    search: '',
  };
  if (viewOptions?.filter) {
    clusterRequestParams.search = `(display_name ILIKE '%${viewOptions.filter}%' OR external_id ILIKE '%${viewOptions.filter}%' OR id ILIKE '%${viewOptions.filter}%')`;
  }

  let clusters;
  const errors = [];
  let isError = false;

  try {
    clusters = await clusterService.getClusters(clusterRequestParams);
  } catch (e: unknown) {
    isError = true;
    // TODO verify this still works once we are connected to an actual API
    errors.push(formatClusterListError({ error: e as ErrorResponse }, region));
  }

  const items = clusters?.data?.items;

  if (!clusters || !items || items.length === 0 || isError) {
    return {
      items: [] as ClusterWithPermissions[],
      page: 0,
      total: 0,
      region,
      isError,
      errors,
    };
  }

  const subscriptionMap = new Map();
  items.forEach((item) => {
    if (item.subscription?.id) {
      subscriptionMap.set(item.subscription?.id, {
        cluster: item,
      });
    }
  });

  const subscriptionsQuery = `id in (${Array.from(subscriptionMap.keys())
    .map((key) => `'${key}'`)
    .join(',')})`;

  let subscriptionResponse;
  try {
    if (subscriptionMap.size > 0) {
      subscriptionResponse = await accountsService.searchSubscriptions(
        subscriptionsQuery,
        PAGE_SIZE,
      );
    }
  } catch (e) {
    isError = true;
    errors.push(formatClusterListError({ error: e as ErrorResponse }, region));
  }

  const subscriptions = subscriptionResponse?.data?.items;

  subscriptions?.forEach((subscription) => {
    if (subscription.id) {
      const entry = subscriptionMap.get(subscription.id);
      if (entry !== undefined) {
        // store subscription into subscription map
        entry.subscription = normalizeSubscription(subscription);
      }
    }
  });

  // Because plan is not known to the cluster service, we need to manually filter them out
  // NOTE: eventually we may need to filter out the following plan types: RHACS, RHACSTrial, RHOSR, RHOSRTrial, RHOSAK

  let returnItems = createResponseForFetchClusters(subscriptionMap);

  const filterPlanIds = viewOptions?.flags?.subscriptionFilter?.plan_id;

  if (filterPlanIds && filterPlanIds.length > 0) {
    returnItems = returnItems.filter((cluster) =>
      filterPlanIds.some((plan: string) => plan === cluster.product?.id),
    );
  }

  // Because creator is not known to the cluster service, we need to manually filter out manually
  if (viewOptions?.flags?.showMyClustersOnly && userName) {
    returnItems = returnItems.filter(
      // @ts-ignore  creator is not currently on the subscription type
      (cluster) => cluster.subscription?.creator?.username === userName,
    );
  }

  const numberFilteredOut = subscriptionMap.size - returnItems.length;

  return {
    items: returnItems,
    page: clusters?.data.page,
    total: clusters.data.total - numberFilteredOut || 0,
    region,
    isError,
    errors,
  };
};
