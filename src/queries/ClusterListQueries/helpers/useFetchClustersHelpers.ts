import React from 'react';
import { isEqual } from 'lodash';

import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { useGlobalState } from '~/redux/hooks';
import { SubscriptionCommonFieldsStatus } from '~/types/accounts_mgmt.v1';
import { ClusterWithPermissions, ViewOptions, ViewOptionsFilter } from '~/types/types';

import { queryConstants } from '../../queriesConstants';

import { CanEditDelete } from './useFetchCanEditDelete';

/**
 * Types
 */
export type FetchClusterQueryResults = UseQueryResult & {
  data?: {
    managedClusters?: any[];
    aiClusters?: any[];
  };
};

export type QueryKey = (string | number | ViewOptionsFilter)[];

/**
 * Creates the React Query key based on params
 */
export const createQueryKey = ({
  type,
  clusterTypeOrRegion,
  viewOptions,
  isArchived,
  other,
}: {
  type: 'subscriptions' | 'clusters';
  clusterTypeOrRegion?: string;
  viewOptions: ViewOptions;
  isArchived?: boolean;
  other?: string[];
}): QueryKey => {
  const { currentPage, pageSize, sorting, filter, flags } = viewOptions;

  const sortField = sorting?.sortField ? sorting.sortField : 'no_sort_field';
  const sortDirection = sorting?.isAscending ? 'asc' : 'desc';
  const nameFilter = filter || 'no_name_filter';
  const showMyClustersOnly = flags?.showMyClustersOnly ? 'only_my_clusters' : 'all_clusters';
  const plans: string[] = flags?.subscriptionFilter?.plan_id || [];

  const key: QueryKey = [
    queryConstants.FETCH_CLUSTERS_QUERY_KEY,
    isArchived ? 'Archived' : 'Active',
    type,
    clusterTypeOrRegion || '-',
    `${currentPage}`,
    `${pageSize}`,
    sortField,
    sortDirection,
    nameFilter,
    showMyClustersOnly,
    ...plans,
    ...(other || []),
  ];
  return key;
};

/**
 * Checks to see if a query already exists based on params
 * Used to determine if a new query needs to be created
 */

export const isExistingQuery = (queries: UseQueryOptions[], queryKey: QueryKey) =>
  queries.some((query) => isEqual(query.queryKey, queryKey));

/**
 * Sets up the interval scheduled to refetch cluster data in the background
 * Returns the following:
 * refetch - function used to refresh manually (then resets the schedule)
 * setRefetchSchedule - function to set the initial schedule
 * clearRefetch - function to clear the refetch schedule
 */

const { FETCH_CLUSTERS_REFETCH_INTERVAL } = queryConstants;

const getNewData = (isArchived: boolean) => {
  queryClient.invalidateQueries({ queryKey: [queryConstants.FETCH_ACCESS_TRANSPARENCY] });
  queryClient.invalidateQueries({
    queryKey: [queryConstants.FETCH_CLUSTERS_QUERY_KEY, isArchived ? 'Archived' : 'Active'],
  });
  queryClient.invalidateQueries({
    queryKey: [
      queryConstants.FETCH_CLUSTERS_QUERY_KEY,
      'authorizationsService',
      'selfResourceReview',
    ],
  });
};

export const useRefetchClusterList = (isArchived: boolean) => {
  const currentTimer = React.useRef();
  const isModalOpen = useGlobalState((state) => !!state.modal.modalName);
  const savedIsModalOpen = React.useRef(isModalOpen);

  const isVisible = document.visibilityState;
  const isOnline = navigator.onLine;

  const isVisibleAndOnline = React.useRef(true);

  React.useEffect(() => {
    savedIsModalOpen.current = isModalOpen;
  }, [isModalOpen]);

  React.useEffect(() => {
    isVisibleAndOnline.current = isVisible === 'visible' && isOnline;
  }, [isOnline, isVisible]);

  const clearRefetch = () => {
    // @ts-ignore
    clearInterval(currentTimer.current);
  };

  const setRefetchSchedule = () => {
    clearRefetch();
    // @ts-ignore
    currentTimer.current = setInterval(() => {
      if (!savedIsModalOpen.current && isVisibleAndOnline.current) {
        getNewData(isArchived);
      }
    }, FETCH_CLUSTERS_REFETCH_INTERVAL);
  };

  const refetch = () => {
    getNewData(isArchived);
    setRefetchSchedule();
  };

  return { refetch, setRefetchSchedule, clearRefetch };
};

/**
 * Removes all queries to fetch cluster data from React Query
 * This forces useFetchClusters to re-render and rebuilds all the queries based on new data
 */

export const clearQueries = (
  setQueries: (callback: () => []) => void,
  callback: () => void,
  isArchived: boolean,
) => {
  queryClient.removeQueries({
    queryKey: [
      queryConstants.FETCH_CLUSTERS_QUERY_KEY,
      isArchived ? 'Archived' : 'Active',
      'subscriptions',
    ],
  });
  setQueries(() => {
    queryClient.removeQueries({
      queryKey: [
        queryConstants.FETCH_CLUSTERS_QUERY_KEY,
        isArchived ? 'Archived' : 'Active',
        'clusters',
      ],
    });
    queryClient.removeQueries({
      queryKey: [
        queryConstants.FETCH_CLUSTERS_QUERY_KEY,
        'authorizationsService',
        'selfResourceReview',
      ],
    });
    // we only want to replace the cache - not remove it to prevent a flash of the banners
    queryClient.invalidateQueries({ queryKey: [queryConstants.FETCH_ACCESS_TRANSPARENCY] });
    return [];
  });
  callback();
};

/**
 * Adds the canUpdate/Edit and canDelete information
 * Into each cluster in the array of clusters
 */
export const combineClusterQueries = (
  clusters: ClusterWithPermissions[],
  canEditList: CanEditDelete,
  canDeleteList: CanEditDelete,
) => {
  if (!clusters || clusters.length === 0) {
    return undefined;
  }

  return clusters.map((cluster) => {
    const modifiedCluster = { ...cluster };

    modifiedCluster.canEdit =
      !cluster.partialCS &&
      !!canEditList &&
      (canEditList['*'] || (!!cluster.id && !!canEditList[cluster.id])) &&
      cluster.subscription?.status !== SubscriptionCommonFieldsStatus.Deprovisioned;

    modifiedCluster.canDelete =
      !cluster.partialCS &&
      !!canDeleteList &&
      (canDeleteList['*'] || (!!cluster.id && !!canDeleteList[cluster.id!]));
    return modifiedCluster;
  });
};

/**
 * Builds search query for cluster service API calls
 */
export const buildSearchClusterQuery = (
  items: { [field: string]: unknown }[],
  field: string,
): string => {
  const IDs = new Set();
  items.forEach((item) => {
    const objectID = item[field];
    if (objectID) {
      IDs.add(`'${objectID}'`);
    }
  });
  return `id in (${Array.from(IDs).join(',')})`;
};
