import { normalizedProducts } from '~/common/subscriptionTypes';
import { SubscriptionCommonFieldsCluster_billing_model as SubscriptionCommonFieldsClusterBillingModel } from '~/types/accounts_mgmt.v1';
import { ClusterFromSubscription } from '~/types/types';

import {
  defaultClusterFromSubscription,
  defaultSubscription,
} from './__tests__/defaultClusterFromSubscription.fixtures';
import getBillingModelLabel from './getBillingModelLabel';

describe('getBillingModelLabel', () => {
  it.each([
    [normalizedProducts.OSDTrial, undefined, undefined, 'Free trial, upgradeable'],
    [normalizedProducts.OSD, undefined, undefined, 'Standard'],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFieldsClusterBillingModel.standard,
      undefined,
      'Annual Red Hat subscriptions',
    ],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFieldsClusterBillingModel.marketplace,
      undefined,
      'N/A',
    ],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFieldsClusterBillingModel.marketplace_aws,
      undefined,
      'N/A',
    ],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFieldsClusterBillingModel.marketplace_gcp,
      undefined,
      'N/A',
    ],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFieldsClusterBillingModel.marketplace,
      true,
      'On-demand via Red Hat Marketplace',
    ],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFieldsClusterBillingModel.marketplace_aws,
      true,
      'On-demand via Red Hat Marketplace',
    ],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFieldsClusterBillingModel.marketplace_gcp,
      true,
      'On-demand via Google Cloud Marketplace',
    ],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFieldsClusterBillingModel.marketplace,
      false,
      'Standard',
    ],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFieldsClusterBillingModel.marketplace_aws,
      false,
      'Standard',
    ],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFieldsClusterBillingModel.marketplace_gcp,
      false,
      'Standard',
    ],
    [normalizedProducts.ARO, undefined, undefined, 'Standard'],
    [undefined, undefined, undefined, 'Standard'],
  ])(
    'when plan type is %p, billing model %p and CCS enabled is %p should return %p',
    (
      planType: string | undefined,
      billingModel: SubscriptionCommonFieldsClusterBillingModel | undefined,
      ccsEnabled: boolean | undefined,
      expectedResult: string,
    ) => {
      const cluster: ClusterFromSubscription = {
        ...defaultClusterFromSubscription,
        subscription: {
          ...defaultSubscription,
          cluster_billing_model: billingModel,
          plan: {
            type: planType,
          },
        },
        ccs: {
          enabled: ccsEnabled,
        },
      };
      expect(getBillingModelLabel(cluster)).toEqual(expectedResult);
    },
  );
});
