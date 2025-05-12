import React from 'react';

import { Pagination, PaginationVariant } from '@patternfly/react-core';

interface ClusterLogsPaginationProps {
  itemCount: number | undefined;
  isDisabled: boolean;
  page: number;
  perPage: number;
  itemsStart: number;
  itemsEnd: number;
  variant?: PaginationVariant;
  onSetPage?: (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPage: number,
  ) => void;
  onPerPageSelect?: (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number,
  ) => void;
}

const ClusterLogsPagination = ({
  itemCount,
  isDisabled,
  page,
  perPage,
  itemsStart,
  itemsEnd,
  variant,
  onSetPage,
  onPerPageSelect,
}: ClusterLogsPaginationProps) => (
  <Pagination
    itemCount={itemCount}
    perPage={perPage}
    page={page}
    variant={variant || PaginationVariant.bottom}
    onSetPage={onSetPage}
    onPerPageSelect={onPerPageSelect}
    itemsStart={itemsStart}
    itemsEnd={itemsEnd}
    isDisabled={isDisabled}
    dropDirection={variant === 'bottom' ? 'up' : 'down'}
    isCompact={variant !== 'bottom'}
  />
);

export default ClusterLogsPagination;
