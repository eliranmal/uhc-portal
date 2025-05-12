import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import { ClusterOperatorStatus } from '../components/ClusterOperatorStatus';
import { operatorsStatuses } from '../monitoringHelper';

describe('ClusterOperatorStatus', () => {
  describe('is accessible', () =>
    it.each([...Object.keys(operatorsStatuses).map((e) => [e]), ['']])(
      `for condition "%s"`,
      async (condition?: string) => {
        // Act
        const { container } = render(<ClusterOperatorStatus condition={condition} />);

        // Assert
        await checkAccessibility(container);
      },
    ));
  describe('it properly renders', () =>
    it.each([
      [operatorsStatuses.AVAILABLE, 'Available', 'success'],
      [operatorsStatuses.FAILING, 'Failing', 'danger'],
      [operatorsStatuses.UPGRADING, 'Updating', 'status-icon'],
      [operatorsStatuses.DEGRADED, 'Degraded', 'warning'],
      [operatorsStatuses.UNKNOWN, 'Unknown', 'status-icon'],
      ['', 'Unknown', 'status-icon'],
    ])(
      `for condition "%s"`,
      async (condition: string, expectedText: string, expectedClass: string) => {
        // Act
        render(<ClusterOperatorStatus condition={condition} />);

        // Assert
        screen.getByText(expectedText);
        expect(screen.getByRole('img', { hidden: true })).toHaveClass(expectedClass);
      },
    ));
});
