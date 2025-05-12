import { queryClient } from '~/components/App/queryClient';
import { queryConstants } from '~/queries/queriesConstants';
import { ClusterWithPermissions, ViewOptions } from '~/types/types';

import {
  clearQueries,
  combineClusterQueries,
  createQueryKey,
  isExistingQuery,
} from './useFetchClustersHelpers';

describe('useFetchClustersHelpers', () => {
  afterEach(() => {
    queryClient.removeQueries();
  });

  const defaultViewOptions = {
    currentPage: 1,
    pageSize: 20,
    totalCount: 100,
    totalPages: 5,
    filter: 'myNameFilter',
    sorting: {
      sortField: 'mySortField',
      isAscending: true,
      sortIndex: 0,
    },
    flags: {
      showArchived: false,
      showMyClustersOnly: true,
      subscriptionFilter: {
        plan_id: ['planType1', 'planType2'],
      },
    },
  };

  describe('createQueryKey', () => {
    it('creates key with sort and filtering fields', () => {
      const expects = [
        queryConstants.FETCH_CLUSTERS_QUERY_KEY,
        'Active',
        'clusters',
        '-',
        '1',
        '20',
        'mySortField',
        'asc',
        'myNameFilter',
        'only_my_clusters',
        'planType1',
        'planType2',
      ];

      const myKey = createQueryKey({ type: 'clusters', viewOptions: defaultViewOptions });
      expect(myKey).toEqual(expects);
    });

    it('creates key without sort and filtering fields', () => {
      const viewOptions = {
        ...defaultViewOptions,
        filter: '',
        sorting: undefined,
        flags: undefined,
      } as unknown as ViewOptions;

      const expects = [
        queryConstants.FETCH_CLUSTERS_QUERY_KEY,
        'Active',
        'subscriptions',
        '-',
        '1',
        '20',
        'no_sort_field',
        'desc',
        'no_name_filter',
        'all_clusters',
      ];

      const myKey = createQueryKey({ type: 'subscriptions', viewOptions });
      expect(myKey).toEqual(expects);
    });

    it('creates key with type/region', () => {
      const myKey = createQueryKey({
        type: 'clusters',
        viewOptions: defaultViewOptions,
        clusterTypeOrRegion: 'myRegion',
      });
      expect(myKey[3]).toEqual('myRegion');
    });

    it('creates key without type/region', () => {
      const myKey = createQueryKey({
        type: 'clusters',
        viewOptions: defaultViewOptions,
      });
      expect(myKey[3]).toEqual('-');
    });
  });

  describe('isExistingQuery', () => {
    const queries = [
      { queryKey: ['option1-1', 'option1-2', 'option1-3'] },
      { queryKey: ['option2-1'] },
    ];
    it('returns false when there is not a match', () => {
      expect(isExistingQuery(queries, ['option3-1'])).toBeFalsy();
      expect(isExistingQuery(queries, ['option2-1', 'option2-2'])).toBeFalsy();
      expect(isExistingQuery(queries, ['option1-1', 'option1-3'])).toBeFalsy();
      expect(isExistingQuery(queries, [])).toBeFalsy();
    });

    it('returns true when there is  a match', () => {
      expect(isExistingQuery(queries, ['option1-1', 'option1-2', 'option1-3'])).toBeTruthy();
      expect(isExistingQuery(queries, ['option2-1'])).toBeTruthy();
    });
  });

  describe('useRefetchClusterList', () => {
    it.skip('provides functions that set the refresh schedule', () => {});

    it.skip('does not auto reload data when modal is open', () => {});
  });

  describe('clearQueries', () => {
    it('removes cluster fetch queries and invalidates access transparency queries', async () => {
      await queryClient.fetchQuery({
        queryKey: [queryConstants.FETCH_CLUSTERS_QUERY_KEY, 'Active', 'subscriptions'],
        queryFn: () => 'hello world',
      });

      await queryClient.fetchQuery({
        queryKey: [queryConstants.FETCH_ACCESS_TRANSPARENCY, 'another key'],
        queryFn: () => 'hello world',
      });

      expect(queryClient.getQueryCache().getAll()).toHaveLength(2);

      const setQueries = (callBack: () => void) => {
        callBack();
      };
      const clearRefetch = jest.fn();

      clearQueries(setQueries, clearRefetch, false);

      const queriesAfterClear = queryClient.getQueryCache().getAll();
      expect(queriesAfterClear).toHaveLength(1);

      expect(queriesAfterClear[0].state.isInvalidated).toBeTruthy();
    });
  });

  describe('combineClusterQueries', () => {
    it('returns undefined if no clusters are provided', () => {
      expect(combineClusterQueries([], {}, {})).toBeUndefined();
    });

    it('returns expected array of clusters', () => {
      const clusters = [
        { partialCS: true, id: 'partialCSClusterId', subscription: { status: 'Active' } },
        { partialCS: false, id: 'clusterNoEditNoDelete', subscription: { status: 'Active' } },
        { partialCS: false, id: 'clusterEditNoDelete', subscription: { status: 'Active' } },
        { partialCS: false, id: 'clusterNoEditDelete', subscription: { status: 'Active' } },
        { partialCS: false, id: 'myCluster', subscription: { status: 'Active' } },
      ] as ClusterWithPermissions[];

      const canEditList = { partialCSClusterId: true, clusterEditNoDelete: true, myCluster: true };
      const canDeleteList = {
        partialCSClusterId: true,
        clusterNoEditDelete: true,
        myCluster: true,
      };
      const expected = [
        {
          partialCS: true,
          id: 'partialCSClusterId',
          canEdit: false,
          canDelete: false,
          subscription: { status: 'Active' },
        },
        {
          partialCS: false,
          id: 'clusterNoEditNoDelete',
          canEdit: false,
          canDelete: false,
          subscription: { status: 'Active' },
        },
        {
          partialCS: false,
          id: 'clusterEditNoDelete',
          canEdit: true,
          canDelete: false,
          subscription: { status: 'Active' },
        },
        {
          partialCS: false,
          id: 'clusterNoEditDelete',
          canEdit: false,
          canDelete: true,
          subscription: { status: 'Active' },
        },
        {
          partialCS: false,
          id: 'myCluster',
          canEdit: true,
          canDelete: true,
          subscription: { status: 'Active' },
        },
      ] as ClusterWithPermissions[];

      expect(combineClusterQueries(clusters, canEditList, canDeleteList)).toEqual(expected);
    });

    it('returns expected when canDelte and canEdit contain "*"', () => {
      const clusters = [
        { partialCS: true, id: 'partialCSClusterId', subscription: { status: 'Active' } },
        { partialCS: false, id: 'myCluster1', subscription: { status: 'Active' } },
        { partialCS: false, id: 'myCluster2', subscription: { status: 'Active' } },
      ] as ClusterWithPermissions[];

      const canEditList = { '*': true };
      const canDeleteList = {
        '*': true,
      };

      const expected = [
        {
          partialCS: true,
          id: 'partialCSClusterId',
          canEdit: false,
          canDelete: false,
          subscription: { status: 'Active' },
        },
        {
          partialCS: false,
          id: 'myCluster1',
          canEdit: true,
          canDelete: true,
          subscription: { status: 'Active' },
        },
        {
          partialCS: false,
          id: 'myCluster2',
          canEdit: true,
          canDelete: true,
          subscription: { status: 'Active' },
        },
      ] as ClusterWithPermissions[];

      expect(combineClusterQueries(clusters, canEditList, canDeleteList)).toEqual(expected);
    });
  });
});
