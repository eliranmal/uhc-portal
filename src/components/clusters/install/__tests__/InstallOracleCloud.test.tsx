import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import InstallOracleCloud from '../InstallOracleCloud';

describe('InstallOracleCloud', () => {
  it('is accessible', async () => {
    const { container } = render(<InstallOracleCloud />);
    expect(
      await screen.findByText('Create an OpenShift Cluster: Oracle Cloud Infrastructure'),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
