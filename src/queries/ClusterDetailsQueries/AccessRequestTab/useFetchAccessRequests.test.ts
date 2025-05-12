import type axios from 'axios';
import * as reactRedux from 'react-redux';

import { useGlobalState } from '~/redux/hooks';
import apiRequest from '~/services/apiRequest';
import { renderHook, waitFor } from '~/testUtils';
import { ViewOptions } from '~/types/types';

import { useFetchAccessRequests } from './useFetchAccessRequests';

const apiResponse = {
  total: 15,
};

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

const useGlobalStateMock = useGlobalState as jest.Mock;

describe('useFetchAccessRequests', () => {
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  useDispatchMock.mockReturnValue(mockedDispatch);

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    subscriptionId: 'mySubscriptionId',
    params: {
      currentPage: 1,
      pageSize: 20,
      sorting: { sortField: 'mySortField', isAscending: true },
    },
    isAccessProtectionLoading: false,
    accessProtection: { enabled: true },
  };

  it('does not make an api call if isAccessProtection is loading', async () => {
    apiRequestMock.get.mockResolvedValueOnce({ data: apiResponse });
    useGlobalStateMock.mockReturnValue({ totalCount: 10 });

    const newProps = { ...defaultProps, isAccessProtectionLoading: true };
    const { result } = renderHook(() =>
      useFetchAccessRequests(
        newProps.subscriptionId,
        newProps.params as ViewOptions,
        newProps.isAccessProtectionLoading,
        newProps.accessProtection,
      ),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
    });

    expect(apiRequestMock).not.toHaveBeenCalled();
  });

  it('does not make an api call if accessProtection is not enabled', async () => {
    apiRequestMock.get.mockResolvedValueOnce({ data: apiResponse });
    useGlobalStateMock.mockReturnValue({ totalCount: 10 });

    const newProps = { ...defaultProps, accessProtection: { enabled: false } };
    const { result } = renderHook(() =>
      useFetchAccessRequests(
        newProps.subscriptionId,
        newProps.params as ViewOptions,
        newProps.isAccessProtectionLoading,
        newProps.accessProtection,
      ),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
    });

    expect(apiRequestMock).not.toHaveBeenCalled();
  });

  it('makes expected api call and calls dispatch if count changes', async () => {
    apiRequestMock.get.mockResolvedValueOnce({ data: apiResponse });
    useGlobalStateMock.mockReturnValue({ totalCount: 10 });

    // Ensure that the counts are different
    expect(apiResponse.total).not.toEqual(10);

    const { result } = renderHook(() =>
      useFetchAccessRequests(
        defaultProps.subscriptionId,
        defaultProps.params as ViewOptions,
        defaultProps.isAccessProtectionLoading,
        defaultProps.accessProtection,
      ),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
    });

    expect(result.current).toEqual({
      data: { total: apiResponse.total },
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    });

    // API is called
    expect(apiRequestMock.get).toHaveBeenCalledTimes(1);
    expect(apiRequestMock.get).toHaveBeenLastCalledWith(
      '/api/access_transparency/v1/access_requests',
      {
        params: {
          page: 1,
          size: 20,
          search: "subscription_id='mySubscriptionId'",
          orderBy: 'mySortField asc',
        },
      },
    );
    // Dispatch is called to set total in Redux
    expect(mockedDispatch).toHaveBeenCalledTimes(1);
    expect(mockedDispatch).toHaveBeenLastCalledWith({
      type: 'SET_TOTAL_ITEMS',
      payload: { viewType: 'ACCESS_REQUESTS_VIEW', totalCount: apiResponse.total },
      meta: undefined,
      error: undefined,
    });
  });

  it('makes expected api call and does not call dispatch if count is the same', async () => {
    apiRequestMock.get.mockResolvedValueOnce({ data: apiResponse });
    useGlobalStateMock.mockReturnValue({ totalCount: apiResponse.total });

    const { result } = renderHook(() =>
      useFetchAccessRequests(
        defaultProps.subscriptionId,
        defaultProps.params as ViewOptions,
        defaultProps.isAccessProtectionLoading,
        defaultProps.accessProtection,
      ),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
    });

    expect(result.current).toEqual({
      data: { total: apiResponse.total },
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    });

    // API is called
    expect(apiRequestMock.get).toHaveBeenCalledTimes(1);
    expect(apiRequestMock.get).toHaveBeenLastCalledWith(
      '/api/access_transparency/v1/access_requests',
      {
        params: {
          page: 1,
          size: 20,
          search: "subscription_id='mySubscriptionId'",
          orderBy: 'mySortField asc',
        },
      },
    );

    expect(mockedDispatch).not.toHaveBeenCalled();
  });
});
