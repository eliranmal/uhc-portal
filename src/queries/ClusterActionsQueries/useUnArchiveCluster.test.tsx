import * as reactRedux from 'react-redux';

import * as clusterService from '~/services/clusterService';
import { renderHook, waitFor } from '~/testUtils';

import { useUnArchiveCluster } from './useUnArchiveCluster';

jest.mock('react-redux', () => {
  const config = {
    __esModule: true,
    ...jest.requireActual('react-redux'),
  };
  return config;
});

// @ts-ignore
const mockGetClusterServiceForRegion = jest.spyOn(clusterService, 'getClusterServiceForRegion');
const mockedUnArchiveCluster = jest.fn();

describe('useArchiveCluster', () => {
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  useDispatchMock.mockReturnValue(mockedDispatch);
  mockedUnArchiveCluster.mockResolvedValue('hello world');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calling mutate calls archiveCluster', async () => {
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({ unarchiveCluster: mockedUnArchiveCluster });

    const { result } = renderHook(() => useUnArchiveCluster());

    result.current.mutate({
      displayName: 'myClusterName',
      subscriptionID: 'mySubscriptionId',
    });

    await waitFor(() => {
      expect(mockGetClusterServiceForRegion).toHaveBeenCalled();
    });

    expect(mockedUnArchiveCluster).toHaveBeenCalledWith('mySubscriptionId');
    expect(mockedDispatch).toHaveBeenCalled();

    expect(mockedDispatch).toHaveBeenCalledWith({
      type: '@@INSIGHTS-CORE/NOTIFICATIONS/ADD_NOTIFICATION',
      payload: expect.objectContaining({
        variant: 'success',
        title: 'Cluster myClusterName has been unarchived',
        dismissDelay: 8000,
        dismissable: false,
      }),
    });
  });
});
