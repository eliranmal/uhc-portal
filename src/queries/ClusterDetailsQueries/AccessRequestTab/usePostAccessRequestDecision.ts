import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { formatErrorData } from '~/queries/helpers';
import { queryConstants } from '~/queries/queriesConstants';
import { authorizationsService } from '~/services';
import accessRequestService from '~/services/accessTransparency/accessRequestService';
import { Decision } from '~/types/access_transparency.v1';
import {
  SelfAccessReviewAction,
  SelfAccessReviewResource_type as SelfAccessReviewResourceType,
} from '~/types/accounts_mgmt.v1';

export const usePostAccessRequestDecision = (accessRequestID: string) => {
  const { data, isPending, isError, error, mutate, isSuccess } = useMutation({
    mutationKey: ['postAccessrequestDecision'],
    mutationFn: async (decision: Decision) => {
      const response = await accessRequestService.postAccessRequestDecision(
        accessRequestID,
        decision,
      );
      return response;
    },
  });

  return {
    data: data?.data,
    isPending,
    isError,
    error: isError ? formatErrorData(isPending, isError, error) : error,
    mutate,
    isSuccess,
  };
};

export const refetchCanMakeDecicision = () => {
  queryClient.invalidateQueries({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'canMakeDecision'],
  });
};

export const useCanMakeDecision = (
  subscriptionId: string,
  organizationId: string,
  isEditMode: boolean,
) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: [queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY, 'canMakeDecision'],
    queryFn: async () => {
      const response = await authorizationsService.selfAccessReview({
        action: SelfAccessReviewAction.create,
        resource_type: SelfAccessReviewResourceType.AccessRequestDecision,
        subscription_id: subscriptionId,
        organization_id: organizationId,
      });

      return response;
    },
    enabled: isEditMode,
  });

  return {
    data: data?.data,
    isLoading,
    isError,
    error: isError ? formatErrorData(isLoading, isError, error) : error,
    isSuccess,
  };
};
