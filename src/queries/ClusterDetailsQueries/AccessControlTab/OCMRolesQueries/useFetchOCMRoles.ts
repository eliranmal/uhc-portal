import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { formatErrorData } from '~/queries/helpers';
import { accountsService } from '~/services';

export const refetchOcmRoles = () => {
  queryClient.resetQueries({ queryKey: ['fetchOCMRoles'] });
};

export const useFetchOCMRoles = (
  canViewOCMRoles: boolean,
  canEditOCMRoles: boolean,
  subID: string = '',
) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ['fetchOCMRoles'],
    queryFn: async () => {
      const response = await accountsService.getSubscriptionRoleBindings(subID);
      return response;
    },
    enabled: !!subID && (canViewOCMRoles || canEditOCMRoles),
  });

  if (isError) {
    const formattedError = formatErrorData(isLoading, isError, error);

    return {
      data: data?.data,
      isLoading,
      isError,
      error: formattedError,
      isSuccess,
    };
  }

  return {
    data: data?.data,
    isLoading,
    isError,
    error,
    isSuccess,
  };
};
