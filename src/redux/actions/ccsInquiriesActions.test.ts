import { GCPAuthType } from '~/components/clusters/wizards/osd/ClusterSettings/CloudProvider/types';
import {
  getGCPCloudProviderVPCs,
  getGCPKeyRings,
  getGCPKeys,
  LIST_GCP_KEY_RINGS,
  LIST_GCP_KEYS,
  LIST_VPCS,
} from '~/redux/actions/ccsInquiriesActions';
import { clusterService } from '~/services';

jest.mock('../../services/clusterService', () => ({
  listGCPVPCs: jest.fn(() => Promise.resolve({ items: [] })),
  listGCPKeyRings: jest.fn(() => Promise.resolve({ items: [] })),
  listGCPKeys: jest.fn(() => Promise.resolve({ items: [] })),
}));

const serviceAccount = {
  type: 'service_account',
  project_id: 'test-project',
  private_key_id: '9cuqryrimqcnant1bqrmjxxyxbyadmpda7dw72pf',
  private_key: 'test-key',
  client_email: 'test-project@test-project.iam.gserviceaccount.com',
  client_id: '229842488140250180494',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/test-project.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};
const wifID = '2d8knkhpucl6m2adfm6oo4l5n2ml74qr';
const region = 'us-east-1';

describe('ccsInquiriesActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGCPCloudProviderVPCs', () => {
    it('dispatches successfully with service account authentication', async () => {
      // Act
      const result = getGCPCloudProviderVPCs(
        LIST_VPCS,
        GCPAuthType.ServiceAccounts,
        JSON.stringify(serviceAccount),
        region,
      );

      // Assert
      expect(result).toEqual({
        payload: expect.any(Promise),
        meta: {
          cloudProvider: 'gcp',
          credentials: JSON.stringify(serviceAccount),
          region,
        },
        type: LIST_VPCS,
      });
      await result.payload;
      // eslint-disable-next-line camelcase
      const { universe_domain, ...expectedCredentials } = serviceAccount;
      expect(clusterService.listGCPVPCs).toHaveBeenCalledWith(expectedCredentials, region);
    });

    it('dispatches successfully with WIF authentication', async () => {
      // Act
      const result = getGCPCloudProviderVPCs(
        LIST_VPCS,
        GCPAuthType.WorkloadIdentityFederation,
        wifID,
        region,
      );

      // Assert
      expect(result).toEqual({
        payload: expect.any(Promise),
        meta: {
          cloudProvider: 'gcp',
          credentials: wifID,
          region,
        },
        type: LIST_VPCS,
      });
      await result.payload;
      expect(clusterService.listGCPVPCs).toHaveBeenCalledWith(
        {
          authentication: {
            kind: 'WifConfig',
            id: wifID,
          },
        },
        region,
      );
    });
  });

  describe('getGCPKeyRings', () => {
    const location = 'test';
    it('dispatches successfully with service account authentication', async () => {
      // Act
      const result = getGCPKeyRings(
        GCPAuthType.ServiceAccounts,
        JSON.stringify(serviceAccount),
        location,
      );

      // Assert
      expect(result).toEqual({
        payload: expect.any(Promise),
        meta: {
          cloudProvider: 'gcp',
          credentials: JSON.stringify(serviceAccount),
          keyLocation: location,
        },
        type: LIST_GCP_KEY_RINGS,
      });
      await result.payload;
      // eslint-disable-next-line camelcase
      const { universe_domain, ...expectedCredentials } = serviceAccount;
      expect(clusterService.listGCPKeyRings).toHaveBeenCalledWith(expectedCredentials, location);
    });
    it('dispatches successfully with WIF authentication', async () => {
      // Act
      const result = getGCPKeyRings(GCPAuthType.WorkloadIdentityFederation, wifID, location);

      // Assert
      expect(result).toEqual({
        payload: expect.any(Promise),
        meta: {
          cloudProvider: 'gcp',
          credentials: wifID,
          keyLocation: location,
        },
        type: LIST_GCP_KEY_RINGS,
      });
      await result.payload;
      expect(clusterService.listGCPKeyRings).toHaveBeenCalledWith(
        {
          authentication: {
            kind: 'WifConfig',
            id: wifID,
          },
        },
        location,
      );
    });
  });

  describe('getGCPKeys', () => {
    const keyLocation = 'test';
    const keyRing = 'test';
    it('dispatches successfully with service account authentication', async () => {
      // Act
      const result = getGCPKeys(
        GCPAuthType.ServiceAccounts,
        JSON.stringify(serviceAccount),
        keyLocation,
        keyRing,
      );

      // Assert
      expect(result).toEqual({
        payload: expect.any(Promise),
        meta: {
          cloudProvider: 'gcp',
          credentials: JSON.stringify(serviceAccount),
          keyLocation,
          keyRing,
        },
        type: LIST_GCP_KEYS,
      });
      await result.payload;
      // eslint-disable-next-line camelcase
      const { universe_domain, ...expectedCredentials } = serviceAccount;
      expect(clusterService.listGCPKeys).toHaveBeenCalledWith(
        expectedCredentials,
        keyLocation,
        keyRing,
      );
    });
    it('dispatches successfully with WIF authentication', async () => {
      // Act
      const result = getGCPKeys(
        GCPAuthType.WorkloadIdentityFederation,
        wifID,
        keyLocation,
        keyRing,
      );

      // Assert
      expect(result).toEqual({
        payload: expect.any(Promise),
        meta: {
          cloudProvider: 'gcp',
          credentials: wifID,
          keyLocation,
          keyRing,
        },
        type: LIST_GCP_KEYS,
      });
      await result.payload;
      expect(clusterService.listGCPKeys).toHaveBeenCalledWith(
        {
          authentication: {
            kind: 'WifConfig',
            id: wifID,
          },
        },
        keyLocation,
        keyRing,
      );
    });
  });
});
