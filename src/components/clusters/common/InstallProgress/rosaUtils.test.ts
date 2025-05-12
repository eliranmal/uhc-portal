import fixtures from '../../ClusterDetailsMultiRegion/__tests__/ClusterDetails.fixtures';

import { getAWSAccountID, getOIDCEndpointNoScheme, getOIDCProviderARN } from './rosaUtils';

describe('ROSA utils', () => {
  describe('getAWSAccountID', () =>
    it.each([
      ['possibly undefined values', {}, ''], // TODO: is this right? or it should be undefined?
      [
        'should return the correct AWS account ID',
        fixtures.ROSAManualClusterDetails.cluster,
        '123456789012',
      ],
    ])('%p', (title: string, cluster: any, expected: string) =>
      expect(getAWSAccountID(cluster)).toBe(expected),
    ));

  describe('getOIDCEndpointNoScheme', () =>
    it.each([
      ['possibly undefined values', {}, ''], // TODO: is this right? or it should be undefined?
      [
        'should return the correct OIDC endpoint without URL scheme',
        fixtures.ROSAManualClusterDetails.cluster,
        'rh-oidc.s3.us-east-1.amazonaws.com/1ricsv5bio0domn5gofgaar07aifjpr0',
      ],
    ])('%p', (title: string, cluster: any, expected: string) =>
      expect(getOIDCEndpointNoScheme(cluster)).toBe(expected),
    ));

  describe('getOIDCProviderARN', () =>
    it.each([
      ['possibly undefined values', {}, 'arn:aws:iam:::oidc-provider/'], // TODO: is this right? or it should be undefined?
      [
        'should return the correct OIDC provider ARN',
        fixtures.ROSAManualClusterDetails.cluster,
        'arn:aws:iam::123456789012:oidc-provider/rh-oidc.s3.us-east-1.amazonaws.com/1ricsv5bio0domn5gofgaar07aifjpr0',
      ],
    ])('%p', (title: string, cluster: any, expected: string) =>
      expect(getOIDCProviderARN(cluster)).toBe(expected),
    ));
});
