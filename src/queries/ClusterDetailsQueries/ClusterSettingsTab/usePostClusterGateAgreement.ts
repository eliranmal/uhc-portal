import { useDispatch } from 'react-redux';

import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import { setClusterUpgradeGate } from '~/redux/actions/upgradeGateActions';
import clusterService, { getClusterServiceForRegion } from '~/services/clusterService';

export const usePostClusterGateAgreementAcknowledgeModal = (clusterId: string, region?: string) => {
  const dispatch = useDispatch();
  return useMutation({
    mutationKey: ['[pstClusterGateAgreement'],
    mutationFn: async (gateIDs: string[]) => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const promises = gateIDs.map(async (id) => {
          const response = await clusterService
            .postClusterGateAgreement(clusterId, id)
            .then(() => dispatch(setClusterUpgradeGate(id)));
          return response;
        });
        const responses = await Promise.all(
          promises.map((promise) =>
            promise
              .then((value) => ({ status: 'fulfilled', value }))
              .catch((reason) => ({ status: 'rejected', reason })),
          ),
        );
        return responses;
      }
      const promises = gateIDs.map(async (id) => {
        const response = await clusterService
          .postClusterGateAgreement(clusterId, id)
          .then(() => dispatch(setClusterUpgradeGate(id)));
        return response;
      });
      const responses = await Promise.all(
        promises.map((promise) =>
          promise
            .then((value) => ({ status: 'fulfilled', value }))
            .catch((reason) => ({ status: 'rejected', reason })),
        ),
      );
      return responses;
    },
  });
};

export const usePostClusterGateAgreement = (clusterID: string, region?: string) => {
  const dispatch = useDispatch();
  const { data, isPending, isError, error, mutate, mutateAsync } = useMutation({
    mutationKey: ['postClusterGateAgreement'],
    mutationFn: async (gateID: string) => {
      if (region) {
        const clusterService = getClusterServiceForRegion(region);
        const response = clusterService.postClusterGateAgreement(clusterID, gateID);
        return response;
      }

      const response = clusterService.postClusterGateAgreement(clusterID, gateID);
      return response;
    },
    onSuccess: (data) => {
      if (data.data.id) {
        dispatch(setClusterUpgradeGate(data.data.id));
      }
    },
    onError: (e) => Promise.reject(e),
  });

  if (isError) {
    const formattedError = formatErrorData(isPending, isError, error);
    return {
      data,
      isPending,
      isError,
      error: formattedError.error,
      mutate,
      mutateAsync,
    };
  }

  return {
    data,
    isPending,
    isError,
    error,
    mutate,
    mutateAsync,
  };
};
