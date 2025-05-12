import React from 'react';

import { checkAccessibility, render, screen, userEvent } from '~/testUtils';

import ClusterLogsToolbar from '../ClusterLogsToolbar';

const mockSetFilter = jest.fn();
const mockSetFlags = jest.fn();
const mockClearFiltersAndFlags = jest.fn();
const mockHistoryPush = jest.fn();

describe('<ClusterLogsToolbar />', () => {
  const today = new Date();
  const tenYearsFromNow = new Date(today.setFullYear(today.getFullYear() + 10))
    .toISOString()
    .split('T')[0];
  const defaultProps = {
    viewOptions: {},
    history: {
      push: mockHistoryPush,
      location: '',
    },
    setFlags: mockSetFlags,
    setFilter: mockSetFilter,
    externalClusterID: '15aaaa74-54be-4c3e-a328-0344e79e3825',
    currentFilter: {
      description: '',
      loggedBy: '',
      timestampFrom: ">= '2024-01-01T00:00:00.000Z'",
    },
    currentFlags: { severityTypes: [], logTypes: [] },
    clearFiltersAndFlags: mockClearFiltersAndFlags,
    isPendingNoData: false,
    createdAt: '2024-01-01',
    clusterID: '282fg0gt74jjb9558ge1poe8m4dlvb07',
    logs: 5,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = render(<ClusterLogsToolbar {...defaultProps} />);

    expect(screen.getByTestId('cluster-history-toolbar')).toBeInTheDocument();

    await checkAccessibility(container);
  });

  it('displays and removes invalid format message', async () => {
    render(<ClusterLogsToolbar {...defaultProps} />);

    const datePicker = screen.getAllByLabelText('Date picker');

    await userEvent.clear(datePicker[0]);
    await userEvent.type(datePicker[0], '2024-qq');
    await userEvent.type(datePicker[0], '{enter}');

    expect(screen.getByText('Invalid: YYYY-MM-DD')).toBeInTheDocument();

    await userEvent.clear(datePicker[0]);
    await userEvent.type(datePicker[0], '2024-01-12');
    await userEvent.type(datePicker[0], '{enter}');

    expect(screen.queryByText('Invalid: YYYY-MM-DD')).toBe(null);
  });

  it.each([
    ['2021-01-01', '2024-01-12', 'The start date cannot be before the cluster creation date.'],
    ['2024-01-10', tenYearsFromNow, 'The end date cannot be in the future.'],
    ['2024-01-10', '2024-01-04', 'The end date cannot be before the start date.'],
  ])(
    'validates min/max and date range for datepicker',
    async (startDate: string, endDate: string, validationMessage: string) => {
      render(<ClusterLogsToolbar {...defaultProps} />);

      const datePicker = screen.getAllByLabelText('Date picker');

      await userEvent.clear(datePicker[0]);
      await userEvent.type(datePicker[0], startDate);
      await userEvent.type(datePicker[0], '{enter}');
      await userEvent.clear(datePicker[1]);
      await userEvent.type(datePicker[1], endDate);
      await userEvent.type(datePicker[1], '{enter}');

      expect(screen.getByText(validationMessage)).toBeInTheDocument();
    },
  );
});
