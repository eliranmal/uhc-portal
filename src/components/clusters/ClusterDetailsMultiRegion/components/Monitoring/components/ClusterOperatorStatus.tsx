import React from 'react';

import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { InProgressIcon } from '@patternfly/react-icons/dist/esm/icons/in-progress-icon';
import { UnknownIcon } from '@patternfly/react-icons/dist/esm/icons/unknown-icon';

import { operatorsStatuses } from '../monitoringHelper';

type ClusterOperatorStatusProps = {
  condition?: string;
};

const Element = ({ icon, status }: { icon: React.ReactNode; status: string }) => (
  <>
    {icon}
    <span>{status}</span>{' '}
  </>
);

const ClusterOperatorStatus = ({ condition }: ClusterOperatorStatusProps) => {
  switch (condition) {
    case operatorsStatuses.AVAILABLE:
      return (
        <Element icon={<CheckCircleIcon className="status-icon success" />} status="Available" />
      );
    case operatorsStatuses.FAILING:
      return (
        <Element icon={<ExclamationCircleIcon className="status-icon danger" />} status="Failing" />
      );
    case operatorsStatuses.UPGRADING:
      return <Element icon={<InProgressIcon className="status-icon" />} status="Updating" />;
    case operatorsStatuses.DEGRADED:
      return (
        <Element
          icon={<ExclamationTriangleIcon className="status-icon warning" />}
          status="Degraded"
        />
      );
    default:
      return <Element icon={<UnknownIcon className="status-icon" />} status="Unknown" />;
  }
};

export { ClusterOperatorStatus };
