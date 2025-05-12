import { useMutation } from '@tanstack/react-query';

import { getClusterServiceForRegion } from '~/services/clusterService';

import { useEditSubscription } from '../common/useEditSubscription';
import { formatErrorData } from '../helpers';

export const useEditConsoleURL = () => {
  const {
    mutate: mutateSubscription,
    isSuccess: isSubscriptionSuccess,
    rawError: subscriptionError,
    isError: isSubscriptionError,
    isPending: isSubscriptionPending,
    reset: subscriptionReset,
  } = useEditSubscription();
  const {
    isSuccess: isClusterSuccess,
    error: clusterError,
    isError: isClusterError,
    isPending: isClusterPending,
    mutate: clusterMutate,
    reset: clusterReset,
  } = useMutation({
    mutationKey: ['accountService', 'clusterService', 'edit_cluster_url'],
    mutationFn: ({
      subscriptionID,
      clusterID,
      consoleUrl,
      region,
    }: {
      subscriptionID: string;
      clusterID: string;
      consoleUrl: string;
      region?: string;
    }) => {
      const clusterService = getClusterServiceForRegion(region);

      let sanitizedURL = consoleUrl;
      if (consoleUrl.endsWith('/')) {
        sanitizedURL = consoleUrl.substring(0, consoleUrl.length - 1);
      }

      return clusterService
        .editCluster(clusterID, { console: { url: sanitizedURL } })
        .then(() => mutateSubscription({ subscriptionID, data: { console_url: sanitizedURL } }));
    },
  });

  const isError = isClusterError || isSubscriptionError;
  const isPending = isClusterPending || isSubscriptionPending;
  const error = clusterError || subscriptionError;

  return {
    isSuccess: isClusterSuccess && isSubscriptionSuccess,
    error: isError && error ? formatErrorData(isPending, isError, error)?.error : null,
    isError,
    isPending,
    mutate: clusterMutate,
    reset: () => {
      clusterReset();
      subscriptionReset();
    },
  };
};
