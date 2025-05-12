import { get, pick } from 'lodash';

import {
  Subscription,
  SubscriptionCommonFieldsCluster_billing_model as SubscriptionCommonFieldsClusterBillingModel,
  SubscriptionCommonFieldsSystem_units as SubscriptionCommonFieldsSystemUnits,
} from '~/types/accounts_mgmt.v1';

import { EditSubcriptionOption } from './model/EditSubcriptionOption';
import { EditSubsriptionSettingsFieldsValues } from './model/EditSubsriptionSettingsFieldsValues';
import {
  MARKETPLACE_BILLING_MODEL_LABEL,
  MIN_VAL,
  STANDARD_BILLING_MODEL_LABEL,
} from './constants';

const getStringValue = (subscription: Subscription) =>
  subscription.system_units === SubscriptionCommonFieldsSystemUnits.Sockets
    ? subscription.socket_total
    : subscription.cpu_total;

const getFieldLabel = (subscription: Subscription) =>
  subscription.system_units === SubscriptionCommonFieldsSystemUnits.Sockets
    ? 'Sockets'
    : 'Cores or vCPUs';

const validateSystemUnitsNumericField = (
  subscription: Subscription,
  inputVal?: string | number,
): { isValid: boolean; errorMsg: string } => {
  const stringValue = inputVal || getStringValue(subscription);
  const fieldLabel = getFieldLabel(subscription);

  // validate that `value` consists of decimal digits only
  if (!/^\d+$/.test(`${stringValue}`)) {
    return {
      isValid: false,
      errorMsg: `${fieldLabel} value can only be a positive integer number.`,
    };
  }
  // now value is number for sure
  const value = +(stringValue as number);
  if (value < MIN_VAL) {
    return {
      isValid: false,
      errorMsg: `${fieldLabel} value must be an integer number greater than ${MIN_VAL - 1}.`,
    };
  }
  return { isValid: true, errorMsg: '' };
};

const getBillingModelAlertText = (
  canSubscribeMarketplaceOCP: boolean,
  cluterBillingModel: string | undefined,
  isBillingModelVisible: boolean,
  isDisconnected: boolean,
) => {
  if (!isBillingModelVisible) {
    switch (true) {
      case cluterBillingModel === SubscriptionCommonFieldsClusterBillingModel.standard:
        return `Cluster subscription type is ${STANDARD_BILLING_MODEL_LABEL}`;
      case cluterBillingModel === SubscriptionCommonFieldsClusterBillingModel.marketplace ||
        canSubscribeMarketplaceOCP:
        return `Cluster subscription type is ${MARKETPLACE_BILLING_MODEL_LABEL}`;
      case isDisconnected:
        return `Disconnected clusters subscription type is ${STANDARD_BILLING_MODEL_LABEL}`;
      default:
        return `Cluster subscription type is ${STANDARD_BILLING_MODEL_LABEL}`;
    }
  }
  return "Your subscription type can't be altered after you set it.";
};

const getSettingsBasedOnDefaultOptions = (
  options: { [index: string]: EditSubcriptionOption[] | number },
  settings: EditSubsriptionSettingsFieldsValues,
) => {
  let subSettings = { ...settings };
  Object.entries(options).forEach(([settingName, settingOptions]) => {
    if (get(settings, settingName) === undefined && typeof settingOptions !== 'number') {
      const setting = (settingOptions as EditSubcriptionOption[]).find(
        (option) => option.isDefault,
      );
      if (setting) {
        subSettings = { ...subSettings, [`${settingName}`]: setting.value };
      }
    }
  });
  return subSettings;
};

const getSettingsBasedOnOptions = (
  options?: { [index: string]: EditSubcriptionOption[] | number },
  settings?: EditSubsriptionSettingsFieldsValues,
) => pick(settings, Object.keys(options ?? {}));

export {
  getBillingModelAlertText,
  getFieldLabel,
  getSettingsBasedOnDefaultOptions,
  getSettingsBasedOnOptions,
  getStringValue,
  validateSystemUnitsNumericField,
};
