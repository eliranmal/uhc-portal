import { AxiosResponse } from 'axios';

import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { queryConstants } from '~/queries/queriesConstants';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';
import { UpgradePolicyState } from '~/types/clusters_mgmt.v1';

export const refetchSchedules = () => {
  queryClient.invalidateQueries({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'getSchedules'],
  });
};

export const useGetSchedules = (clusterID: string, isHypershift: boolean, region?: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'getSchedules'],
    queryFn: async () => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = isHypershift
          ? await clusterService.getControlPlaneUpgradeSchedules(clusterID)
          : await clusterService.getUpgradeSchedules(clusterID).then(async (schedulesResponse) => {
              const items = schedulesResponse.data.items || [];
              const promises: Promise<void | AxiosResponse<UpgradePolicyState>>[] = [];
              items.forEach((schedule) => {
                if (schedule.cluster_id && schedule.id) {
                  promises.push(
                    clusterService
                      .getUpgradeScheduleState(schedule.cluster_id, schedule.id)
                      .then((stateResponse) => {
                        // TODO: schedule.state does not exist on UpgradePolicy
                        // eslint-disable-next-line no-param-reassign
                        (schedule as any).state = stateResponse.data;
                      }),
                  );
                }
              });
              return Promise.all(promises).then(() => {
                // eslint-disable-next-line no-param-reassign
                schedulesResponse.data.items = items;
                return schedulesResponse;
              });
            });

        return response;
      }

      const response = isHypershift
        ? clusterService.getControlPlaneUpgradeSchedules(clusterID)
        : clusterService.getUpgradeSchedules(clusterID).then(async (schedulesResponse) => {
            const items = schedulesResponse.data.items || [];
            const promises: Promise<void | AxiosResponse<UpgradePolicyState>>[] = [];
            items.forEach((schedule) => {
              if (schedule.cluster_id && schedule.id) {
                promises.push(
                  clusterService
                    .getUpgradeScheduleState(schedule.cluster_id, schedule.id)
                    .then((stateResponse) => {
                      // TODO: schedule.state does not exist on UpgradePolicy
                      // eslint-disable-next-line no-param-reassign
                      (schedule as any).state = stateResponse.data;
                    }),
                );
              }
            });
            return Promise.all(promises).then(() => {
              // eslint-disable-next-line no-param-reassign
              schedulesResponse.data.items = items;
              return schedulesResponse;
            });
          });

      return response;
    },

    enabled: !!clusterID,
  });

  return {
    data: data?.data,
    isLoading,
    isError,
    error,
  };
};
