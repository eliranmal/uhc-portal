import { action, ActionType } from 'typesafe-actions';

import type { ViewFlags, ViewSorting } from '../../types/types';
import { viewPaginationConstants } from '../constants';

const onSetTotalClusters = (totalCount: number | undefined, viewType: string) =>
  action(viewPaginationConstants.SET_TOTAL_ITEMS, { viewType, totalCount: totalCount || 0 });

const onSetTotal = (totalCount: number | undefined, viewType: string) =>
  action(viewPaginationConstants.SET_TOTAL_ITEMS, { viewType, totalCount: totalCount || 0 });

const onFirstPage = (viewType: string) =>
  action(viewPaginationConstants.VIEW_FIRST_PAGE, { viewType });

const onLastPage = (viewType: string) =>
  action(viewPaginationConstants.VIEW_LAST_PAGE, { viewType });

const onPreviousPage = (viewType: string) =>
  action(viewPaginationConstants.VIEW_PREVIOUS_PAGE, { viewType });

const onNextPage = (viewType: string) =>
  action(viewPaginationConstants.VIEW_NEXT_PAGE, { viewType });

const onPageInput = (pageNumber: number, viewType: string) =>
  action(viewPaginationConstants.VIEW_PAGE_NUMBER, { viewType, pageNumber });

const onPerPageSelect = (pageSize: number, viewType: string, updatePageCounts?: boolean) =>
  action(viewPaginationConstants.SET_PER_PAGE, { viewType, pageSize, updatePageCounts });

const onListFilterSet = (filter: string | object, viewType: string) =>
  action(viewPaginationConstants.VIEW_SET_LIST_FILTER, { viewType, filter });

const onListFlagsSet = (key: string, value: ViewFlags, viewType: string) =>
  action(viewPaginationConstants.VIEW_SET_LIST_FLAGS, { viewType, key, value });

const onClearFiltersAndFlags = (viewType: string) =>
  action(viewPaginationConstants.VIEW_CLEAR_FILTERS_AND_FLAGS, { viewType });

const onResetFiltersAndFlags = (viewType: string) =>
  action(viewPaginationConstants.VIEW_RESET_FILTERS_AND_FLAGS, { viewType });

const onListSortBy = (sorting: ViewSorting, viewType: string) =>
  action(viewPaginationConstants.VIEW_CHANGE_SORT, { viewType, sorting });

const viewActions = {
  onFirstPage,
  onLastPage,
  onPreviousPage,
  onNextPage,
  onPageInput,
  onPerPageSelect,
  onListFilterSet,
  onListFlagsSet,
  onListSortBy,
  onClearFiltersAndFlags,
  onResetFiltersAndFlags,
  onSetTotalClusters,
};

type ViewOptionsAction = ActionType<typeof viewActions>;

export {
  viewActions,
  onFirstPage,
  onLastPage,
  onPreviousPage,
  onNextPage,
  onPageInput,
  onPerPageSelect,
  onListFilterSet,
  onListFlagsSet,
  onListSortBy,
  onClearFiltersAndFlags,
  onResetFiltersAndFlags,
  ViewOptionsAction,
  onSetTotalClusters,
  onSetTotal,
};
