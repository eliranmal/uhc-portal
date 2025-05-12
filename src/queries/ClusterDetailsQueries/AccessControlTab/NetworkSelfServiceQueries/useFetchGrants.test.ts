import axios from 'axios';

import { waitFor } from '@testing-library/react';

import apiRequest from '~/services/apiRequest';
import { renderHook } from '~/testUtils';

import { useFetchGrants } from './useFetchGrants';

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

describe('useFetchGrants query', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const clusterID = 'mockedClusterID';

  it('useFetchGrants valid response', async () => {
    apiRequestMock.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'mockedGrantID',
          },
        ],
        kind: 'AWSInfrastructureAccessRoleGrantList',
        page: 1,
        size: 1,
        total: 0,
      },
    });

    const { result } = renderHook(() => useFetchGrants(clusterID));

    // Initial loading state
    expect(apiRequest.get).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(undefined);

    // Assert results
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data[0].id).toEqual('mockedGrantID');
  });

  it('useFetchGrants error response', async () => {
    // Mock the network request to simulate an error
    apiRequestMock.get.mockRejectedValue({
      name: 403,
      message: 'No data',
    });

    // Render the hook
    const { result } = renderHook(() => useFetchGrants(clusterID));
    // Initial loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(undefined);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBe(null);

    // Assert results
    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 7000 },
    );
    expect(result.current.data).toBe(undefined);
    expect(result.current.isError).toBe(true);
    expect(result.current.error?.error.name).toEqual(403);
    expect(result.current.error?.error.message).toEqual('No data');
  });
});
