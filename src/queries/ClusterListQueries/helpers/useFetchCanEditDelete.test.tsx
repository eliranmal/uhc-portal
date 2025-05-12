import type axios from 'axios';

import apiRequest from '~/services/apiRequest';
import { renderHook, waitFor } from '~/testUtils';

import { useFetchCanEditDelete } from './useFetchCanEditDelete';

const apiCanEditResponse = {
  action: 'update',
  cluster_ids: ['myUpdateClusterId-1', 'myUpdateClusterId-2', 'myUpdateClusterId-3'],
  cluster_uuids: ['myUpdateClusterUuid-1', ''],
  organization_ids: ['myUpdateOrdId'],
  resource_type: 'Cluster',
  subscription_ids: ['myUpdateClusterSubscription-1'],
};

const apiCanDeleteResponse = {
  action: 'delete',
  cluster_ids: ['myDeleteClusterId-1', 'myDeleteClusterId-2', 'myDeleteClusterId-3'],
  cluster_uuids: ['myDeleteClusterUuid-1', ''],
  organization_ids: ['myDeleteOrdId'],
  resource_type: 'Cluster',
  subscription_ids: ['myUpdateDeleteSubscription-1'],
};

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

describe('useFetchCanEditDelete', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns canEdit and canDelete in expected format', async () => {
    apiRequestMock.post.mockResolvedValueOnce({ data: apiCanDeleteResponse });
    apiRequestMock.post.mockResolvedValueOnce({ data: apiCanEditResponse });
    const { result } = renderHook(() => useFetchCanEditDelete({}));

    await waitFor(() => {
      expect(result.current.canDelete).not.toBeUndefined();
    });
    await waitFor(() => {
      expect(result.current.canEdit).not.toBeUndefined();
    });

    // Ensure the calls are in the same order as the mock
    expect(apiRequestMock.post.mock.calls).toHaveLength(2);
    expect(apiRequestMock.post.mock.calls[0]).toEqual([
      '/api/authorizations/v1/self_resource_review',
      { action: 'delete', resource_type: 'Cluster' },
    ]);
    expect(apiRequestMock.post.mock.calls[1]).toEqual([
      '/api/authorizations/v1/self_resource_review',
      { action: 'update', resource_type: 'Cluster' },
    ]);

    // Verify responses
    expect(result.current.canDelete).toEqual({
      'myDeleteClusterId-1': true,
      'myDeleteClusterId-2': true,
      'myDeleteClusterId-3': true,
    });

    expect(result.current.canEdit).toEqual({
      'myUpdateClusterId-1': true,
      'myUpdateClusterId-2': true,
      'myUpdateClusterId-3': true,
    });
  });

  it('returns errors in expected format', async () => {
    const errorResp = {
      kind: 'Error',
      operation_id: 'abcdef',
      reason: 'There was a random error',
    };

    apiRequestMock.post.mockResolvedValueOnce({ data: apiCanDeleteResponse });
    // mocking canEdit call as an error
    apiRequestMock.post.mockRejectedValueOnce({ status: 403, response: { data: errorResp } });

    const { result } = renderHook(() => useFetchCanEditDelete({}));

    await waitFor(() => {
      expect(result.current.canDelete).not.toBeUndefined();
    });
    await waitFor(() => {
      expect(result.current.errors).not.toBeUndefined();
    });

    expect(result.current.errors).toEqual([
      {
        reason: 'There was a random error',
        operation_id: 'abcdef',
        region: undefined,
      },
    ]);
  });
});
