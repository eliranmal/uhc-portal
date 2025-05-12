import React from 'react';

import { Card, CardTitle } from '@patternfly/react-core';

import { monitoringStatuses } from '../monitoringHelper';

import { ClusterHealthStatus } from './ClusterHealthStatus';

type ClusterHealthCardProps = {
  status: string;
  discoveredIssues?: number | null;
  lastCheckIn?: Date | number | string;
};

const ClusterHealthCard = ({
  status = monitoringStatuses.NO_METRICS,
  discoveredIssues = null,
  lastCheckIn,
}: ClusterHealthCardProps) => (
  <Card className="ocm-c-monitoring-health__card">
    <CardTitle className="ocm-c-monitoring-health__card--header">
      <ClusterHealthStatus
        lastCheckIn={lastCheckIn}
        discoveredIssues={discoveredIssues}
        status={status}
      />
    </CardTitle>
  </Card>
);

export { ClusterHealthCard };
