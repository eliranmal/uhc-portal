import * as clusterService from '~/services/clusterService';
import { renderHook, waitFor } from '~/testUtils';

import { invalidateClusterDetailsQueries } from '../../useFetchClusterDetails';

import { useEnableClusterAutoscaler } from './useEnableClusterAutoscaler';
import { refetchClusterAutoscalerData } from './useFetchClusterAutoscaler';

jest.mock('../../useFetchClusterDetails', () => ({
  invalidateClusterDetailsQueries: jest.fn(),
}));

jest.mock('./useFetchClusterAutoscaler', () => ({
  refetchClusterAutoscalerData: jest.fn(),
}));

// @ts-ignore
const mockGetClusterServiceForRegion = jest.spyOn(clusterService, 'getClusterServiceForRegion');
const mockEnableClusterAutoscaler = jest.fn();

describe('useEnableClusterAutoscaler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const clusterID = 'myClusterId';
  const maxNodesTotalDefault = 100;
  const region = 'myRegion';
  it('calls enableAutoscaler with region and invalidates cluster details', async () => {
    // Mocking cluster service
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({
      enableClusterAutoscaler: mockEnableClusterAutoscaler,
    });
    mockEnableClusterAutoscaler.mockResolvedValue({});

    const { result } = renderHook(() =>
      useEnableClusterAutoscaler(clusterID, maxNodesTotalDefault, region),
    );

    result.current.mutate();

    await waitFor(() => {
      expect(mockGetClusterServiceForRegion).toHaveBeenCalledWith('myRegion');
    });

    expect(refetchClusterAutoscalerData).toHaveBeenCalledWith(clusterID);
    expect(invalidateClusterDetailsQueries).toHaveBeenCalled();
    expect(mockEnableClusterAutoscaler).toHaveBeenCalledWith('myClusterId', expect.any(Object));
  });

  it('calls enableAutoscaler without region and invalidates cluster details', async () => {
    // Mocking cluster service
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({
      enableClusterAutoscaler: mockEnableClusterAutoscaler,
    });
    mockEnableClusterAutoscaler.mockResolvedValue({});

    const { result } = renderHook(() =>
      useEnableClusterAutoscaler(clusterID, maxNodesTotalDefault),
    );

    result.current.mutate();

    await waitFor(() => {
      expect(mockGetClusterServiceForRegion).toHaveBeenCalledWith(undefined);
    });

    expect(refetchClusterAutoscalerData).toHaveBeenCalledWith(clusterID);
    expect(invalidateClusterDetailsQueries).toHaveBeenCalled();
    expect(mockEnableClusterAutoscaler).toHaveBeenCalledWith('myClusterId', expect.any(Object));
  });
});
