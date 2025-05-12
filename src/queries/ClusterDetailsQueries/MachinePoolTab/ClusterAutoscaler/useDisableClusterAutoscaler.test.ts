import * as clusterService from '~/services/clusterService';
import { renderHook, waitFor } from '~/testUtils';

import { invalidateClusterDetailsQueries } from '../../useFetchClusterDetails';

import { useDisableClusterAutoscaler } from './useDisableClusterAutoscaler';
import { refetchClusterAutoscalerData } from './useFetchClusterAutoscaler';

jest.mock('../../useFetchClusterDetails', () => ({
  invalidateClusterDetailsQueries: jest.fn(),
}));

jest.mock('./useFetchClusterAutoscaler', () => ({
  refetchClusterAutoscalerData: jest.fn(),
}));

// @ts-ignore
const mockGetClusterServiceForRegion = jest.spyOn(clusterService, 'getClusterServiceForRegion');
const mockDisableClusterAutoscaler = jest.fn();

describe('useEnableClusterAutoscaler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const clusterID = 'myClusterId';
  const region = 'myRegion';
  it('calls disableAutoscaler with region and invalidates cluster details', async () => {
    // Mocking cluster service
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({
      disableClusterAutoscaler: mockDisableClusterAutoscaler,
    });
    mockDisableClusterAutoscaler.mockResolvedValue({});

    const { result } = renderHook(() => useDisableClusterAutoscaler(clusterID, region));

    result.current.mutate();

    await waitFor(() => {
      expect(mockGetClusterServiceForRegion).toHaveBeenCalledWith('myRegion');
    });

    expect(refetchClusterAutoscalerData).toHaveBeenCalledWith(clusterID);
    expect(invalidateClusterDetailsQueries).toHaveBeenCalled();
    expect(mockDisableClusterAutoscaler).toHaveBeenCalledWith('myClusterId');
  });

  it('calls disableAutoscaler without region and invalidates cluster details', async () => {
    // Mocking cluster service
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({
      disableClusterAutoscaler: mockDisableClusterAutoscaler,
    });
    mockDisableClusterAutoscaler.mockResolvedValue({});

    const { result } = renderHook(() => useDisableClusterAutoscaler(clusterID, undefined));

    result.current.mutate();

    await waitFor(() => {
      expect(mockGetClusterServiceForRegion).toHaveBeenCalledWith(undefined);
    });

    expect(refetchClusterAutoscalerData).toHaveBeenCalledWith(clusterID);
    expect(invalidateClusterDetailsQueries).toHaveBeenCalled();
    expect(mockDisableClusterAutoscaler).toHaveBeenCalledWith('myClusterId');
  });
});
