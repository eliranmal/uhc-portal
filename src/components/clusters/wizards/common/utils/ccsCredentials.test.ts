import { FieldId } from '~/components/clusters/wizards/common';
import { getGcpCcsCredentials } from '~/components/clusters/wizards/common/utils/ccsCredentials';
import { GCPAuthType } from '~/components/clusters/wizards/osd/ClusterSettings/CloudProvider/types';

describe('cssCredentials', () => {
  describe('getGcpCcsCredentials', () => {
    const serviceAccountJSON = '{ "type": "service_account"}';
    const wifConfig = { id: 'abcdefg' };
    const values = {
      [FieldId.GcpServiceAccount]: serviceAccountJSON,
      [FieldId.GcpWifConfig]: wifConfig,
    };
    it.each([
      ['service account', GCPAuthType.ServiceAccounts, serviceAccountJSON],
      ['wif config ID', GCPAuthType.WorkloadIdentityFederation, wifConfig.id],
    ])('return a %p when the auth type is %p', (_desc, authType, output) => {
      const form = { ...values, [FieldId.GcpAuthType]: authType };
      expect(getGcpCcsCredentials(form)).toEqual(output);
    });
  });
});
