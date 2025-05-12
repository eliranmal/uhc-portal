import type axios from 'axios';

import apiRequest from '~/services/apiRequest';
import * as clusterService from '~/services/clusterService';
import { renderHook, waitFor } from '~/testUtils';

import { useEditConsoleURL } from './useEditConsoleURL';

// @ts-ignore
const mockGetClusterServiceForRegion = jest.spyOn(clusterService, 'getClusterServiceForRegion');
const mockedEditClusters = jest.fn();

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

describe('useEditClusterName', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls multiRegion api when mutate function is activated', async () => {
    // Mocking cluster service
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({ editCluster: mockedEditClusters });
    mockedEditClusters.mockResolvedValue({});

    // mocking API call for account service
    apiRequestMock.patch.mockResolvedValue({
      data: {},
    });

    const { result } = renderHook(() => useEditConsoleURL());

    result.current.mutate({
      subscriptionID: 'mySubscriptionId',
      clusterID: 'myClusterId',
      consoleUrl: 'myNewConsoleURL',
      region: 'myRegion',
    });

    await waitFor(() => {
      expect(apiRequestMock.patch).toHaveBeenCalledTimes(1);
    });
    expect(mockGetClusterServiceForRegion).toHaveBeenCalledWith('myRegion');
    expect(mockedEditClusters).toHaveBeenCalledWith('myClusterId', {
      console: { url: 'myNewConsoleURL' },
    });

    expect(apiRequestMock.patch).toHaveBeenCalledWith(
      '/api/accounts_mgmt/v1/subscriptions/mySubscriptionId',
      { console_url: 'myNewConsoleURL' },
    );
  });

  it('calls global api when mutate function is activated', async () => {
    // Mocking cluster service
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({ editCluster: mockedEditClusters });
    mockedEditClusters.mockResolvedValue({});

    // mocking API call for account service
    apiRequestMock.patch.mockResolvedValue({
      data: {},
    });

    const { result } = renderHook(() => useEditConsoleURL());

    result.current.mutate({
      subscriptionID: 'mySubscriptionId',
      clusterID: 'myClusterId',
      consoleUrl: 'myNewConsoleURL',
    });

    await waitFor(() => {
      expect(apiRequestMock.patch).toHaveBeenCalledTimes(1);
    });
    expect(mockGetClusterServiceForRegion).toHaveBeenCalledWith(undefined);
    expect(mockedEditClusters).toHaveBeenCalledWith('myClusterId', {
      console: { url: 'myNewConsoleURL' },
    });

    expect(apiRequestMock.patch).toHaveBeenCalledWith(
      '/api/accounts_mgmt/v1/subscriptions/mySubscriptionId',
      { console_url: 'myNewConsoleURL' },
    );
  });
});
