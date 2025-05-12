import React from 'react';

import { UseQueryResult } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { SubscriptionCommonFieldsStatus } from '~/types/accounts_mgmt.v1';
import {
  ClusterFromSubscription,
  ClusterWithPermissions,
  ViewOptions,
  ViewOptionsFilter,
} from '~/types/types';

import { queryConstants } from '../../../queriesConstants';
import { formatCluster } from '../../helpers/formatCluster';
import { CanEditDelete } from '../../helpers/useFetchCanEditDelete';
import { Region } from '../types/types';

import { fetchPageOfGlobalClusters } from './fetchGlobalClusters';
import { fetchPageOfRegionalClusters } from './fetchRegionalClusters';

const PAGE_SIZE = 500;
const FETCH_CLUSTERS_QUERY_TYPE = { GLOBAL: 'global', REGIONAL: 'regional' };

/* **** Types **** */
export type FetchClusterQueryResults = UseQueryResult & {
  data?: {
    items: any[];
    page: number;
    total: number;
    region: Region;
    isError: boolean;
    errors: any[];
  };
  errors?: any[];
};

export type UseFetchClustersQuery = ReturnType<typeof createQuery>;

type FetchPageOfClustersProps = {
  page: number;
  region?: Region;
  flags?: { [flag: string]: any };
  nameFilter?: ViewOptionsFilter;
  userName?: string;
  getMultiRegion?: boolean;
  sorting?: { sortField: string; isAscending: boolean; sortIndex: number };
  pageSize?: number;
};

type FetchPage = {
  total: number;
  page: number;
  region: Region;
};

/* **** Helpers **** */

/**
 * Fetches either an API page's worth of regional or global clusters
 */

export const fetchPageOfClusters = async ({
  page,
  region,
  flags,
  nameFilter,
  userName,
  sorting,
  getMultiRegion,
  pageSize,
}: FetchPageOfClustersProps) => {
  const { items, total, isError, errors } = region
    ? await fetchPageOfRegionalClusters(
        page,
        region,
        { flags, filter: nameFilter } as ViewOptions,
        userName,
      )
    : await fetchPageOfGlobalClusters(
        page,
        pageSize,
        { flags, filter: nameFilter, sorting } as ViewOptions,
        userName,
        getMultiRegion,
      );
  return {
    items: items?.map((cluster) => formatCluster(cluster as ClusterFromSubscription)),
    page,
    total,
    region,
    isError,
    errors,
  };
};

/**
 * Creates the React Query key based on params
 */

const queryKey = ({
  page,
  region,
  plans,
  nameFilter,
  showMyClustersOnly,
  sorting,
  useClientSortPaging,
  pageSize,
}: {
  page: number;
  region?: Region | undefined;
  plans?: string[] | undefined;
  nameFilter?: ViewOptionsFilter;
  showMyClustersOnly?: boolean;
  sorting?: { sortField: string; isAscending: boolean; sortIndex: number };
  useClientSortPaging: boolean;
  pageSize?: number;
}) => {
  const key = [
    queryConstants.FETCH_CLUSTERS_QUERY_KEY,
    region ? FETCH_CLUSTERS_QUERY_TYPE.REGIONAL : FETCH_CLUSTERS_QUERY_TYPE.GLOBAL,
    page,
  ];

  key.push(!useClientSortPaging ? `${pageSize}` : `500`);

  if (region && region.region && region.provider) {
    key.push(region.region);
    key.push(region.provider);
  }

  if (plans && plans.length > 0) {
    key.push(...plans);
  }
  if (typeof nameFilter === 'string') {
    key.push(nameFilter);
  }

  if (showMyClustersOnly) {
    key.push('showMyClustersOnly');
  }
  if (sorting && !useClientSortPaging) {
    key.push(...[sorting.sortField, sorting.isAscending ? 'asc' : 'desc']);
  }

  return key;
};

/**
 * Creates a React Query query
 */

export const createQuery = ({
  page,
  region,
  flags,
  nameFilter,
  userName,
  getMultiRegion = true,
  sorting,
  useClientSortPaging,
  pageSize,
}: {
  page: number;
  region?: Region;
  flags?: { [flag: string]: any };
  nameFilter?: ViewOptionsFilter;
  userName?: string;
  getMultiRegion?: boolean;
  sorting?: { sortField: string; isAscending: boolean; sortIndex: number };
  useClientSortPaging: boolean;
  pageSize?: number;
}) => ({
  queryKey: queryKey({
    page,
    region,
    plans: flags?.subscriptionFilter?.plan_id,
    nameFilter,
    showMyClustersOnly: flags?.showMyClustersOnly,
    sorting,
    useClientSortPaging,
    pageSize,
  }),

  queryFn: async () =>
    fetchPageOfClusters({
      page: page || 1,
      region,
      flags,
      nameFilter,
      userName,
      getMultiRegion,
      sorting,
      pageSize,
    }),
});

/**
 * Checks to see if a query already exists based on params
 * Used to determine if a new query needs to be created
 */

export const isExistingQuery = ({
  queries,
  page,
  region,
}: {
  queries: any[];
  page: number;
  region?: Region;
}) =>
  (queries || []).some((query: any) => {
    if (!region) {
      const [mainKey, queryType, queryPage, _queryPageSize] = query.queryKey;
      return (
        mainKey === queryConstants.FETCH_CLUSTERS_QUERY_KEY &&
        queryType === FETCH_CLUSTERS_QUERY_TYPE.GLOBAL &&
        queryPage === page
      );
    }

    const [mainKey, queryType, queryPage, _queryPageSize, queryRegion, queryProvider] =
      query.queryKey;
    return (
      mainKey === queryConstants.FETCH_CLUSTERS_QUERY_KEY &&
      queryType === FETCH_CLUSTERS_QUERY_TYPE.REGIONAL &&
      queryRegion === region.region &&
      queryProvider === region.provider &&
      queryPage === page
    );
  });

