import type axios from 'axios';

import apiRequest from '~/services/apiRequest';
import { renderHook, waitFor } from '~/testUtils';

import { useGetOrganizationalPendingRequests } from './useGetOrganizationalPendingRequests';

const apiResponse = {
  total: 3,
  items: [{ id: 'myRequest1' }, { id: 'myRequest2' }, { id: 'myRequest3' }],
};

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

describe('useGetOrganizationalPendingRequests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns expected data', async () => {
    apiRequestMock.get.mockResolvedValueOnce({ data: apiResponse });

    const { result } = renderHook(() =>
      useGetOrganizationalPendingRequests('myOrgId', true, { page: 2, size: 15 }),
    );

    await waitFor(() => {
      expect(result.current.total).not.toBeUndefined();
    });

    expect(result.current.total).toEqual(apiResponse.total);
    expect(result.current.items).toEqual(apiResponse.items);

    const expectedParams = {
      params: {
        page: 2,
        search: "organization_id='myOrgId' and status.state='Pending'",
        size: 15,
      },
    };

    expect(apiRequestMock.get.mock.calls[0][1]).toEqual(expectedParams);
  });

  it('does not make API call if isOrganizationAccessProtectionEnabled is false', async () => {
    apiRequestMock.get.mockResolvedValueOnce({ data: apiResponse });

    const { result } = renderHook(() =>
      useGetOrganizationalPendingRequests('myOrgId', false, { page: 2, size: 15 }),
    );

    await waitFor(() => {
      expect(result.current.isLoading).not.toBeUndefined();
    });

    expect(result.current.isFetched).toBeFalsy();
    expect(result.current.enabled).toBeUndefined();
    expect(result.current.isPending).toBeTruthy();

    expect(apiRequestMock.get).not.toHaveBeenCalled();
  });

  it('does not make API call if  organization id is unknown', async () => {
    apiRequestMock.get.mockResolvedValueOnce({ data: apiResponse });

    const { result } = renderHook(() =>
      // @ts-ignore
      useGetOrganizationalPendingRequests(undefined, true, { page: 2, size: 15 }),
    );

    await waitFor(() => {
      expect(result.current.isLoading).not.toBeUndefined();
    });

    expect(result.current.isFetched).toBeFalsy();
    expect(result.current.enabled).toBeUndefined();
    expect(result.current.isPending).toBeTruthy();

    expect(apiRequestMock.get).not.toHaveBeenCalled();
  });

  it('makes API call with page and size unknown', async () => {
    apiRequestMock.get.mockResolvedValueOnce({ data: apiResponse });

    const { result } = renderHook(() =>
      useGetOrganizationalPendingRequests('myOrgId', true, { page: 2, size: 15 }),
    );

    await waitFor(() => {
      expect(result.current.total).not.toBeUndefined();
    });

    expect(result.current.total).toEqual(apiResponse.total);
    expect(result.current.items).toEqual(apiResponse.items);

    const expectedParams = {
      params: {
        page: 2,
        search: "organization_id='myOrgId' and status.state='Pending'",
        size: 15,
      },
    };

    expect(apiRequestMock.get.mock.calls[0][1]).toEqual(expectedParams);
  });
});
