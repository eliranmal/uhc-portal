import * as clusterService from '~/services/clusterService';
import { renderHook, waitFor } from '~/testUtils';

import { useHibernateCluster } from './useHibernateCluster';

// @ts-ignore
const mockGetClusterServiceForRegion = jest.spyOn(clusterService, 'getClusterServiceForRegion');
const mockedHibernateCluster = jest.fn();

describe('useHibernateClusters', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls hibernate API with region', async () => {
    // Mocking cluster service
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({ hibernateCluster: mockedHibernateCluster });
    mockedHibernateCluster.mockResolvedValue({});

    const { result } = renderHook(() => useHibernateCluster());

    result.current.mutate({
      clusterID: 'myClusterId',
      region: 'myRegion',
    });

    await waitFor(() => {
      expect(mockGetClusterServiceForRegion).toHaveBeenCalledWith('myRegion');
    });
    expect(mockedHibernateCluster).toHaveBeenCalledWith('myClusterId');
  });

  it('calls hibernate API without region', async () => {
    // Mocking cluster service
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({ hibernateCluster: mockedHibernateCluster });
    mockedHibernateCluster.mockResolvedValue({});

    const { result } = renderHook(() => useHibernateCluster());

    result.current.mutate({
      clusterID: 'myClusterId',
      region: undefined,
    });

    await waitFor(() => {
      expect(mockGetClusterServiceForRegion).toHaveBeenCalledWith(undefined);
    });
    expect(mockedHibernateCluster).toHaveBeenCalledWith('myClusterId');
  });
});
