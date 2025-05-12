import * as clusterService from '~/services/clusterService';
import { renderHook, waitFor } from '~/testUtils';

import { useDeleteCluster } from './useDeleteCluster';

const mockGetClusterServiceForRegion = jest.spyOn(clusterService, 'getClusterServiceForRegion');
const mockedDeleteCluster = jest.fn();

describe('useDeleteCluster', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const clusterID = 'clusterID1';

  it('does not call regional service when region does not exist', async () => {
    const region = undefined;
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({
      deleteCluster: mockedDeleteCluster,
    });
    mockedDeleteCluster.mockResolvedValue({});

    const { result } = renderHook(() => useDeleteCluster());

    result.current.mutate({ clusterID, region });

    await waitFor(() => {
      expect(mockedDeleteCluster).not.toHaveBeenCalled();
    });
    expect(mockGetClusterServiceForRegion).not.toHaveBeenCalled();
    expect(mockedDeleteCluster).not.toHaveBeenCalledWith(clusterID);
  });

  it('calls regional service when region exists', async () => {
    const region = 'aws.ap-southeast-1.stage';
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({
      deleteCluster: mockedDeleteCluster,
    });
    mockedDeleteCluster.mockResolvedValue({});

    const { result } = renderHook(() => useDeleteCluster());

    result.current.mutate({ clusterID, region });

    await waitFor(() => {
      expect(mockedDeleteCluster).toHaveBeenCalled();
    });
    expect(mockGetClusterServiceForRegion).toHaveBeenCalledWith(region);
    expect(mockedDeleteCluster).toHaveBeenCalledWith(clusterID);
  });
});
