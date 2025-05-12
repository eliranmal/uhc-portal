import mergeWith from 'lodash/mergeWith';

import { ClusterWithPermissions } from '~/types/types';

import {
  haveCapabilities,
  subscriptionCapabilities,
} from '../../../../common/subscriptionCapabilities';

export const canSubscribeOCPListFromClusters = (clusters: ClusterWithPermissions[] = []) => {
  const subscribeStandardOCPList = haveCapabilities(
    clusters,
    subscriptionCapabilities.SUBSCRIBED_OCP,
  );
  const subscribeMarketplaceOCPList = haveCapabilities(
    clusters,
    subscriptionCapabilities.SUBSCRIBED_OCP_MARKETPLACE,
  );

  return mergeWith(
    subscribeStandardOCPList,
    subscribeMarketplaceOCPList,
    (objVal, srcVal) => objVal || srcVal,
  );
};
