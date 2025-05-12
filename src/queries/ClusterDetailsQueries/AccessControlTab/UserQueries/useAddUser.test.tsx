import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import { renderHook, waitFor } from '~/testUtils';

import clusterService, { getClusterServiceForRegion } from '../../../../services/clusterService';

import { useAddUser } from './useAddUser';

jest.mock('../../../../services/clusterService', () => ({
  __esModule: true,
  default: {
    addClusterGroupUser: jest.fn(),
  },
}));

jest.mock('../../../../services/clusterService', () => ({
  getClusterServiceForRegion: jest.fn(),
}));
jest.mock('~/queries/helpers');

const queryClient = new QueryClient();
const wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useAddUser', () => {
  const mockAddClusterGroupUser = jest.fn();
  const mockGetClusterServiceForRegion = getClusterServiceForRegion as jest.Mock;
  const mockFormatErrorData = formatErrorData as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    clusterService.addClusterGroupUser = mockAddClusterGroupUser;
    mockGetClusterServiceForRegion.mockReturnValue({
      addClusterGroupUser: mockAddClusterGroupUser,
    });
  });

  it('should call addClusterGroupUser with correct arguments when region is not provided', async () => {
    const clusterID = 'test-cluster';
    const selectedGroup = 'test-group';
    const userId = 'test-user';

    mockAddClusterGroupUser.mockResolvedValueOnce('success');

    const { result } = renderHook(() => useAddUser(clusterID));

    await result.current.mutate({ selectedGroup, userId });

    await waitFor(() => {
      expect(result.current.data).toBe('success');
    });

    expect(result.current.isSuccess).toBe(true);
    expect(mockAddClusterGroupUser).toHaveBeenCalledWith(clusterID, selectedGroup, userId);
  });

  it('should call addClusterGroupUser with correct arguments when region is provided', async () => {
    const clusterID = 'test-cluster';
    const region = 'test-region';
    const selectedGroup = 'test-group';
    const userId = 'test-user';

    mockAddClusterGroupUser.mockResolvedValueOnce('success');

    const { result } = renderHook(() => useAddUser(clusterID, region), { wrapper });

    await result.current.mutate({ selectedGroup, userId });

    await waitFor(() => {
      expect(result.current.data).toBe('success');
    });

    expect(result.current.isSuccess).toBe(true);
    expect(getClusterServiceForRegion).toHaveBeenCalledWith(region);
    expect(mockAddClusterGroupUser).toHaveBeenCalledWith(clusterID, selectedGroup, userId);
  });

  it('should format error correctly on failure', async () => {
    const clusterID = 'test-cluster';
    const selectedGroup = 'test-group';
    const userId = 'test-user';
    const mockError = new Error('test error');

    mockAddClusterGroupUser.mockRejectedValueOnce(mockError);
    mockFormatErrorData.mockReturnValueOnce({ message: 'formatted error' });

    const { result } = renderHook(() => useAddUser(clusterID), { wrapper });

    await result.current.mutate({ selectedGroup, userId });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual({ message: 'formatted error' });

    expect(mockAddClusterGroupUser).toHaveBeenCalledWith(clusterID, selectedGroup, userId);
    expect(mockFormatErrorData).toHaveBeenCalledWith(
      result.current.isPending,
      result.current.isError,
      mockError,
    );
  });
});
