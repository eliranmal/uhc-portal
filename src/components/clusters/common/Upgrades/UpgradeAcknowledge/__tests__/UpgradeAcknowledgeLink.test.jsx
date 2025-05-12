import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import { getHasUnMetClusterAcks } from '../UpgradeAcknowledgeHelpers';
import UpgradeAcknowledgeLink from '../UpgradeAcknowledgeLink/UpgradeAcknowledgeLink';

jest.mock('../UpgradeAcknowledgeHelpers');

const defaultProps = {
  cluster: {
    id: 'myClusterId',
    version: {
      raw_id: 'clusterVersionId',
    },
  },
  upgradeGates: [
    {
      id: 'myUpgradeGatesId',
      sts_only: false,
      value: '4.12',
      version_raw_id_prefix: '4.12',
    },
  ],
  schedules: {
    items: [
      {
        id: 'myUpgradePolicyId',
        schedule_type: 'automatic',
        enable_minor_version_upgrades: false,
        version: '1.2.4',
      },
    ],
  },
};

describe('<UpgradeAcknowledgeLink>', () => {
  it('should show nothing if there is not unmet acknowledgements', () => {
    const { container } = render(
      <UpgradeAcknowledgeLink clusterId="myClusterId" {...defaultProps} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should show link if has unmet acknowledgements', async () => {
    getHasUnMetClusterAcks.mockReturnValue(true);
    const { container } = render(
      <UpgradeAcknowledgeLink clusterId="myClusterId" {...defaultProps} />,
    );

    expect(screen.getByRole('link', { name: 'Warning Approval required' })).toHaveAttribute(
      'href',
      '/openshift/details/myClusterId#updateSettings',
    );
    await checkAccessibility(container);
  });
});
