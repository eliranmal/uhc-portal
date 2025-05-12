import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import fixtures from '../../ClusterDetailsMultiRegion/__tests__/ClusterDetails.fixtures';
import clusterStates from '../clusterStates';

import InstallProgress from './InstallProgress';

describe('<InstallProgress />', () => {
  const clusterInstalling = {
    ...fixtures.clusterDetails.cluster,
    state: clusterStates.installing,
  };

  it('is accessible when installing cluster', async () => {
    const { container } = render(<InstallProgress cluster={clusterInstalling} />);

    expect(screen.getByText('Installing cluster')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('returns empty component  when uninstalling cluster', () => {
    const uninstallingCluster = { ...clusterInstalling, state: clusterStates.uninstalling };
    const { container } = render(<InstallProgress cluster={uninstallingCluster} />);

    expect(container).toBeEmptyDOMElement();
  });
});
