import { SubscriptionCommonFieldsSupport_level as SubscriptionCommonFieldsSupportLevel } from '~/types/accounts_mgmt.v1';

const expiredTrialsFilter = {
  filter: `support_level='${SubscriptionCommonFieldsSupportLevel.None}' AND status NOT IN ('Deprovisioned', 'Archived')`,
};

export { expiredTrialsFilter };
