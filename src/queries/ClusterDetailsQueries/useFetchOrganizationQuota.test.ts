import axios from 'axios';

import { waitFor } from '@testing-library/react';

import apiRequest from '~/services/apiRequest';
import { renderHook } from '~/testUtils';

import { mockSubscriptionAxiosResponse } from '../__mocks__/queryMockedData';
import { formatErrorData } from '../helpers';

import { useFetchOrganizationQuota } from './useFetchOrganizationQuota';

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;
jest.mock('../helpers', () => ({
  formatErrorData: jest.fn(),
}));

describe('useFetchOrganizationQuota hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Get useFetchOrganizationQuota valid response', async () => {
    const orgID = 'your-org-id';

    // Mock the network request using axios
    apiRequestMock.get.mockResolvedValueOnce({ data: mockSubscriptionAxiosResponse });
    // Render the hook
    const { result } = renderHook(() => useFetchOrganizationQuota(orgID));

    // Initial loading state
    expect(apiRequest.get).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(undefined);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBe(null);

    // Assert results
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('Get useFetchOrganizationQuota network error response', async () => {
    const orgID = 'your-org-id';

    // Mock the network request to simulate an error
    apiRequestMock.get.mockRejectedValueOnce({
      name: 403,
      message: 'Account with ID 123456 denied access to perform get on Subscription with HTTP',
    });

    (formatErrorData as jest.Mock).mockImplementation(() => 'mocked Error message');
    // Render the hook
    const { result } = renderHook(() => useFetchOrganizationQuota(orgID));

    // Initial loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(undefined);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBe(null);

    // Assert results
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.data).toBe(undefined);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe('mocked Error message');
  });
});
