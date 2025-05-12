import React from 'react';

import {
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

type MonitoringEmptyStateProps = {
  children?: React.ReactNode | null;
  hideLastCheckIn?: boolean;
  hideIcon?: boolean;
  title?: string;
  lastCheckIn?: Date | number | string;
};

const MonitoringEmptyState = ({
  children = null,
  hideLastCheckIn = false,
  lastCheckIn,
  hideIcon = false,
  title = 'Monitoring data is not available',
}: MonitoringEmptyStateProps) => (
  <EmptyState>
    {!hideIcon && <EmptyStateIcon icon={ExclamationTriangleIcon} />}
    <EmptyStateHeader titleText={title} headingLevel="h5" />
    <EmptyStateBody>
      {children}
      {!hideLastCheckIn && (
        <p>
          {/* @ts-ignore */}
          Last Check-in: <DateFormat date={lastCheckIn} type="relative" />
        </p>
      )}
    </EmptyStateBody>
  </EmptyState>
);

export { MonitoringEmptyState };
