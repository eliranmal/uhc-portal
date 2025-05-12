import { QuotaParams } from '~/components/clusters/common/quotaModel';
import { availableQuota } from '~/components/clusters/common/quotaSelectors';
import {
  quotaParams as wizardQuotaParams,
  QuotaType,
} from '~/components/clusters/wizards/common/utils/quotas';
import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { QuotaCostList } from '~/types/accounts_mgmt.v1';

export const useGetBillingQuotas = (quotaParams: QuotaParams) => {
  const quotaList = useGlobalState(
    (state) => state.userProfile.organization.quotaList,
  ) as QuotaCostList;
  const { product, billingModel, isBYOC } = quotaParams;
  return {
    [QuotaType.OsdTrial]: availableQuota(quotaList, wizardQuotaParams[QuotaType.OsdTrial]) > 0,
    [QuotaType.StandardOsd]:
      availableQuota(quotaList, wizardQuotaParams[QuotaType.StandardOsd]) > 0,
    [QuotaType.Marketplace]:
      availableQuota(quotaList, wizardQuotaParams[QuotaType.Marketplace]) > 0,
    [QuotaType.GcpResources]:
      availableQuota(quotaList, {
        ...wizardQuotaParams[QuotaType.GcpResources],
        product,
        billingModel,
        isBYOC,
      }) > 0,
    [QuotaType.AwsResources]:
      availableQuota(quotaList, {
        ...wizardQuotaParams.awsResources,
        product,
        billingModel,
        isBYOC,
      }) > 0,
    [QuotaType.Byoc]:
      availableQuota(quotaList, {
        ...wizardQuotaParams[QuotaType.Byoc],
        product,
      }) > 0,
    [QuotaType.RhInfra]:
      availableQuota(quotaList, {
        ...wizardQuotaParams[QuotaType.RhInfra],
        product,
      }) > 0,
    [QuotaType.MarketplaceByoc]:
      availableQuota(quotaList, wizardQuotaParams[QuotaType.MarketplaceByoc]) > 0,
    [QuotaType.MarketplaceRhInfra]:
      availableQuota(quotaList, wizardQuotaParams[QuotaType.MarketplaceRhInfra]) > 0,
  };
};
