import React from 'react';

import { DataList } from '@patternfly/react-core';

import { SubscriptionCommonFieldsStatus } from '~/types/accounts_mgmt.v1';
import { ClusterFromSubscription } from '~/types/types';

import { metricsStatusMessages } from '../../../../common/ResourceUsage/constants';
import ResourceUsage from '../../../../common/ResourceUsage/ResourceUsage';
import {
  AlertsMetricsData,
  CommonMetricsData,
  hasResourceUsageMetrics,
  NodeMetricsData,
  OperatorMetricsData,
} from '../monitoringHelper';

import AlertsTable from './AlertsTable';
import { ClusterOperators } from './ClusterOperators';
import { MonitoringEmptyState } from './MonitoringEmptyState';
import { MonitoringListItem } from './MonitoringListItem';
import { NodesTable } from './NodesTable';

type MonitoringListProps = {
  cluster: ClusterFromSubscription;
  alerts: AlertsMetricsData;
  nodes: NodeMetricsData;
  operators: OperatorMetricsData;
  resourceUsage: CommonMetricsData;
};

const MonitoringList = ({
  cluster,
  alerts,
  nodes,
  operators,
  resourceUsage,
}: MonitoringListProps) => {
  const [expanded, setExpanded] = React.useState<string[]>([]);

  const toggle = (sectionId: string) => {
    const index = expanded.indexOf(sectionId);
    const newExpanded =
      index >= 0
        ? [...expanded.slice(0, index), ...expanded.slice(index + 1, expanded.length)]
        : [...expanded, sectionId];

    setExpanded(newExpanded);
  };

  const metricsAvailable = hasResourceUsageMetrics(cluster);
  const isArchived = cluster.subscription?.status === SubscriptionCommonFieldsStatus.Archived;

  const clusterState = cluster.state ? cluster.state : metricsStatusMessages.default;
  const metricsStatusMessage = isArchived ? metricsStatusMessages.archived : clusterState;

  const EmptyState = (
    <MonitoringEmptyState hideLastCheckIn hideIcon title="No data available for this metric">
      <p>Please check back later</p>
    </MonitoringEmptyState>
  );

  return (
    <DataList aria-label="monitoring-table">
      <MonitoringListItem
        title="Alerts firing"
        numOfIssues={alerts.numOfIssues}
        numOfWarnings={alerts.numOfWarnings}
        toggle={toggle}
        expanded={expanded}
        hasData={alerts.hasData}
      >
        {alerts.hasData ? (
          <AlertsTable alerts={alerts.data} clusterConsole={cluster.console} />
        ) : (
          EmptyState
        )}
      </MonitoringListItem>
      {nodes.hasData && (
        // hide nodes if not available, this metric is missing in OpenShift >= 4.3.8
        <MonitoringListItem
          title="Nodes"
          numOfIssues={nodes.numOfIssues}
          toggle={toggle}
          expanded={expanded}
          hasData={nodes.hasData}
        >
          <NodesTable nodes={nodes.data} clusterConsole={cluster.console} />
        </MonitoringListItem>
      )}
      <MonitoringListItem
        title="Cluster operators"
        numOfIssues={operators.numOfIssues}
        numOfWarnings={operators.numOfWarnings}
        toggle={toggle}
        expanded={expanded}
        hasData={operators.hasData}
      >
        {operators.hasData ? (
          <ClusterOperators operators={operators.data} clusterConsole={cluster.console} />
        ) : (
          EmptyState
        )}
      </MonitoringListItem>
      <MonitoringListItem
        title="Resource usage"
        numOfIssues={resourceUsage.numOfIssues}
        numOfWarnings={resourceUsage.numOfWarnings}
        toggle={toggle}
        expanded={expanded}
        hasData={resourceUsage.hasData}
      >
        {resourceUsage.hasData ? (
          <div className="metrics-chart">
            <ResourceUsage
              cpu={{
                used: cluster.metrics.cpu.used,
                total: cluster.metrics.cpu.total,
                updated_timestamp: cluster.metrics.query_timestamp
                  ? cluster.metrics.query_timestamp
                  : '',
              }}
              memory={{
                used: cluster.metrics.memory.used,
                total: cluster.metrics.memory.total,
                updated_timestamp: cluster.metrics.query_timestamp
                  ? cluster.metrics.query_timestamp
                  : '',
              }}
              metricsAvailable={metricsAvailable}
              metricsStatusMessage={metricsStatusMessage}
              type="threshold"
            />
          </div>
        ) : (
          EmptyState
        )}
      </MonitoringListItem>
    </DataList>
  );
};

export default MonitoringList;
