import React from 'react';

import { checkAccessibility, render, screen, within } from '~/testUtils';

import fixtures from '../../ClusterDetailsMultiRegion/__tests__/ClusterDetails.fixtures';
import {
  mockAddOns,
  mockClusterAddOnsWithExternalResources,
} from '../../ClusterDetailsMultiRegion/components/AddOns/__tests__/AddOns.fixtures';
import AddOnsConstants from '../../ClusterDetailsMultiRegion/components/AddOns/AddOnsConstants';

import UninstallProgress from './UninstallProgress';

describe('<UninstallProgress />', () => {
  const getClusterAddOns = jest.fn();

  const { clusterDetails } = fixtures;

  const defaultProps = {
    cluster: clusterDetails.cluster,
    getClusterAddOns,
    addOns: mockAddOns,
    clusterAddOns: mockClusterAddOnsWithExternalResources,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = render(<UninstallProgress {...defaultProps} />);

    expect(screen.getByText('Add-on uninstallation')).toBeInTheDocument();
    expect(screen.getByText('Cluster uninstallation')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('should be pending when an addon is ready', () => {
    render(<UninstallProgress {...defaultProps} />);

    const addOnProgressStep = screen.getAllByRole('listitem')[0];

    expect(within(addOnProgressStep).getByText('Add-on uninstallation')).toBeInTheDocument();
    expect(within(addOnProgressStep).getByText('Pending')).toBeInTheDocument();
  });

  it('should be removing add-ons when an addon is deleting', () => {
    const newAddOnsWithExternalResources = { ...mockClusterAddOnsWithExternalResources };
    newAddOnsWithExternalResources.items[0].state = AddOnsConstants.INSTALLATION_STATE.DELETING;

    const newProps = {
      ...defaultProps,
      clusterAddOns: newAddOnsWithExternalResources,
    };

    render(<UninstallProgress {...newProps} />);

    const addOnProgressStep = screen.getAllByRole('listitem')[0];

    expect(within(addOnProgressStep).getByText('Add-on uninstallation')).toBeInTheDocument();
    expect(within(addOnProgressStep).getByText('Uninstalling')).toBeInTheDocument();
  });

  it('should be completed when addon is deleted', () => {
    const newAddOnsWithExternalResources = { ...mockClusterAddOnsWithExternalResources };

    newAddOnsWithExternalResources.items[0].state = AddOnsConstants.INSTALLATION_STATE.DELETED;

    const newProps = {
      ...defaultProps,
      clusterAddOns: newAddOnsWithExternalResources,
    };

    render(<UninstallProgress {...newProps} />);

    const addOnProgressStep = screen.getAllByRole('listitem')[0];

    expect(within(addOnProgressStep).getByText('Add-on uninstallation')).toBeInTheDocument();
    expect(within(addOnProgressStep).getByText('Completed')).toBeInTheDocument();
  });

  it('should be completed when no addons installed', () => {
    const newProps = {
      ...defaultProps,
      clusterAddOns: { items: [] },
    };

    render(<UninstallProgress {...newProps} />);

    const addOnProgressStep = screen.getAllByRole('listitem')[0];

    expect(within(addOnProgressStep).getByText('Add-on uninstallation')).toBeInTheDocument();
    expect(within(addOnProgressStep).getByText('Completed')).toBeInTheDocument();
  });
});
