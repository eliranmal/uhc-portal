import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import { accountsService } from '~/services';

export const useDeleteOCMRole = (subID: string = '') => {
  const { data, isPending, isError, error, isSuccess, mutate } = useMutation({
    mutationKey: ['deleteOCMRole'],
    mutationFn: async (roleBindingID: string) => {
      const response = accountsService.deleteSubscriptionRoleBinding(subID, roleBindingID);
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
    };
  }

  return {
    data,
    isPending,
    isError,
    error,
    isSuccess,
    mutate,
  };
};
