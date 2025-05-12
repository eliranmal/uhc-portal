import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import fixtures from '../../ClusterDetailsMultiRegion/__tests__/ClusterDetails.fixtures';

import ActionRequiredLink from './ActionRequiredLink';

describe('<ActionRequiredLink />', () => {
  it('does not render modal when initiallyOpen is set to false', async () => {
    const { container } = render(
      <ActionRequiredLink cluster={fixtures.ROSAManualClusterDetails} initiallyOpen={false} />,
    );

    expect(screen.getByRole('button', { name: 'Action required' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await checkAccessibility(container);
  });

  it('renders the modal when initiallyOpen is set to true', () => {
    render(<ActionRequiredLink cluster={fixtures.ROSAManualClusterDetails} initiallyOpen />);

    expect(screen.queryByRole('button', { name: 'Action required' })).not.toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('opens the dialog when button is pressed', async () => {
    const { user } = render(
      <ActionRequiredLink cluster={fixtures.ROSAManualClusterDetails} initiallyOpen={false} />,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Action required' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Action required' })).not.toBeInTheDocument();
  });
});
