import { SubscriptionCommonFieldsCluster_billing_model as SubscriptionCommonFieldsClusterBillingModel } from '~/types/accounts_mgmt.v1';
import { ClusterFromSubscription } from '~/types/types';

import { normalizedProducts } from '../../../common/subscriptionTypes';

const getBillingModelLabel = (cluster: ClusterFromSubscription): string => {
  const standardLabel = 'Standard';

  switch (cluster.subscription?.plan?.type) {
    case normalizedProducts.OSDTrial:
      return 'Free trial, upgradeable';
    case normalizedProducts.OSD:
      switch (cluster.subscription?.cluster_billing_model) {
        case SubscriptionCommonFieldsClusterBillingModel.standard:
          return 'Annual Red Hat subscriptions';
        case SubscriptionCommonFieldsClusterBillingModel.marketplace:
        case SubscriptionCommonFieldsClusterBillingModel.marketplace_aws:
          switch (cluster.ccs?.enabled) {
            case true:
              return 'On-demand via Red Hat Marketplace';
            case false:
              return standardLabel;
            default:
              // CCS is undefined for archived clusters. Showing N/A in this case
              return 'N/A';
          }
        case SubscriptionCommonFieldsClusterBillingModel.marketplace_gcp:
          switch (cluster.ccs?.enabled) {
            case true:
              return 'On-demand via Google Cloud Marketplace';
            case false:
              return standardLabel;
            default:
              // CCS is undefined for archived clusters. Showing N/A in this case
              return 'N/A';
          }
        default:
          return standardLabel;
      }
    default:
      return standardLabel;
  }
};

export default getBillingModelLabel;
