import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { renderHook, waitFor } from '~/testUtils';

import { getClusterService, getClusterServiceForRegion } from '../../../../services/clusterService';

import { useAddGrant } from './useAddGrant';

jest.mock('../../../../services/clusterService', () => ({
  __esModule: true,
  default: {
    addGrant: jest.fn(),
  },
}));

jest.mock('../../../../services/clusterService', () => ({
  getClusterServiceForRegion: jest.fn(),
  getClusterService: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useAddGrant', () => {
  const mockAddGrant = jest.fn();
  const mockGetClusterService = getClusterService as jest.Mock;
  const mockGetClusterServiceForRegion = getClusterServiceForRegion as jest.Mock;
  mockGetClusterService.mockReturnValue({
    addGrant: mockAddGrant,
  });
  mockGetClusterServiceForRegion.mockReturnValue({
    addGrant: mockAddGrant,
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call addClusterGroupUser with correct arguments when region is not provided', async () => {
    const clusterID = 'test-cluster';
    const roleId = 'test-roleID';
    const arn = 'test-arn';

    mockAddGrant.mockResolvedValueOnce('success');

    const { result } = renderHook(() => useAddGrant(clusterID));

    await result.current.mutateAsync({ roleId, arn });

    expect(getClusterService).toHaveBeenCalled();
    expect(getClusterServiceForRegion).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(result.current.data).toBe('success');
    });

    expect(mockAddGrant).toHaveBeenCalledWith(clusterID, roleId, arn);
  });

  it('should call addClusterGroupUser with correct arguments when region is provided', async () => {
    const clusterID = 'test-cluster';
    const region = 'test-region';
    const roleId = 'test-roleID';
    const arn = 'test-arn';

    mockAddGrant.mockResolvedValueOnce('success');

    const { result } = renderHook(() => useAddGrant(clusterID, region), { wrapper });

    await result.current.mutateAsync({ roleId, arn });

    await waitFor(() => {
      expect(result.current.data).toBe('success');
    });

    expect(getClusterServiceForRegion).toHaveBeenCalledWith(region);
    expect(mockAddGrant).toHaveBeenCalledWith(clusterID, roleId, arn);
  });
});