/**
 * Sets up the interval scheduled to refetch cluster data in the background
 * Returns the following:
 * refetch - function used to refresh manually (then resets the schedule)
 * setRefetchSchedule - function to set the initial schedule
 * clearRefetch - function to clear the refetch schedule
 */

const { FETCH_CLUSTERS_REFETCH_INTERVAL } = queryConstants;

export const useRefetchClusterList = () => {
  const [refetchInterval, setRefetchInterval] = React.useState<ReturnType<typeof setInterval>>();

  const getNewData = () => {
    queryClient.invalidateQueries({ queryKey: [queryConstants.FETCH_CLUSTERS_QUERY_KEY] });
  };

  const setRefetch = () => {
    // @ts-ignore
    clearInterval(refetchInterval);
    const intervalId = setInterval(() => {
      getNewData();
    }, FETCH_CLUSTERS_REFETCH_INTERVAL);
    setRefetchInterval(intervalId);
  };

  const refetch = () => {
    getNewData();
    setRefetch();
  };

  const setRefetchSchedule = () => {
    if (!refetchInterval) {
      setRefetch();
    }
  };

  const clearRefetch = () => {
    // @ts-ignore
    clearInterval(refetchInterval);
    setRefetchInterval(undefined);
  };

  return { refetch, setRefetchSchedule, clearRefetch };
};

/**
 * Removes all queries to fetch cluster data from React Query
 * This forces useFetchClusters to re-render and rebuilds all the queries based on new data
 */
// export const clearQueries = (setQueries: (array: []) => void, clearRefetch: () => void) => {
export const clearQueries = (
  setQueries: (callback: () => []) => void,
  clearRefetch: () => void,
) => {
  setQueries(() => {
    queryClient.removeQueries({
      queryKey: [queryConstants.FETCH_CLUSTERS_QUERY_KEY, FETCH_CLUSTERS_QUERY_TYPE.GLOBAL],
    });
    queryClient.removeQueries({
      queryKey: [queryConstants.FETCH_CLUSTERS_QUERY_KEY, FETCH_CLUSTERS_QUERY_TYPE.REGIONAL],
    });
    return [];
  });
  clearRefetch();
};

/**
 * Adds teh canUpdate/Edit and canDelete information
 * Into each cluster in the array of clusters
 */
export const combineClusterQueries = (
  clusterQueriesResults: FetchClusterQueryResults[],
  canEditList: CanEditDelete,
  canDeleteList: CanEditDelete,
) => {
  if (clusterQueriesResults.every((result) => !result.data)) {
    // If no clusterQueryResults then need to return undefined
    return undefined;
  }

  return clusterQueriesResults.reduce((dataArray, result) => {
    /* Modify the results based on other React Queries - in this case canEdit and canDelete */
    const modifiedClusters = (result.data?.items || []).map((cluster) => {
      const modifiedCluster = { ...cluster };

      modifiedCluster.canEdit =
        !cluster.partialCS &&
        !!canEditList &&
        (canEditList['*'] || (!!cluster.id && !!canEditList[cluster.id])) &&
        cluster.subscription.status !== SubscriptionCommonFieldsStatus.Deprovisioned;

      modifiedCluster.canDelete =
        !cluster.partialCS &&
        !!canDeleteList &&
        (canDeleteList['*'] || (!!cluster.id && !!canDeleteList[cluster.id!]));
      return modifiedCluster;
    });

    return dataArray.concat(modifiedClusters);
  }, [] as ClusterWithPermissions[]);
};

/**
 * If using client side sorting and pagination, returns
 *  an array of queries that need to be fetched next
 * This is an array of queries that are additional API pages
 */
export const nextAPIPageQueries = ({
  fetchedPages,
  currentQueries,
  useClientSortPaging,
  flags,
  nameFilter,
  userName,
}: {
  fetchedPages: FetchPage[];
  currentQueries: UseFetchClustersQuery[];
  useClientSortPaging: boolean;
  flags: {
    [flag: string]: any;
  };
  nameFilter: ViewOptionsFilter;
  userName?: string;
}): UseFetchClustersQuery[] => {
  if (!fetchedPages || fetchedPages.length === 0 || !useClientSortPaging) {
    return [];
  }

  return fetchedPages.reduce((queriesToAdd, pageFetched) => {
    const numNextPages = Math.ceil((pageFetched.total - pageFetched.page * PAGE_SIZE) / PAGE_SIZE);
    const newQueries: UseFetchClustersQuery[] = [];
    for (let i = 1; i <= numNextPages; i += 1) {
      const nextPage = pageFetched.page + i;
      const doesNextPageExist = isExistingQuery({
        queries: currentQueries,
        page: nextPage,
        region: pageFetched.region,
      });
      if (!doesNextPageExist) {
        newQueries.push(
          createQuery({
            page: nextPage,
            region: pageFetched.region,
            useClientSortPaging,
            flags,
            nameFilter,
            userName,
          }),
        );
      }
    }

    return [...queriesToAdd, ...newQueries];
  }, [] as UseFetchClustersQuery[]);
};
