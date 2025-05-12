import type axios from 'axios';

import apiRequest from '~/services/apiRequest';
import * as clusterService from '~/services/clusterService';
import { renderHook, waitFor } from '~/testUtils';

import { useUpgradeClusterFromTrial } from './useUpgradeClusterFromTrial';

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

// @ts-ignore
const mockGetClusterServiceForRegion = jest.spyOn(clusterService, 'getClusterServiceForRegion');
const mockedUpgradeClusterFromTrial = jest.fn();

describe('useEditClusterName', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const clusterID = 'mockedClusterID';
  const region = 'mockedRegion';
  const mutateData = {
    billing_model: 'standard',
    product: {
      id: 'osd',
    },
  };

  it('calls multiRegion api when mutate function is activated', async () => {
    apiRequestMock.patch.mockResolvedValueOnce({
      data: {},
    });
    const { result } = renderHook(() => useUpgradeClusterFromTrial());

    result.current.mutate({ clusterID, params: mutateData });

    await waitFor(() => {
      expect(apiRequestMock.patch).toHaveBeenCalled();
    });
    expect(apiRequestMock.patch).toHaveBeenCalledWith(
      `/api/clusters_mgmt/v1/clusters/${clusterID}`,
      mutateData,
    );
  });

  it('calls global api when mutate function is activated', async () => {
    // Mocking cluster service
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({
      upgradeTrialCluster: mockedUpgradeClusterFromTrial,
    });
    mockedUpgradeClusterFromTrial.mockResolvedValue({});

    const { result } = renderHook(() => useUpgradeClusterFromTrial());

    result.current.mutate({ clusterID, params: mutateData, region });

    await waitFor(() => {
      expect(mockedUpgradeClusterFromTrial).toHaveBeenCalled();
    });
    expect(mockGetClusterServiceForRegion).toHaveBeenCalledWith(region);
    expect(mockedUpgradeClusterFromTrial).toHaveBeenCalledWith(clusterID, mutateData);
  });
});
