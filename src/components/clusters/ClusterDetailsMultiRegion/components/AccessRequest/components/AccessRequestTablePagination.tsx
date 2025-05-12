import React from 'react';

import ViewPaginationRow from '~/components/clusters/common/ViewPaginationRow/viewPaginationRow';
import { ViewOptions } from '~/types/types';

type AccessRequestTablePaginationProps = {
  viewType: string;
  viewOptions: ViewOptions;
  isDisabled?: boolean;
  variant: 'bottom' | 'top';
};
const AccessRequestTablePagination = ({
  viewType,
  viewOptions,
  isDisabled,
  variant,
}: AccessRequestTablePaginationProps) => (
  <ViewPaginationRow
    viewType={viewType}
    currentPage={viewOptions.currentPage}
    pageSize={viewOptions.pageSize}
    totalCount={viewOptions.totalCount}
    totalPages={viewOptions.totalPages}
    variant={variant}
    isDisabled={isDisabled}
  />
);

export default AccessRequestTablePagination;
