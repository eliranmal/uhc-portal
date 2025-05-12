import * as clusterService from '~/services/clusterService';
import { renderHook, waitFor } from '~/testUtils';

import { useResumeCluster } from './useResumeCluster';

// @ts-ignore
const mockGetClusterServiceForRegion = jest.spyOn(clusterService, 'getClusterServiceForRegion');
const mockedResumeCluster = jest.fn();

describe('useHibernateClusters', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls resume API with region', async () => {
    // Mocking cluster service
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({ resumeCluster: mockedResumeCluster });
    mockedResumeCluster.mockResolvedValue({});

    const { result } = renderHook(() => useResumeCluster());

    result.current.mutate({
      clusterID: 'myClusterId',
      region: 'myRegion',
    });

    await waitFor(() => {
      expect(mockGetClusterServiceForRegion).toHaveBeenCalledWith('myRegion');
    });
    expect(mockedResumeCluster).toHaveBeenCalledWith('myClusterId');
  });

  it('calls hibernate API without region', async () => {
    // Mocking cluster service
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({ resumeCluster: mockedResumeCluster });
    mockedResumeCluster.mockResolvedValue({});

    const { result } = renderHook(() => useResumeCluster());

    result.current.mutate({
      clusterID: 'myClusterId',
      region: undefined,
    });

    await waitFor(() => {
      expect(mockGetClusterServiceForRegion).toHaveBeenCalledWith(undefined);
    });
    expect(mockedResumeCluster).toHaveBeenCalledWith('myClusterId');
  });
});
