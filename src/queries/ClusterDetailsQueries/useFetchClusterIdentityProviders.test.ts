import axios from 'axios';

import { waitFor } from '@testing-library/react';

import apiRequest from '~/services/apiRequest';
import { renderHook } from '~/testUtils';

import { clusterIDP } from '../__mocks__/queryMockedData';

import { useFetchClusterIdentityProviders } from './useFetchClusterIdentityProviders';

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

describe('useFetchClusterIdentityProviders hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Get useFetchClusterIdentityProviders valid response', async () => {
    const clusterID = 'mockedClusterID';

    // Mock the network request using axios
    apiRequestMock.get.mockResolvedValueOnce({ data: clusterIDP });
    const { result } = renderHook(() => useFetchClusterIdentityProviders(clusterID));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(false);
    expect(result.current.clusterIdentityProviders).toEqual(clusterIDP);
  });

  it('Get useFetchClusterIdentityProviders error response', async () => {
    const clusterID = 'mockedClusterID';

    // Mock the network request using axios
    apiRequestMock.get.mockRejectedValueOnce({
      name: 403,
      message: 'No data',
    });
    const { result } = renderHook(() => useFetchClusterIdentityProviders(clusterID));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.isError).toBe(true);
    expect(result.current.clusterIdentityProviders).toBe(undefined);
  });
});
