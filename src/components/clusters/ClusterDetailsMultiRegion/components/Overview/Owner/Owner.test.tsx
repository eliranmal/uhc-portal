import React from 'react';

import { AUTO_CLUSTER_TRANSFER_OWNERSHIP } from '~/queries/featureGates/featureConstants';
import { useGlobalState } from '~/redux/hooks';
import { mockUseFeatureGate, render, screen } from '~/testUtils';

import fixtures from '../../../__tests__/ClusterDetails.fixtures';

import { Owner } from './Owner';

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

jest.mock('~/queries/ClusterDetailsQueries/useFetchClusterDetails', () => ({
  useFetchClusterDetails: jest.fn(),
}));

const useGlobalStateMock = useGlobalState as jest.Mock;

describe('Owner Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFeatureGate([[AUTO_CLUSTER_TRANSFER_OWNERSHIP, true]]);
    useGlobalStateMock.mockReturnValueOnce('testOwner');
  });

  it('Returns static owner value when HCP ROSA', async () => {
    const useParamsMock = jest.requireMock('react-router-dom').useParams;
    useParamsMock.mockReturnValue({ id: '1msoogsgTLQ4PePjrTOt3UqvMzX' });

    const useFetchClusterDetailsMock = jest.requireMock(
      '~/queries/ClusterDetailsQueries/useFetchClusterDetails',
    );
    useFetchClusterDetailsMock.useFetchClusterDetails.mockReturnValue({
      cluster: {
        ...fixtures.clusterDetails.cluster,
        hypershift: {
          enabled: true,
        },
        subscription: {
          creator: {
            username: 'testOwner',
          },
        },
        product: {
          id: 'ROSA',
        },
      },
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
    });

    render(<Owner />);
    expect(await screen.findByText('testOwner')).toBeInTheDocument();
  });

  it('Returns static owner value when OSD', async () => {
    const useParamsMock = jest.requireMock('react-router-dom').useParams;
    useParamsMock.mockReturnValue({ id: '1msoogsgTLQ4PePjrTOt3UqvMzX' });

    const useFetchClusterDetailsMock = jest.requireMock(
      '~/queries/ClusterDetailsQueries/useFetchClusterDetails',
    );
    useFetchClusterDetailsMock.useFetchClusterDetails.mockReturnValue({
      cluster: {
        ...fixtures.clusterDetails.cluster,
        hypershift: {
          enabled: false,
        },
        subscription: {
          creator: {
            username: 'testOwner',
          },
        },
        product: {
          id: 'OSD',
        },
      },
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
    });

    render(<Owner />);
    expect(await screen.findByText('testOwner')).toBeInTheDocument();
  });

  it('Returns modal link to transfer owner', async () => {
    const useParamsMock = jest.requireMock('react-router-dom').useParams;
    useParamsMock.mockReturnValue({ id: '1msoogsgTLQ4PePjrTOt3UqvMzX' });

    const useFetchClusterDetailsMock = jest.requireMock(
      '~/queries/ClusterDetailsQueries/useFetchClusterDetails',
    );
    useFetchClusterDetailsMock.useFetchClusterDetails.mockReturnValue({
      cluster: {
        ...fixtures.clusterDetails.cluster,
        subscription: {
          creator: {
            username: 'testOwner',
          },
        },
        hypershift: {
          enabled: false,
        },
        product: {
          id: 'ROSA',
        },
      },
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
    });

    render(<Owner />);
    expect(await screen.findByRole('button', { name: /testOwner/i })).toBeInTheDocument();
  });
});
