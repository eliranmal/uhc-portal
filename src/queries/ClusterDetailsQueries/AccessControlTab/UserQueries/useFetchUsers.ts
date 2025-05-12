import { get } from 'lodash';

import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { formatErrorData } from '~/queries/helpers';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';
import { User } from '~/types/clusters_mgmt.v1';

export const refetchUsers = () => {
  queryClient.refetchQueries({ queryKey: ['fetchUsers'] });
};

export const useFetchUsers = (clusterID: string, region?: string) => {
  const { data, isLoading, isError, error, isSuccess, isRefetching } = useQuery({
    queryKey: ['fetchUsers'],
    queryFn: async () => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const responseData = clusterService.getClusterGroupUsers(clusterID).then((res) => {
          let items = [];
          items = get(res, 'data.items', []).map((g) => {
            const group: any = g;
            if (group.users) {
              // cluster-admin user is meant for internal use and is not exposed to users
              group.users.items = get(group, 'users.items', []).filter(
                (user: User) => user.id !== 'cluster-admin',
              );
            }
            return group;
          });

          const users: any = [];
          items.forEach((group) =>
            get(group, 'users.items', []).forEach((user: User) =>
              users.push({ ...user, group: group.id }),
            ),
          );

          return users;
        });

        return responseData;
      }
      const responseData = clusterService.getClusterGroupUsers(clusterID).then((res) => {
        let items = [];
        items = get(res, 'data.items', []).map((g) => {
          const group: any = g;
          if (group.users) {
            // cluster-admin user is meant for internal use and is not exposed to users
            group.users.items = get(group, 'users.items', []).filter(
              (user: User) => user.id !== 'cluster-admin',
            );
          }
          return group;
        });

        const users: any = [];
        items.forEach((group) =>
          get(group, 'users.items', []).forEach((user: User) =>
            users.push({ ...user, group: group.id }),
          ),
        );

        return users;
      });

      return responseData;
    },
  });

  if (isError) {
    const formattedError = formatErrorData(isLoading, isError, error);
    return {
      data: {
        users: data,
        clusterID,
      },
      isLoading,
      isError,
      error: formattedError,
      isSuccess,
      isRefetching,
    };
  }

  return {
    data: {
      users: data,
      clusterID,
    },
    isLoading,
    isError,
    error,
    isSuccess,
    isRefetching,
  };
};
