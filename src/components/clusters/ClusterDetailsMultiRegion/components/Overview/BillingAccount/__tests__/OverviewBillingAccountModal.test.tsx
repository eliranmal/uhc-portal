import React from 'react';

import { mockedClusterResponse } from '~/queries/__mocks__/queryMockedData';
import { render, screen } from '~/testUtils';
import { ClusterFromSubscription } from '~/types/types';

import fixtures from '../../../../__tests__/ClusterDetails.fixtures';
import { OverviewBillingAccountModal } from '../OverviewBillingAccountModal';

jest.mock('~/queries/ClusterDetailsQueries/useEditCluster', () => ({
  useEditCluster: jest.fn(),
}));

describe('Overview <BillingAccountModal> Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('show correct title and content', async () => {
    const useEditClusterMock = jest.requireMock('~/queries/ClusterDetailsQueries/useEditCluster');
    useEditClusterMock.useEditCluster.mockReturnValue({
      isLoading: false,
      data: mockedClusterResponse,
      mutation: jest.fn(),
      isError: false,
      error: null,
    });
    render(
      <OverviewBillingAccountModal
        onClose={() => {}}
        billingAccount="123456"
        cluster={fixtures.clusterDetails.cluster as unknown as ClusterFromSubscription}
      />,
    );

    expect(screen.queryByText('Edit AWS billing account')).toBeInTheDocument();
    expect(screen.queryByText('Connect a new AWS billing account')).toBeInTheDocument();
  });
});
