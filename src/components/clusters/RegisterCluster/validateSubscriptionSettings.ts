import {
  SubscriptionCommonFieldsSupport_level as SubscriptionCommonFieldsSupportLevel,
  SubscriptionCommonFieldsSystem_units as SubscriptionCommonFieldsSystemUnits,
  SubscriptionPatchRequest,
} from '~/types/accounts_mgmt.v1';

import { subscriptionSettings } from '../../../common/subscriptionTypes';

const { SUPPORT_LEVEL, SYSTEM_UNITS, CPU_TOTAL, SOCKET_TOTAL } = subscriptionSettings;

const validateSubscriptionSettings = (settings: {
  [index: string]: any;
}): { request: SubscriptionPatchRequest | null; isValid: boolean } => {
  const {
    [SUPPORT_LEVEL]: supportLevel,
    [SYSTEM_UNITS]: systemUnits,
    [CPU_TOTAL]: cpuTotal,
    [SOCKET_TOTAL]: socketTotal,
  } = settings;
  // subscription setting is optional for disconnected cluster registration
  if (
    supportLevel !== SubscriptionCommonFieldsSupportLevel.Premium &&
    supportLevel !== SubscriptionCommonFieldsSupportLevel.Standard &&
    supportLevel !== SubscriptionCommonFieldsSupportLevel.Self_Support
  ) {
    return {
      request: null,
      isValid: true,
    };
  }
  if (!settings.isValid) {
    return {
      request: null,
      isValid: false,
    };
  }
  // adjust the system_units values to avoid of round-off errors
  const request = { ...settings };
  if (systemUnits === SubscriptionCommonFieldsSystemUnits.Sockets) {
    request[SOCKET_TOTAL] = parseInt(socketTotal, 10);
    request[CPU_TOTAL] = request[SOCKET_TOTAL];
  }
  if (systemUnits === SubscriptionCommonFieldsSystemUnits.Cores_vCPU) {
    request[SOCKET_TOTAL] = 1;
    request[CPU_TOTAL] = parseInt(cpuTotal, 10);
  }
  return {
    request,
    isValid: settings.isValid,
  };
};

export default validateSubscriptionSettings;
