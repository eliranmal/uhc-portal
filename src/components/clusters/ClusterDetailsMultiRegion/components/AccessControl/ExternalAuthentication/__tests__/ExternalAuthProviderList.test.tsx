import * as React from 'react';
import type axios from 'axios';

import apiRequest from '~/services/apiRequest';
import { screen, waitFor, withState } from '~/testUtils';

import { ExternalAuthProviderList } from '../ExternalAuthProviderList';

import { ExtAuthProviders } from './ExternalAuthProverList.fixtures';

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

const initialState = {
  clusters: {
    details: {
      cluster: {
        id: 'myCluster',
        canUpdateClusterResource: true,
      },
    },
  },
};

const clusterWithExtAuthProvider = {
  clusters: {
    details: {
      cluster: {
        id: 'myCluster1',
        canUpdateClusterResource: true,
        external_auth_config: {
          enabled: true,
          external_auths: [
            {
              id: 'myprovider1',
              issuer: { url: 'https://redhat.com', audiences: ['audience-abc'] },
              claim: { mappings: { username: { claim: 'email' }, groups: { claim: 'groups' } } },
            },
          ],
        },
      },
    },
  },
};

describe('<ExternalAuthProviderList />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('with no ext auth provider set', () => {
    it('returns add new button', () => {
      apiRequestMock.get.mockResolvedValue({ items: [], page: 1, size: 0, total: 0 });

      withState(initialState, true).render(
        <ExternalAuthProviderList clusterID="myCluster" canUpdateClusterResource />,
      );
      expect(apiRequestMock.get).toHaveBeenCalledTimes(1);
      expect(apiRequestMock.get).toHaveBeenCalledWith(
        '/api/clusters_mgmt/v1/clusters/myCluster/external_auth_config/external_auths',
      );
      expect(
        screen.queryByRole('button', { name: /Add external authentication provider/i }),
      ).toBeInTheDocument();
    });
  });

  describe('with an ext auth provider set', () => {
    it('no add button shown', async () => {
      apiRequestMock.get.mockResolvedValue(ExtAuthProviders);

      withState(clusterWithExtAuthProvider, true).render(
        <ExternalAuthProviderList clusterID="myCluster1" canUpdateClusterResource />,
      );

      expect(apiRequestMock.get).toHaveBeenCalledTimes(1);
      expect(apiRequestMock.get).toHaveBeenCalledWith(
        '/api/clusters_mgmt/v1/clusters/myCluster1/external_auth_config/external_auths',
      );

      await waitFor(() =>
        expect(
          screen.queryByRole('button', { name: /Add external authentication provider/i }),
        ).not.toBeInTheDocument(),
      );
    });

    it('list shown of the external auth info', async () => {
      apiRequestMock.get.mockResolvedValue(ExtAuthProviders);
      withState(clusterWithExtAuthProvider, true).render(
        <ExternalAuthProviderList clusterID="myCluster1" canUpdateClusterResource />,
      );

      expect(await screen.findByText('Name')).toBeInTheDocument();
      expect(await screen.findByText('Issuer URL')).toBeInTheDocument();
      expect(await screen.findByText('Audiences')).toBeInTheDocument();
      expect(await screen.findByText('myprovider1')).toBeInTheDocument();
      expect(await screen.findByText('https://redhat.com')).toBeInTheDocument();
      expect(await screen.findByText('audience-abc')).toBeInTheDocument();
    });
  });
});
