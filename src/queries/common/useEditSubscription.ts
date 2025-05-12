import { useMutation } from '@tanstack/react-query';

import accountsService from '~/services/accountsService';

import { formatErrorData } from '../helpers';

export const useEditSubscription = () => {
  const { isSuccess, error, isError, isPending, mutate, reset } = useMutation({
    mutationKey: ['accountService', 'editSubscription'],
    mutationFn: ({ subscriptionID, data }: { subscriptionID: string; data: any }) =>
      accountsService.editSubscription(subscriptionID, data),
  });

  return {
    isSuccess,
    rawError: error,
    error: isError && error ? formatErrorData(isPending, isError, error)?.error : null,
    isError,
    isPending,
    mutate,
    reset,
  };
};
