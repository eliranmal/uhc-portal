import React from 'react';

import { render, screen } from '~/testUtils';

import * as Fixtures from './__tests__/Quota.fixtures';
import SubscriptionNotFulfilled from './SubscriptionNotFulfilled';

describe('<SubscriptionNotFulfilled />', () => {
  const refreshFn = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading icon', () => {
    const quotaCost = { ...Fixtures.quotaCost, pending: true, type: 'osd' };
    render(<SubscriptionNotFulfilled data={quotaCost} refresh={refreshFn} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });

  it('shows empty OSD quota summary', () => {
    const quotaCost = { ...Fixtures.emptyQuotaCost, empty: true, type: 'osd' };
    render(<SubscriptionNotFulfilled data={quotaCost} refresh={refreshFn} />);
    expect(screen.getByText('You do not have any quota')).toBeInTheDocument();
  });

  it('shows error', async () => {
    const quotaCost = { ...Fixtures.quotaCost, error: true, type: 'osd' };
    const { user } = render(<SubscriptionNotFulfilled data={quotaCost} refresh={refreshFn} />);

    expect(screen.getByText('An error has occurred!', { exact: false })).toBeInTheDocument();
    expect(refreshFn).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button'));
    expect(refreshFn).toHaveBeenCalled();
  });
});
