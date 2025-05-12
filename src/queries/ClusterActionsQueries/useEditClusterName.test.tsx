import type axios from 'axios';

import apiRequest from '~/services/apiRequest';
import { renderHook, waitFor } from '~/testUtils';

import { useEditClusterName } from './useEditClusterName';

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

describe('useEditClusterName', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls api when mutate function is activated', async () => {
    apiRequestMock.patch.mockResolvedValueOnce({
      data: {},
    });

    const { result } = renderHook(() => useEditClusterName());

    result.current.mutate({
      subscriptionID: 'mySubscriptionId',
      displayName: 'myNewDisplayName',
    });

    await waitFor(() => {
      expect(apiRequestMock.patch).toHaveBeenCalled();
    });
    expect(apiRequestMock.patch).toHaveBeenCalledWith(
      '/api/accounts_mgmt/v1/subscriptions/mySubscriptionId',
      { display_name: 'myNewDisplayName' },
    );
  });
});
