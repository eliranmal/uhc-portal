import { normalizedProducts } from '~/common/subscriptionTypes';
import { QuotaTypes } from '~/components/clusters/common/quotaModel';
import { CloudProviderType } from '~/components/clusters/wizards/common/constants';
import { RelatedResourceBilling_model as RelatedResourceBillingModel } from '~/types/accounts_mgmt.v1';

export enum QuotaType {
  OsdTrial = 'osdTrial',
  StandardOsd = 'standardOsd',
  Marketplace = 'marketplace',
  Byoc = 'byoc',
  RhInfra = 'rhInfra',
  MarketplaceByoc = 'marketplaceByoc',
  MarketplaceRhInfra = 'marketplaceRhInfra',
  GcpResources = 'gcpResources',
  AwsResources = 'awsResources',
  SingleAzResources = 'singleAzResources',
  MultiAzResources = 'multiAzResources',
}

export const quotaParams = {
  [QuotaType.OsdTrial]: {
    resourceType: QuotaTypes.CLUSTER,
    product: normalizedProducts.OSDTrial,
  },
  [QuotaType.StandardOsd]: {
    resourceType: QuotaTypes.CLUSTER,
    product: normalizedProducts.OSD,
    billingModel: RelatedResourceBillingModel.standard,
  },
  [QuotaType.Marketplace]: {
    resourceType: QuotaTypes.CLUSTER,
    product: normalizedProducts.OSD,
    billingModel: RelatedResourceBillingModel.marketplace,
  },
  [QuotaType.Byoc]: {
    resourceType: QuotaTypes.CLUSTER,
    billingModel: RelatedResourceBillingModel.standard,
    isBYOC: true,
  },
  [QuotaType.RhInfra]: {
    resourceType: QuotaTypes.CLUSTER,
    billingModel: RelatedResourceBillingModel.standard,
    isBYOC: false,
  },
  [QuotaType.MarketplaceByoc]: {
    resourceType: QuotaTypes.CLUSTER,
    billingModel: RelatedResourceBillingModel.marketplace,
    product: normalizedProducts.OSD,
    isBYOC: true,
  },
  [QuotaType.MarketplaceRhInfra]: {
    resourceType: QuotaTypes.CLUSTER,
    billingModel: RelatedResourceBillingModel.marketplace,
    product: normalizedProducts.OSD,
    isBYOC: false,
  },
  [QuotaType.GcpResources]: {
    resourceType: QuotaTypes.CLUSTER,
    cloudProviderID: CloudProviderType.Gcp,
  },
  [QuotaType.AwsResources]: {
    resourceType: QuotaTypes.CLUSTER,
    cloudProviderID: CloudProviderType.Aws,
  },
  [QuotaType.SingleAzResources]: {
    resourceType: QuotaTypes.CLUSTER,
    isMultiAz: false,
  },
  [QuotaType.MultiAzResources]: {
    resourceType: QuotaTypes.CLUSTER,
    isMultiAz: true,
  },
};
