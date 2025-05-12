import { useQuery } from '@tanstack/react-query';

import accessProtectionService from '~/services/accessTransparency/accessProtectionService';

import { queryConstants } from '../queriesConstants';

export const useGetAccessProtection = (
  params: {
    subscriptionId?: string;
    organizationId?: string;
    clusterId?: string;
  },
  isRestrictedEnv?: boolean,
) => {
  const queryKey = [queryConstants.FETCH_ACCESS_TRANSPARENCY, 'access protection'];
  if (params.subscriptionId) {
    queryKey.push(params.subscriptionId);
  }
  if (params.clusterId) {
    queryKey.push(params.clusterId);
  }
  if (params.clusterId) {
    queryKey.push(params.clusterId);
  }

  const { isLoading, isPending, isFetched, refetch, data } = useQuery({
    queryKey,
    enabled:
      !isRestrictedEnv &&
      (!!params.subscriptionId || !!params.organizationId || !!params.clusterId),
    queryFn: () => accessProtectionService.getAccessProtection(params),
  });

  return { isLoading, isPending, isFetched, refetch, enabled: data?.data.enabled };
};
