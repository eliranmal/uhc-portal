import React from 'react';

import { useQueries, UseQueryResult } from '@tanstack/react-query';

import { buildPermissionDict } from '~/redux/reduxHelpers';
import { authorizationsService } from '~/services';
import {
  SelfResourceReviewRequestAction,
  SelfResourceReviewRequestResource_type as SelfResourceReviewRequestResourceType,
} from '~/types/accounts_mgmt.v1';

import { queryConstants } from '../../queriesConstants';

import { ErrorResponse, formatClusterListError } from './createResponseForFetchCluster';

export type CanEditDelete = {
  [clusterID: string]: boolean;
};

export const useFetchCanEditDelete = ({
  queryKey = [queryConstants.FETCH_CLUSTERS_QUERY_KEY],
}: {
  queryKey?: string[];
}) => {
  const { isLoading, data, isError, isFetching, refetch, errors, isFetched } = useQueries({
    queries: [
      {
        queryKey: [
          ...queryKey,
          'authorizationsService',
          'selfResourceReview',
          SelfResourceReviewRequestAction.delete,
        ],
        queryFn: async () => {
          const response = await authorizationsService.selfResourceReview({
            action: SelfResourceReviewRequestAction.delete,
            resource_type: SelfResourceReviewRequestResourceType.Cluster,
          });

          return buildPermissionDict(response);
        },
      },
      {
        queryKey: [
          ...queryKey,
          'authorizationsService',
          'selfResourceReview',
          SelfResourceReviewRequestAction.update,
        ],
        queryFn: async () => {
          const response = await authorizationsService.selfResourceReview({
            action: SelfResourceReviewRequestAction.update,
            resource_type: SelfResourceReviewRequestResourceType.Cluster,
          });

          return buildPermissionDict(response);
        },
      },
    ],
    combine: React.useCallback((results: UseQueryResult[]) => {
      const [canDelete, canEdit] = results;

      const errors = [];

      const canEditError = formatClusterListError(canEdit as unknown as { error: ErrorResponse });
      const canDeleteError = formatClusterListError(
        canDelete as unknown as { error: ErrorResponse },
      );

      if (canEditError) {
        errors.push(canEditError);
      }
      if (canDeleteError) {
        errors.push(canDeleteError);
      }

      return {
        isFetched: results.every((result) => result.isFetched),
        isLoading: results.some((result) => result.isLoading),
        isFetching: results.some((result) => result.isFetching),
        data: {
          canEdit: canEdit.data as CanEditDelete,
          canDelete: canDelete.data as CanEditDelete,
        },
        isError: results.some((result) => result.isError),
        refetch: () => results.forEach((result) => result.refetch()),
        errors,
      };
    }, []),
  });

  return {
    isLoading,
    isFetching,
    canEdit: data?.canEdit,
    canDelete: data?.canDelete,
    isError,
    refetch,
    errors,
    isFetched,
  };
};
