import type axios from 'axios';

import apiRequest from '~/services/apiRequest';
import { renderHook, waitFor } from '~/testUtils';

import { useEditSubscription } from './useEditSubscription';

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

describe('useEditSubscription', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls api when mutate function is activated', async () => {
    apiRequestMock.patch.mockResolvedValueOnce({
      data: {},
    });

    const { result } = renderHook(() => useEditSubscription());

    result.current.mutate({
      subscriptionID: 'mySubscriptionId',
      data: { display_name: 'myNewDisplayName' },
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
