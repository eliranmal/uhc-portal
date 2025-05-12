import React from 'react';

import { SubscriptionCommonFieldsSupport_level as SubscriptionCommonFieldsSupportLevel } from '~/types/accounts_mgmt.v1';

import EditSubscriptionFields from '../common/EditSubscriptionSettingsDialog/EditSubscriptionSettingsFields';
import { EditSubsriptionSettingsFieldsValues } from '../common/EditSubscriptionSettingsDialog/EditSubscriptionSettingsFields/model/EditSubsriptionSettingsFieldsValues';

type EditSubscriptionSettingsProps = {
  setSettings: (value: any) => void;
  canSubscribeOCP: boolean;
  isValid?: boolean;
  supportLevel?: SubscriptionCommonFieldsSupportLevel;
  canSubscribeMarketplaceOCP?: boolean;
};

const EditSubscriptionSettings = ({
  setSettings,
  canSubscribeOCP,
  isValid = true,
  supportLevel = SubscriptionCommonFieldsSupportLevel.Eval,
  canSubscribeMarketplaceOCP = false,
}: EditSubscriptionSettingsProps) => {
  const initialSettings: EditSubsriptionSettingsFieldsValues = {
    support_level: supportLevel,
    isValid,
    managed: false,
  };

  return (
    <EditSubscriptionFields
      initialSettings={initialSettings}
      onSettingsChange={setSettings}
      canSubscribeStandardOCP={canSubscribeOCP}
      canSubscribeMarketplaceOCP={canSubscribeMarketplaceOCP}
    />
  );
};

export default EditSubscriptionSettings;
