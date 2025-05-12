import * as clusterService from '~/services/clusterService';
import { renderHook, waitFor } from '~/testUtils';

import { useFetchHtpasswdUsers } from './useFetchHtpasswdUsers';

const mockGetClusterServiceForRegion = jest.spyOn(clusterService, 'getClusterServiceForRegion');
const mockedGetHtpasswdUsers = jest.fn();

const htpasswdUsers = {
  items: [
    {
      id: 'user1-id',
      username: 'user1-name',
    },
    {
      id: 'user2-id',
      username: 'user2-name',
    },
  ],
};

describe('useFetchHtpasswdUsers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('returns htpasswd users from api', async () => {
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({ getHtpasswdUsers: mockedGetHtpasswdUsers });
    mockedGetHtpasswdUsers.mockResolvedValue({ data: htpasswdUsers });

    const { result } = renderHook(() => useFetchHtpasswdUsers('myClusterId', 'myIdpID'));

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(mockGetClusterServiceForRegion).toHaveBeenCalledWith(undefined);

    const { users, isError } = result.current;
    expect(users).toEqual(htpasswdUsers.items);
    expect(isError).toBeFalsy();
  });

  it('calls regionalized endpoint if region is passed', async () => {
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({ getHtpasswdUsers: mockedGetHtpasswdUsers });
    mockedGetHtpasswdUsers.mockResolvedValue({ data: htpasswdUsers });

    const { result } = renderHook(() =>
      useFetchHtpasswdUsers('myClusterId', 'myIdpID', 'myRegion'),
    );

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(mockGetClusterServiceForRegion).toHaveBeenCalledWith('myRegion');
    const { users, isError } = result.current;
    expect(users).toEqual(htpasswdUsers.items);
    expect(isError).toBeFalsy();
  });

  it('returns  error if an error is returned when fetching users', async () => {
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({ getHtpasswdUsers: mockedGetHtpasswdUsers });
    mockedGetHtpasswdUsers.mockRejectedValue({
      name: 403,
      message: 'No data',
    });
    const { result } = renderHook(() =>
      useFetchHtpasswdUsers('myClusterId', 'myIdpID', 'myRegion'),
    );

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    const { users, isError, error } = result.current;

    expect(isError).toBeTruthy();
    expect(users).toEqual([]);
    expect(error).toEqual({
      name: 403,
      message: 'No data',
    });
    console.log(result.current);
  });
});
