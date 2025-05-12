import { ClusterFromSubscription } from '../types/types';

export const UNNAMED_CLUSTER = 'Unnamed Cluster';

/**
 * Get the display name for the cluster (from the subscription), with fallbacks to name, UUID,
 * or the string "Unnamed Cluster".
 * @param {*} cluster a cluster object.
 */
const getClusterName = (cluster: ClusterFromSubscription): string => {
  if (!cluster) {
    return '';
  }

  let clusterName = cluster.subscription?.display_name;
  if (!clusterName || clusterName === cluster.subscription?.external_cluster_id) {
    clusterName = cluster.name || cluster.external_id;
  }

  if (clusterName === undefined) {
    if (cluster.subscription?.status === 'Deprovisioned') {
      const subscriptionId = cluster.subscription?.id;
      if (subscriptionId) {
        return subscriptionId;
      }
    }
    return UNNAMED_CLUSTER;
  }
  return clusterName;
};

export default getClusterName;
