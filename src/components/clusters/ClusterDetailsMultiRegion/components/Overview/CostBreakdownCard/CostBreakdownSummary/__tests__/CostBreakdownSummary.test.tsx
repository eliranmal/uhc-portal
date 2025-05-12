import React from 'react';

import { render, screen } from '~/testUtils';

import CostBreakdownSummary from '../CostBreakdownSummary';

import { report } from './CostBreakdownSummary.fixtures';

jest.mock('../components/CostBreakdownSummaryChart', () =>
  jest.fn(() => (
    <div data-testid="cost-breakdown-summary-chart">CostBreakdownSummaryChartMock</div>
  )),
);
jest.mock('../utils/CostBreakdownSummaryUtils', () => ({
  getTotal: jest.fn(() => '500.00 USD'),
}));

describe('CostBreakdownSummary', () => {
  it('should render Skeleton when report is not fulfilled', () => {
    // Act
    render(<CostBreakdownSummary report={{ fulfilled: false } as any} />);

    // Assert
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render Title and CostBreakdownSummaryChart when report is fulfilled', () => {
    // Act
    render(<CostBreakdownSummary report={report} />);

    // Assert
    expect(screen.getByText('Total cost')).toBeInTheDocument();
    expect(screen.getByText('500.00 USD')).toBeInTheDocument();
    expect(screen.getByTestId('cost-breakdown-summary-chart')).toBeInTheDocument();
  });
});
