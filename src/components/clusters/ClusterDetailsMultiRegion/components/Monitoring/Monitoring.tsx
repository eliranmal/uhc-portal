import React from 'react';
import { useDispatch } from 'react-redux';

import { Card, CardBody, CardTitle, Title } from '@patternfly/react-core';

import { useGlobalState } from '~/redux/hooks';
import { ClusterFromSubscription } from '~/types/types';

import { ClusterHealthCard } from './components/ClusterHealthCard';
import { MonitoringEmptyState } from './components/MonitoringEmptyState';
import MonitoringList from './components/MonitoringList';
import { clearMonitoringState } from './MonitoringActions';
import { monitoringStatuses } from './monitoringHelper';
import {
  alertsNodesOperatorsSelector,
  clusterHealthSelector,
  issuesAndWarningsSelector,
  lastCheckInSelector,
} from './monitoringSelectors';

import './Monitoring.scss';

type MonitoringProps = {
  cluster: ClusterFromSubscription;
};

const Monitoring = ({ cluster }: MonitoringProps) => {
  const dispatch = useDispatch();
  const monitoring = useGlobalState((state) => state.monitoring);
  const issuesAndWarnings = issuesAndWarningsSelector(monitoring, cluster);
  const { issues, warnings } = issuesAndWarnings;
  const totalIssuesCount = issuesAndWarnings.issues.totalCount;
  const lastCheckIn = lastCheckInSelector(cluster);
  const healthStatus = clusterHealthSelector(cluster, lastCheckIn, totalIssuesCount);
  const discoveredIssues = issues.totalCount;

  const { alerts, nodes, operators, resourceUsage } = React.useMemo(
    () => alertsNodesOperatorsSelector(monitoring, issues, warnings, cluster),
    [cluster, warnings, issues, monitoring],
  );

  React.useEffect(
    () => () => {
      // Ignoring since all actions will be be refactored using react query
      // @ts-ignore
      dispatch(clearMonitoringState());
    },
    //  mimics componentWillUnmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  switch (healthStatus) {
    case monitoringStatuses.DISCONNECTED:
      return (
        <>
          <ClusterHealthCard
            lastCheckIn={lastCheckIn}
            status={healthStatus}
            discoveredIssues={discoveredIssues}
          />
          <MonitoringEmptyState lastCheckIn={lastCheckIn} />
        </>
      );
    case monitoringStatuses.NO_METRICS:
      return (
        <MonitoringEmptyState lastCheckIn={lastCheckIn}>
          <p>
            Monitoring data is not available if a cluster goes more than three hours without sending
            metrics.
            <br />
            Check the cluster&apos;s web console if you think that this cluster should be sending
            metrics.
          </p>
        </MonitoringEmptyState>
      );
    case monitoringStatuses.UNKNOWN:
      return (
        <MonitoringEmptyState hideLastCheckIn>
          <p>
            Monitoring data is not available - cluster did not send any metrics.
            <br />
            Check the cluster&apos;s web console if you think that this cluster should be sending
            metrics.
          </p>
        </MonitoringEmptyState>
      );
    default:
      return (
        <>
          <ClusterHealthCard
            lastCheckIn={lastCheckIn}
            status={healthStatus}
            discoveredIssues={discoveredIssues}
          />
          <Card className="ocm-c-monitoring-status__card">
            <CardTitle className="ocm-c-monitoring-status__card--header">
              <Title headingLevel="h2" className="card-title">
                Status
              </Title>
            </CardTitle>
            <CardBody className="ocm-c-monitoring-status__card--body">
              <MonitoringList
                cluster={cluster}
                alerts={alerts}
                nodes={nodes}
                operators={operators}
                resourceUsage={resourceUsage}
              />
            </CardBody>
          </Card>
        </>
      );
  }
};

export default Monitoring;
