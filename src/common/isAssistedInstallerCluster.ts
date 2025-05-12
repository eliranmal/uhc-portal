import get from 'lodash/get';

import { type Subscription, SubscriptionCommonFieldsStatus } from '../types/accounts_mgmt.v1';
import { AugmentedCluster, ClusterFromSubscription } from '../types/types';

import { normalizedProducts } from './subscriptionTypes';

const isAssistedInstallSubscription = (subscription?: Subscription): boolean =>
  subscription?.plan?.id === normalizedProducts.OCP_AssistedInstall;

export const isAvailableAssistedInstallCluster = (cluster: AugmentedCluster): boolean => {
  const isArchived =
    get(cluster, 'subscription.status', false) === SubscriptionCommonFieldsStatus.Archived;
  return !isArchived && !!cluster.aiCluster && isAssistedInstallSubscription(cluster.subscription);
};

export const isAssistedInstallCluster = (cluster: ClusterFromSubscription): boolean =>
  isAssistedInstallSubscription(cluster.subscription);

// An uninstalled cluster is any cluster which is either being defined by the user (in Draft),
// being installed (in progress) or failed  installation (unsuccessful installation)
export const isUninstalledAICluster = (cluster: ClusterFromSubscription): boolean =>
  isAssistedInstallSubscription(cluster.subscription) &&
  cluster.subscription?.status === SubscriptionCommonFieldsStatus.Reserved &&
  cluster.state !== 'installed';

// The cluster has not been installed yet or is shortly after installation.
// Telemetry has not reported its data yet.
export const isAISubscriptionWithoutMetrics = (subscription: Subscription): boolean =>
  isAssistedInstallSubscription(subscription) &&
  (!subscription?.metrics || subscription.metrics.length === 0);

export default isAssistedInstallSubscription;
