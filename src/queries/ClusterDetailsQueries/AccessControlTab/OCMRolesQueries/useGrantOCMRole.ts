import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import { accountsService } from '~/services';

export const useGrantOCMRole = (subID: string = '') => {
  const { data, isPending, isError, error, isSuccess, mutate, reset } = useMutation({
    mutationKey: ['grantOCMRole'],
    mutationFn: async ({ username, roleID }: { username: string; roleID: string }) => {
      const response = accountsService.createSubscriptionRoleBinding(subID, username, roleID);
      return response;
    },
  });

  if (isError) {
    const formattedError = formatErrorData(isPending, isError, error);
    return {
      data,
      isPending,
      isError,
      error: formattedError,
      isSuccess,
      mutate,
      reset,
    };
  }

  return {
    data,
    isPending,
    isError,
    error,
    isSuccess,
    mutate,
    reset,
  };
};
