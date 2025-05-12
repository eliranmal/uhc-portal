import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import AccessRequestTablePagination from '../AccessRequestTablePagination';

jest.mock('~/components/clusters/common/ViewPaginationRow/viewPaginationRow', () => () => (
  <div data-testid="view-pagination-row-mock" />
));

describe('AccessRequestTablePagination', () => {
  it('is accessible', async () => {
    const { container } = render(
      <AccessRequestTablePagination
        viewType=""
        viewOptions={{
          currentPage: 0,
          pageSize: 0,
          totalCount: 0,
          totalPages: 0,
          filter: '',
          sorting: {
            sortField: '',
            isAscending: false,
            sortIndex: 0,
          },
          flags: {},
        }}
        variant="bottom"
      />,
    );
    await checkAccessibility(container);
  });

  it('is properly rendering', () => {
    render(
      <AccessRequestTablePagination
        viewType=""
        viewOptions={{
          currentPage: 0,
          pageSize: 0,
          totalCount: 0,
          totalPages: 0,
          filter: '',
          sorting: {
            sortField: '',
            isAscending: false,
            sortIndex: 0,
          },
          flags: {},
        }}
        variant="bottom"
      />,
    );

    expect(screen.getByTestId('view-pagination-row-mock')).toBeInTheDocument();
  });
});
