import { useMutation } from '@tanstack/react-query';

import { accountsService } from '~/services';

import { formatErrorData } from '../helpers';

export const useToggleSubscriptionReleased = () => {
  const { data, isPending, isError, error, mutate, isSuccess } = useMutation({
    mutationKey: ['toggleSubscriptionReleased'],
    mutationFn: ({ subscriptionID, released }: { subscriptionID: string; released?: boolean }) =>
      accountsService.editSubscription(subscriptionID, { released }),
  });

  return {
    data,
    isPending,
    isError,
    error: isError ? formatErrorData(isPending, isError, error) : error,
    mutate,
    isSuccess,
  };
};
