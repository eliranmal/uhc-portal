import type axios from 'axios';

import apiRequest from '~/services/apiRequest';
import { renderHook, waitFor } from '~/testUtils';

import { useFetchSubscriptions } from './useFetchSubscriptions';

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

const subscriptions = [
  {
    cluster_id: 'myClusterId-ai-1',
    id: 'mySubscriptionId-ai-1',
    plan: { id: 'OCP-AssistedInstall' },
  },
  {
    cluster_id: 'myClusterId-ai-2',
    id: 'mySubscriptionId-ai-2',
    plan: { id: 'OCP-AssistedInstall' },
  },
  {
    cluster_id: 'myClusterId-managed-1',
    id: 'mySubscriptionId-managed-1',
    managed: true,
    status: 'Active',
    plan: {
      id: 'MOA',
      type: 'MOA',
    },
  },
  {
    cluster_id: 'myClusterId-managed-2',
    id: 'mySubscriptionId-managed-2',
    managed: true,
    status: 'Active',
    plan: { id: 'OSD', type: 'OSD' },
  },
  {
    cluster_id: 'myClusterId-managed-deprovisioned',
    id: 'mySubscriptionId-managed-deprovisioned',
    managed: true,
    status: 'Deprovisioned',
    plan: {
      id: 'MOA',
      type: 'MOA',
    },
  },
];

describe('useFetchSubscriptions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const viewOptions = {
    currentPage: 1,
    pageSize: 10,
    totalCount: 1,
    totalPages: 1,
    filter: 'myCluster',
    sorting: {
      sortField: 'display_name',
      isAscending: false,
      sortIndex: 0,
    },
    flags: {
      showArchived: false,
      showMyClustersOnly: false,
      subscriptionFilter: {
        plan_id: ['ROSA'],
      },
    },
  };

  it('sends correct viewOptions to subscriptions api', async () => {
    apiRequestMock.get.mockResolvedValueOnce({
      data: { items: subscriptions, page: 1, size: 10, total: 20 },
    });
    const { result } = renderHook(() =>
      useFetchSubscriptions({
        enabled: true,
        viewOptions,
        userName: 'myUserName',
      }),
    );
    await waitFor(() => {
      expect(result.current.data).not.toBeUndefined();
    });
    const params = apiRequestMock.get.mock.calls[0][1]?.params;

    const expectedParams = {
      page: 1,
      size: 10,
      orderBy: 'display_name desc',
      search:
        "(cluster_id!='') AND (plan.id IN ('OSD', 'OSDTrial', 'OCP', 'RHMI', 'ROSA', 'RHOIC', 'MOA', 'MOA-HostedControlPlane', 'ROSA-HyperShift', 'ARO', 'OCP-AssistedInstall')) AND (status NOT IN ('Deprovisioned', 'Archived')) AND (display_name ILIKE '%myCluster%' OR external_cluster_id ILIKE '%myCluster%' OR cluster_id ILIKE '%myCluster%') AND (plan_id IN ('MOA','ROSA','MOA-HostedControlPlane'))",
      fields: undefined,
      fetchAccounts: true,
      fetchCapabilities: true,
    };
    expect(params).toEqual(expectedParams);
  });

  it('returns number of clusters when total is reporting 0 (workaround for OCM-12366)', async () => {
    apiRequestMock.get.mockResolvedValueOnce({
      data: { items: subscriptions, page: 1, size: 10, total: 0 },
    });
    const { result } = renderHook(() =>
      useFetchSubscriptions({
        enabled: true,
        viewOptions,
        userName: 'myUserName',
      }),
    );
    await waitFor(() => {
      expect(result.current.data).not.toBeUndefined();
    });
    expect(result.current.data.total).toEqual(subscriptions.length);
  });

  it('returns expected data', async () => {
    apiRequestMock.get.mockResolvedValueOnce({
      data: { items: subscriptions, page: 1, size: 10, total: 20 },
    });

    const { result } = renderHook(() =>
      useFetchSubscriptions({
        enabled: true,
        viewOptions,
        userName: 'myUserName',
      }),
    );
    await waitFor(() => {
      expect(result.current.data).not.toBeUndefined();
    });

    const { subscriptionIds, subscriptionMap, managedSubscriptions } = result.current.data;

    expect(subscriptionIds).toEqual(['mySubscriptionId-ai-1', 'mySubscriptionId-ai-2']);

    expect(subscriptionMap.size).toEqual(5);

    expect(managedSubscriptions).toEqual([
      {
        cluster_id: 'myClusterId-managed-1',
        id: 'mySubscriptionId-managed-1',
        managed: true,
        status: 'Active',
        plan: { id: 'ROSA', type: 'ROSA' },
      },
      {
        cluster_id: 'myClusterId-managed-2',
        id: 'mySubscriptionId-managed-2',
        managed: true,
        status: 'Active',
        plan: { id: 'OSD', type: 'OSD' },
      },
    ]);
  });

  it('returns an error if API calls fail', async () => {
    const errorResp = {
      kind: 'Error',
      operation_id: 'abcdef',
      reason: 'There was a random error',
    };

    apiRequestMock.get.mockRejectedValueOnce({ status: 403, response: { data: errorResp } });

    const { result } = renderHook(() =>
      useFetchSubscriptions({
        enabled: true,
        viewOptions,
        userName: 'myUserName',
      }),
    );
    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    const { error, isError, isLoading, isFetched } = result.current;

    expect(isError).toBeTruthy();
    expect(isLoading).toBeFalsy();
    expect(isFetched).toBeTruthy();

    expect(error).toEqual({ status: 403, response: { data: errorResp } });
  });
});
