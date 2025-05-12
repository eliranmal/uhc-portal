import * as reactRedux from 'react-redux';

import * as clusterService from '~/services/clusterService';
import { renderHook, waitFor } from '~/testUtils';

import { useArchiveCluster } from './useArchiveCluster';

jest.mock('react-redux', () => {
  const config = {
    __esModule: true,
    ...jest.requireActual('react-redux'),
  };
  return config;
});

// @ts-ignore
const mockGetClusterServiceForRegion = jest.spyOn(clusterService, 'getClusterServiceForRegion');
const mockedArchiveCluster = jest.fn();

describe('useArchiveCluster', () => {
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  useDispatchMock.mockReturnValue(mockedDispatch);
  mockedArchiveCluster.mockResolvedValue('hello world');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calling mutate calls archiveCluster', async () => {
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({ archiveCluster: mockedArchiveCluster });
    mockedArchiveCluster.mockResolvedValue('hello world');

    const { result } = renderHook(() => useArchiveCluster());

    result.current.mutate({
      displayName: 'myClusterName',
      subscriptionID: 'mySubscriptionId',
    });

    await waitFor(() => {
      expect(mockGetClusterServiceForRegion).toHaveBeenCalled();
    });

    expect(mockedArchiveCluster).toHaveBeenCalledWith('mySubscriptionId');
    expect(mockedDispatch).toHaveBeenCalled();

    expect(mockedDispatch).toHaveBeenCalledWith({
      type: '@@INSIGHTS-CORE/NOTIFICATIONS/ADD_NOTIFICATION',
      payload: expect.objectContaining({
        variant: 'success',
        title: 'Cluster myClusterName has been archived',
        dismissDelay: 8000,
        dismissable: false,
      }),
    });
  });
});
