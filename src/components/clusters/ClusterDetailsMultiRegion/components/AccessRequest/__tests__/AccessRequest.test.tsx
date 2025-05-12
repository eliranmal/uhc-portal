import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import AccessRequest from '../AccessRequest';

jest.mock('~/components/common/Modal/ConnectedModal', () => () => <div>connected modal</div>);
jest.mock('../components/AccessRequestTable', () => () => <div>access request table</div>);
jest.mock('../components/AccessRequestTablePagination', () => () => (
  <div>access request table pagination</div>
));

describe('AccessRequest', () => {
  it('is accessible empty content', async () => {
    // Act
    const { container } = render(<AccessRequest />);

    // Assert
    await checkAccessibility(container);
  });

  it('properly renders', () => {
    // Act
    render(<AccessRequest />);

    // Assert
    expect(screen.queryAllByText(/access request table pagination/i)).toHaveLength(2);
    expect(screen.getByText(/^access request table$/i)).toBeInTheDocument();
    expect(screen.getByText(/connected modal/i)).toBeInTheDocument();
    expect(
      screen.getByText(/access requests to customer data on red hat openshift/i),
    ).toBeInTheDocument();
  });
});
