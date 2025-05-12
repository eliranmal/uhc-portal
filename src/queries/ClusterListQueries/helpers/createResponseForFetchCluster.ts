import { AxiosError } from 'axios';
import isEmpty from 'lodash/isEmpty';

import type { Cluster as AICluster } from '@openshift-assisted/types/assisted-installer-service';

import { type Subscription, SubscriptionCommonFieldsStatus } from '~/types/accounts_mgmt.v1';
import type { Cluster } from '~/types/clusters_mgmt.v1';
import { ClusterWithPermissions } from '~/types/types';

import isAssistedInstallSubscription from '../../../common/isAssistedInstallerCluster';
import {
  fakeClusterFromAISubscription,
  fakeClusterFromSubscription,
  normalizeCluster,
  normalizeMetrics,
} from '../../../common/normalize';

export type SubscriptionMapEntry = {
  aiCluster?: AICluster;
  cluster?: Cluster;
  subscription: Subscription;
};

export const createResponseForFetchClusters = (
  subscriptionMap: Map<string, SubscriptionMapEntry>,
) => {
  const result: (ClusterWithPermissions | Cluster)[] = [];
  subscriptionMap.forEach((entry) => {
    let cluster: ClusterWithPermissions | Cluster;

    if (
      !!entry.cluster &&
      !isEmpty(entry?.cluster) &&
      (!entry.subscription || isEmpty(entry.subscription))
    ) {
      cluster = {
        ...normalizeCluster(entry.cluster),
      };
    } else if (
      entry.subscription.managed &&
      entry.subscription.status !== SubscriptionCommonFieldsStatus.Deprovisioned &&
      !!entry?.cluster &&
      !isEmpty(entry?.cluster)
    ) {
      // managed cluster, with data from Clusters Service
      cluster = {
        ...normalizeCluster(entry.cluster),
        subscription: entry.subscription,
        // TODO HAC-2355: entry.subscription.metrics is an array but normalizeMetrics wants a single metric
        // @ts-ignore
        metrics: normalizeMetrics(entry.subscription.metrics),
      };
    } else {
      cluster = isAssistedInstallSubscription(entry.subscription)
        ? fakeClusterFromAISubscription(entry.subscription, entry.aiCluster)
        : fakeClusterFromSubscription(entry.subscription);

      // mark this as a clusters service cluster with partial data (happens when CS is down)
      cluster.partialCS = cluster.managed && (!entry?.cluster || isEmpty(entry?.cluster));
    }

    cluster.subscription = entry.subscription;
    result.push(cluster);
  });
  return result;
};

export type ErrorResponse = AxiosError & {
  response: { data: { reason: string; operation_id: string } };
};

export const formatClusterListError = (
  response: { error: ErrorResponse | null | undefined },
  region?: String,
) => {
  if (!response.error || (!response.error?.response?.data?.reason && !response.error?.message)) {
    return null;
  }
  const returnValue = {
    reason: response.error?.response?.data?.reason || response.error?.message,
    operation_id: response.error?.response?.data?.operation_id,
  };
  if (region) {
    return { ...returnValue, region };
  }
  return returnValue;
};
