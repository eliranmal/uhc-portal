import axios from 'axios';

import { waitFor } from '@testing-library/react';

import apiRequest from '~/services/apiRequest';
import { renderHook } from '~/testUtils';

import { useGetSchedules } from './useGetSchedules';

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

describe('useGetSchedules hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Get useFetchSchedules valid response with hypershift cluster', async () => {
    const clusterID = 'mockedClusterID';
    const isHypershiftCluster = true;

    apiRequestMock.get.mockResolvedValueOnce({
      data: {
        items: [],
        kind: 'UpgradePolicyList',
        page: 1,
        size: 1,
        total: 0,
      },
    });

    const { result } = renderHook(() => useGetSchedules(clusterID, isHypershiftCluster));

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
    expect(result.current.data?.kind).toEqual('UpgradePolicyList');
  });

  it('Get useFetchSchedules valid response with non hypershift cluster', async () => {
    const clusterID = 'mockedClusterID';
    const isHypershiftCluster = false;

    apiRequestMock.get.mockResolvedValueOnce({
      data: {
        items: [],
        kind: 'UpgradePolicyList',
        page: 1,
        size: 1,
        total: 0,
      },
    });

    const { result } = renderHook(() => useGetSchedules(clusterID, isHypershiftCluster));
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
    expect(result.current.data?.kind).toEqual('UpgradePolicyList');
  });

  it('Get useGetSchedules error response with hypershift cluster', async () => {
    const clusterID = 'mockedClusterID';
    const isHypershift = true;

    // Mock the network request to simulate an error
    apiRequestMock.get.mockRejectedValue({
      name: 403,
      message: 'No data',
    });

    // Render the hook
    const { result } = renderHook(() => useGetSchedules(clusterID, isHypershift));
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
    expect(result.current.error?.name).toEqual(403);
    expect(result.current.error?.message).toEqual('No data');
  });

  it('Get useGetSchedules error response with non hypershift cluster', async () => {
    const clusterID = 'mockedClusterID';
    const isHypershift = false;

    // Mock the network request to simulate an error
    apiRequestMock.get.mockRejectedValue({
      name: 403,
      message: 'No data',
    });

    // Render the hook
    const { result } = renderHook(() => useGetSchedules(clusterID, isHypershift));
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
    expect(result.current.error?.name).toEqual(403);
    expect(result.current.error?.message).toEqual('No data');
  });
});
