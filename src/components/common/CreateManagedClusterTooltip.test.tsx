import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import CreateManagedClusterTooltip from './CreateManagedClusterTooltip';

describe('<CreateManagedClusterTooltip>', () => {
  it('Renders correctly', async () => {
    const { container, user } = render(
      <CreateManagedClusterTooltip>
        <button type="button" aria-disabled="true">
          Create cluster
        </button>
      </CreateManagedClusterTooltip>,
    );
    await checkAccessibility(container);
    await user.hover(screen.getByRole('button'));
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    expect(
      await screen.findByText('You do not have permission to create a managed cluster.'),
    ).toBeInTheDocument();
  });

  it('Renders with a wrapper', async () => {
    render(
      <CreateManagedClusterTooltip wrap>
        <button type="button" aria-disabled="true">
          Create cluster
        </button>
      </CreateManagedClusterTooltip>,
    );
    expect(await screen.findByTestId('create-cluster-tooltip-wrapper')).toBeInTheDocument();
  });
});
