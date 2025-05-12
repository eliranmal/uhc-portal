import React from 'react';

import { MULTIREGION_PREVIEW_ENABLED } from '~/queries/featureGates/featureConstants';
import accountsService from '~/services/accountsService';
import clusterService from '~/services/clusterService';
import { checkAccessibility, mockUseFeatureGate, render, screen } from '~/testUtils';

import fixtures from '../../ClusterDetailsMultiRegion/__tests__/ClusterDetails.fixtures';

import ActionRequiredModal from './ActionRequiredModal';

// Service mocks are needed for child components
jest.mock('~/services/clusterService');
clusterService.getOperatorRoleCommands = jest.fn();
clusterService.getOperatorRoleCommands.mockResolvedValue({
  data: { commands: ['command 1', 'commend 2'] },
});

jest.mock('~/services/accountsService');
accountsService.getPolicies = jest.fn();
accountsService.getPolicies.mockResolvedValue({
  data: {
    items: [{ id: 'operator_iam_role_policy', details: 'Some details' }],
  },
});

accountsService.getCredentialRequests = jest.fn();
accountsService.getCredentialRequests.mockResolvedValue({
  data: {
    items: [
      {
        operator: {
          name: 'myrole',
          namespace: 'openshift-machine-api',
          service_accounts: ['account1', 'account2'],
        },
      },
    ],
  },
});

describe('<ActionRequiredModal />', () => {
  const onClose = jest.fn();

  const defaultProps = {
    cluster: fixtures.ROSAManualClusterDetails.cluster,
    isOpen: true,
    onClose,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    // Note this test throws warnings into the console because
    // a div is inside a paragraph
    // this appears to be a problem in  PF ClipboardCopy

    const { container } = render(<ActionRequiredModal {...defaultProps} />);

    expect(await screen.findByText('AWS CLI')).toBeInTheDocument();
    expect(await screen.findByRole('tabpanel')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('shows rosa login command when isMultiRegionEnabled', async () => {
    mockUseFeatureGate([[MULTIREGION_PREVIEW_ENABLED, true]]);

    const newProps = {
      ...defaultProps,
      cluster: fixtures.ROSAHypershiftWaitingClusterDetails.cluster,
      regionalInstance: fixtures.regionalInstance,
    };

    const { container } = render(<ActionRequiredModal {...newProps} />);

    await checkAccessibility(container);
    expect(screen.getByLabelText('Copyable ROSA region login')).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable ROSA create operator-roles')).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable ROSA OIDC provider')).toBeInTheDocument();
  });

  it('does not show rosa login command when isMultiRegionEnabled is false', async () => {
    mockUseFeatureGate([[MULTIREGION_PREVIEW_ENABLED, false]]);

    const newProps = {
      ...defaultProps,
      cluster: fixtures.ROSAHypershiftWaitingClusterDetails.cluster,
      regionalInstance: fixtures.regionalInstance,
    };

    const { container } = render(<ActionRequiredModal {...newProps} />);

    await checkAccessibility(container);
    expect(screen.queryByLabelText('Copyable ROSA region login')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Copyable ROSA create operator-roles')).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable ROSA OIDC provider')).toBeInTheDocument();
  });
});
