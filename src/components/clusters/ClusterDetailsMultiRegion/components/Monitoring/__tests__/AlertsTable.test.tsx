import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import AlertsTable from '../components/AlertsTable';

import { mockAlerts, mockWatchdog } from './Monitoring.fixtures';

describe('<AlertsTable />', () => {
  it('should render empty state when there are no alerts', async () => {
    const { container } = render(<AlertsTable alerts={mockWatchdog} />);

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(screen.getByText('No alerts firing')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('should render table when there are alerts', async () => {
    const { container } = render(<AlertsTable alerts={mockAlerts.data} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();

    const shownAlerts = mockAlerts.data.filter((alert) => alert.severity !== 'none');
    expect(container.querySelectorAll('tbody tr')).toHaveLength(shownAlerts.length);
    await checkAccessibility(container);
  });

  it('should render table with links there are alerts and a console URL', () => {
    const newAlerts = [
      ...mockAlerts.data,
      {
        name: 'myTestingAlert',
        severity: 'critical',
      },
    ];
    render(<AlertsTable alerts={newAlerts} clusterConsole={{ url: 'http://example.com/' }} />);

    expect(screen.getByRole('link', { name: 'myTestingAlert' })).toHaveAttribute(
      'href',
      `http://example.com/monitoring/alerts?orderBy=asc&sortBy=Severity&alert-name=${'myTestingAlert'}`,
    );
  });
});
