import React, { useCallback, useMemo } from 'react';

import {
  Button,
  EmptyState,
  EmptyStateHeader,
  EmptyStateIcon,
  PageSection,
  Skeleton,
} from '@patternfly/react-core';
import { EyeIcon } from '@patternfly/react-icons/dist/esm/icons/eye-icon';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { ISortBy, sortable, SortByDirection } from '@patternfly/react-table';
import {
  Table as TableDeprecated,
  TableBody as TableBodyDeprecated,
  TableHeader as TableHeaderDeprecated,
} from '@patternfly/react-table/deprecated';

import { AccessRequest } from '~/types/access_transparency.v1';
import { ViewSorting } from '~/types/types';

import AccessRequestStateIcon from './AccessRequestStateIcon';

const COLUMNS = [
  {
    title: 'State',
    sortTitle: 'status.state',
    transforms: [sortable],
  },
  {
    title: 'ID',
    sortTitle: 'id',
    transforms: [sortable],
  },
  {
    title: 'Created Time',
    sortTitle: 'created_at',
    transforms: [sortable],
  },
  {
    title: 'Actions',
    screenReaderText: 'access request actions',
    sortTitle: '',
  },
];

type AccessRequestTableProps = {
  accessRequestItems?: Array<AccessRequest>;
  sortBy: ISortBy;
  setSorting: (sort: ViewSorting) => void;
  openDetailsAction: (accessRequestElement?: AccessRequest) => void;
  isPending?: boolean;
};

const AccessRequestTable = ({
  accessRequestItems,
  setSorting,
  openDetailsAction,
  sortBy,
  isPending,
}: AccessRequestTableProps) => {
  const rows = useMemo(
    () =>
      isPending
        ? // it fills 10 elements plenty of Skeleton components
          Array.from(Array(10).keys()).map(() =>
            Array.from(Array(COLUMNS.length).keys()).reduce(
              (acc: { title: React.ReactNode }[]) => [
                ...acc,
                { title: <Skeleton screenreaderText="Loading..." /> },
              ],
              [],
            ),
          )
        : accessRequestItems?.map((e) => [
            { title: <AccessRequestStateIcon accessRequest={e} /> },
            { title: e.id },
            { title: e.created_at },
            {
              title: (
                <Button
                  variant="secondary"
                  icon={<EyeIcon />}
                  aria-label="openDetailsAction"
                  onClick={() => openDetailsAction(e)}
                >
                  Open
                </Button>
              ),
            },
          ]),
    [accessRequestItems, openDetailsAction, isPending],
  );

  const onSortToggle = useCallback(
    (_event: object, index: number, direction: string) =>
      setSorting({
        isAscending: direction === SortByDirection.asc,
        sortField: COLUMNS[index].sortTitle,
        sortIndex: index,
      }),
    [setSorting],
  );

  return rows?.length ? (
    <TableDeprecated
      aria-label="Access Request"
      cells={COLUMNS}
      rows={rows}
      sortBy={sortBy}
      onSort={onSortToggle}
    >
      <TableHeaderDeprecated />
      <TableBodyDeprecated />
    </TableDeprecated>
  ) : (
    <PageSection>
      <EmptyState>
        <EmptyStateHeader
          titleText="No access request entries found"
          icon={<EmptyStateIcon icon={SearchIcon} />}
          headingLevel="h4"
        />
      </EmptyState>
    </PageSection>
  );
};

export default AccessRequestTable;
