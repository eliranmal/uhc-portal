import axios from 'axios';

import { waitFor } from '@testing-library/react';

import apiRequest from '~/services/apiRequest';
import { renderHook } from '~/testUtils';
import { ViewOptions } from '~/types/types';

import { mockedClusterLogs } from '../__mocks__/queryMockedData';

import { useFetchClusterLogs } from './useFetchClusterLogs';

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

describe('useFetchClusterLogs hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockedClusterLogsViewOptions: ViewOptions = {
    currentPage: 2,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    filter: {
      description: '',
      loggedBy: '',
      timestampFrom: ">= '2024-05-01T00:00:00.000Z'",
      timestampTo: "<= '2024-09-17T23:59:59.999Z'",
    },
    sorting: {
      isAscending: false,
      sortField: 'timestamp',
      sortIndex: 5,
    },
    flags: {
      conditionalFilterFlags: {
        severityTypes: [],
        logTypes: [],
      },
    },
  };

  it('Get useFetchClusterLogs valid response', async () => {
    const clusterID = '2a4tguaod170v2-mock';
    const clusterUUID = '7d72f3d1-17cc-495-mock';

    // Mock the network request using axios
    apiRequestMock.get.mockResolvedValueOnce({ data: mockedClusterLogs });

    const { result } = renderHook(() =>
      useFetchClusterLogs(clusterID, clusterUUID, mockedClusterLogsViewOptions),
    );

    // Initial pending state
    expect(apiRequest.get).toHaveBeenCalledTimes(1);
    expect(result.current.isPending).toBe(true);
    expect(result.current.data).toBe(undefined);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBe(null);

    // Assert results
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data?.kind).toEqual(mockedClusterLogs.kind);
  });

  it('Get useGetClusterDetails error response', async () => {
    const clusterID = '2a4tguaod170v2-mock';
    const clusterUUID = '7d72f3d1-17cc-495-mock';

    // Mock the network request to simulate an error
    apiRequestMock.get.mockRejectedValueOnce({
      name: 403,
      message: 'Cluster logs do not exist',
    });

    // Render the hook
    const { result } = renderHook(() =>
      useFetchClusterLogs(clusterID, clusterUUID, mockedClusterLogsViewOptions),
    );

    // Initial pending state
    expect(result.current.isPending).toBe(true);
    expect(result.current.data).toBe(undefined);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBe(null);

    // Assert results
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
    expect(result.current.data).toBe(undefined);
    expect(result.current.isError).toBe(true);
    expect(result.current.error?.name).toEqual(403);
    expect(result.current.error?.message).toEqual('Cluster logs do not exist');
  });
});
