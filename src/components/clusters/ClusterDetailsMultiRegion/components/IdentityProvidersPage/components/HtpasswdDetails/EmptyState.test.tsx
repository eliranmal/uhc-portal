import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import EmptyState from './EmptyState';

describe('<EmptyState />', () => {
  it('is accessible', async () => {
    const { container } = render(<EmptyState showClearFilterButton />);
    await checkAccessibility(container);
  });

  it('shows clear all filters link', async () => {
    const resetFilters = jest.fn();
    const { user } = render(<EmptyState showClearFilterButton resetFilters={resetFilters} />);

    expect(screen.getByText('Clear all filters and try again.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear all filters' }));

    expect(resetFilters).toHaveBeenCalled();
  });

  it('hides clear all filters link when showClearFilterButton is false', () => {
    render(<EmptyState />);

    expect(screen.queryByText('Clear all filters and try again.')).not.toBeInTheDocument();
  });
});
