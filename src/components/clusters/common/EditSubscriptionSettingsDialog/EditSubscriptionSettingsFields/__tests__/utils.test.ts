import { SubscriptionCommonFieldsCluster_billing_model as SubscriptionCommonFieldsClusterBillingModel } from '~/types/accounts_mgmt.v1';

import { MARKETPLACE_BILLING_MODEL_LABEL, STANDARD_BILLING_MODEL_LABEL } from '../constants';
import {
  getBillingModelAlertText,
  getSettingsBasedOnDefaultOptions,
  getSettingsBasedOnOptions,
} from '../utils';

describe('getSettingsBasedOnDefaultOptions', () => {
  it('returns original settings when all options are defined in settings', () => {
    const options = {
      option1: [
        { value: 'value1', isDefault: true },
        { value: 'value2', isDefault: false },
      ],
      option2: [
        { value: 'value3', isDefault: false },
        { value: 'value4', isDefault: true },
      ],
    };
    const settings = {
      option1: 'value1',
      option2: 'value4',
    };
    expect(getSettingsBasedOnDefaultOptions(options as any, settings as any)).toEqual(settings);
  });

  it('returns settings with default options applied when some options are missing in settings', () => {
    const options = {
      option1: [
        { value: 'value1', isDefault: true },
        { value: 'value2', isDefault: false },
      ],
      option2: [
        { value: 'value3', isDefault: false },
        { value: 'value4', isDefault: true },
      ],
    };
    const settings = {
      option1: 'value1', // option2 is missing
    };
    const expectedSettings = {
      ...settings,
      option2: 'value4', // option2's default value
    };
    expect(getSettingsBasedOnDefaultOptions(options as any, settings as any)).toEqual(
      expectedSettings,
    );
  });

  it('returns settings with default options applied when all options are missing in settings', () => {
    const options = {
      option1: [
        { value: 'value1', isDefault: true },
        { value: 'value2', isDefault: false },
      ],
      option2: [
        { value: 'value3', isDefault: false },
        { value: 'value4', isDefault: true },
      ],
    };
    const settings = {}; // All options are missing
    const expectedSettings = {
      option1: 'value1', // option1's default value
      option2: 'value4', // option2's default value
    };
    expect(getSettingsBasedOnDefaultOptions(options as any, settings as any)).toEqual(
      expectedSettings,
    );
  });

  it('returns original settings when options are numbers', () => {
    const options = {
      option1: 10,
      option2: 20,
    };
    const settings = {
      option1: 5,
      option2: 15,
    };
    expect(getSettingsBasedOnDefaultOptions(options, settings as any)).toEqual(settings);
  });

  it('returns original settings when options are empty', () => {
    const options = {};
    const settings = {
      option1: 'value1',
      option2: 'value2',
    };
    expect(getSettingsBasedOnDefaultOptions(options, settings as any)).toEqual(settings);
  });
});

describe('getSettingsBasedOnOptions', () => {
  const options = {
    option1: [
      { value: 'value1', isDefault: true },
      { value: 'value2', isDefault: false },
    ],
    option2: [
      { value: 'value3', isDefault: false },
      { value: 'value4', isDefault: true },
    ],
  };

  it.each`
    desc                         | optionsInput | settingsInput                               | expectedOutput
    ${'with valid options'}      | ${options}   | ${{ option1: 'value1', option2: 'value4' }} | ${{ option1: 'value1', option2: 'value4' }}
    ${'with undefined options'}  | ${undefined} | ${{ option1: 'value1', option2: 'value4' }} | ${{}}
    ${'with undefined settings'} | ${options}   | ${undefined}                                | ${{}}
    ${'with both undefined'}     | ${undefined} | ${undefined}                                | ${{}}
    ${'with empty options'}      | ${{}}        | ${{ option1: 'value1', option2: 'value4' }} | ${{}}
    ${'with partial settings'}   | ${options}   | ${{ option1: 'value1' }}                    | ${{ option1: 'value1' }}
  `('returns correct settings $desc', ({ optionsInput, settingsInput, expectedOutput }) => {
    expect(getSettingsBasedOnOptions(optionsInput, settingsInput)).toEqual(expectedOutput);
  });

  describe('getBillingModelAlertText', () => {
    it('should return subscription type cannot be altered message when isBillingModelVisible is true', () => {
      expect(getBillingModelAlertText(true, undefined, true, false)).toBe(
        "Your subscription type can't be altered after you set it.",
      );
    });

    it('should return standard subscription type message when clusterBillingModel is STANDARD and isBillingModelVisible is false', () => {
      expect(
        getBillingModelAlertText(
          false,
          SubscriptionCommonFieldsClusterBillingModel.standard,
          false,
          false,
        ),
      ).toBe(`Cluster subscription type is ${STANDARD_BILLING_MODEL_LABEL}`);
    });

    it('should return marketplace subscription type message when clusterBillingModel is MARKETPLACE and isBillingModelVisible is false', () => {
      expect(
        getBillingModelAlertText(
          true,
          SubscriptionCommonFieldsClusterBillingModel.marketplace,
          false,
          false,
        ),
      ).toBe(`Cluster subscription type is ${MARKETPLACE_BILLING_MODEL_LABEL}`);
    });

    it('should return marketplace subscription type message when canSubscribeMarketplaceOCP is true and isBillingModelVisible is false', () => {
      expect(getBillingModelAlertText(true, undefined, false, false)).toBe(
        `Cluster subscription type is ${MARKETPLACE_BILLING_MODEL_LABEL}`,
      );
    });

    it('should return disconnected clusters subscription type message when isDisconnected is true and isBillingModelVisible is false', () => {
      expect(getBillingModelAlertText(false, undefined, false, true)).toBe(
        `Disconnected clusters subscription type is ${STANDARD_BILLING_MODEL_LABEL}`,
      );
    });

    it('should return standard subscription type message when no other conditions match and isBillingModelVisible is false', () => {
      expect(getBillingModelAlertText(false, undefined, false, false)).toBe(
        `Cluster subscription type is ${STANDARD_BILLING_MODEL_LABEL}`,
      );
    });
  });
});
