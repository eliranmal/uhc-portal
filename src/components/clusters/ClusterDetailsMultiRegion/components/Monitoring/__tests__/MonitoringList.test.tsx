import React from 'react';

import { checkAccessibility, render } from '~/testUtils';

import MonitoringList from '../components/MonitoringList';

import {
  mockAlerts,
  mockNodes,
  mockOCPActiveClusterDetails,
  mockOperators,
  resourceUsageWithIssues,
} from './Monitoring.fixtures';

describe('<MonitoringList />', () => {
  const defaultProps = {
    cluster: mockOCPActiveClusterDetails,
    operators: {
      data: mockOperators.data,
      hasData: true,
      numOfIssues: 2,
      numOfWarnings: 2,
    },
    nodes: {
      data: mockNodes.data,
      hasData: true,
      numOfIssues: 2,
      numOfWarnings: 2,
    },
    alerts: {
      data: mockAlerts.data,
      hasData: true,
      numOfIssues: 2,
      numOfWarnings: 2,
    },
    resourceUsage: {
      ...resourceUsageWithIssues,
      hasData: true,
      numOfIssues: 2,
      numOfWarnings: 2,
    },
  };
  it('is accessible', async () => {
    const { container } = render(<MonitoringList {...defaultProps} />);
    await checkAccessibility(container);
  });
});
