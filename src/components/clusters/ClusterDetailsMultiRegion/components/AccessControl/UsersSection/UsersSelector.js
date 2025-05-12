import get from 'lodash/get';

import { normalizedProducts } from '../../../../../../common/subscriptionTypes';
import clusterStates from '../../../../common/clusterStates';

const canAllowAdminSelector = (state) => {
  const product = get(
    state,
    'clusters.details.cluster.subscription.plan.type',
    normalizedProducts.OSD,
  );
  const clusterState = get(state, 'clusters.details.cluster.state');

  if (product === normalizedProducts.RHMI || clusterState !== clusterStates.ready) {
    return false;
  }

  if (get(state, 'clusters.details.cluster.ccs.enabled', false)) {
    return true;
  }

  const capabilites = get(state, 'clusters.details.cluster.subscription.capabilities', []);
  const manageClusterAdminCapability = capabilites.find(
    (capability) => capability.name === 'capability.cluster.manage_cluster_admin',
  );

  return !!(manageClusterAdminCapability && manageClusterAdminCapability.value === 'true');
};

export default canAllowAdminSelector;
