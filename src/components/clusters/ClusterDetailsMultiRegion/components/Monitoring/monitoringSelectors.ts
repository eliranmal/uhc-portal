import { isClusterUpgrading } from '~/components/clusters/common/clusterStates';
import { SubscriptionCommonFieldsStatus } from '~/types/accounts_mgmt.v1';
import { ClusterFromSubscription } from '~/types/types';

import config from '../../../../../config';

import { AlertNodesOperator } from './model/AlertNodesOperator';
import { IssuesAndWarnings } from './model/IssuesAndWarnings';
import { MonitoringReducerType } from './model/MonitoringReducerType';
import {
  alertsSeverity,
  getIssuesAndWarnings,
  hasData,
  hasResourceUsageMetrics,
  maxMetricsTimeDelta,
  monitoringStatuses,
  operatorsStatuses,
  resourceUsageIssuesHelper,
  thresholds,
} from './monitoringHelper';

const lastCheckInSelector = (cluster: ClusterFromSubscription): Date => {
  const timestamp = cluster.activity_timestamp ? cluster.activity_timestamp : '0001-01-01';
  return new Date(timestamp);
};

const invalidDate = (date: Date): boolean => date.getUTCFullYear() <= 1;

const clusterHealthSelector = (
  cluster: ClusterFromSubscription,
  lastCheckIn: Date,
  discoveredIssues: number | null,
): monitoringStatuses => {
  if (!cluster) {
    return monitoringStatuses.NO_METRICS;
  }
  const diff = new Date().getTime() - lastCheckIn.getTime();
  const hours = diff / 1000 / 60 / 60;
  const showOldMetrics = !!config.configData.showOldMetrics;
  const freshActivity = showOldMetrics || hours < maxMetricsTimeDelta;

  switch (true) {
    case invalidDate(lastCheckIn):
      return monitoringStatuses.UNKNOWN;
    case cluster?.subscription?.status === SubscriptionCommonFieldsStatus.Disconnected:
      return monitoringStatuses.DISCONNECTED;
    case !freshActivity:
      return monitoringStatuses.NO_METRICS;
    case isClusterUpgrading(cluster):
      return monitoringStatuses.UPGRADING;
    case discoveredIssues && discoveredIssues > 0:
      return monitoringStatuses.HAS_ISSUES;
    default:
      return monitoringStatuses.HEALTHY;
  }
};

const alertsNodesOperatorsSelector = (
  { alerts, nodes, operators }: MonitoringReducerType,
  issues: IssuesAndWarnings['issues'],
  warnings: IssuesAndWarnings['warnings'],
  cluster: ClusterFromSubscription,
): AlertNodesOperator => ({
  alerts: {
    ...alerts,
    numOfIssues: issues.alerts,
    numOfWarnings: warnings.alerts,
    hasData: hasData(alerts),
  },
  nodes: {
    ...nodes,
    numOfIssues: issues.nodes,
    numOfWarnings: 0,
    hasData: hasData(nodes),
  },
  operators: {
    ...operators,
    numOfIssues: issues.operators,
    numOfWarnings: warnings.operators,
    hasData: hasData(operators),
  },
  resourceUsage: {
    numOfIssues: issues.resourceUsage,
    numOfWarnings: warnings.resourceUsage,
    hasData: hasResourceUsageMetrics(cluster),
  },
});

const issuesAndWarningsSelector = (
  { alerts, nodes, operators }: MonitoringReducerType,
  cluster: ClusterFromSubscription,
): IssuesAndWarnings => {
  const alertsIssuesAndWarnings = getIssuesAndWarnings({
    data: alerts.data,
    criteria: 'severity',
    issuesMatch: alertsSeverity.CRITICAL,
    warningsMatch: alertsSeverity.WARNING,
  });

  const nodesIssues = getIssuesAndWarnings({
    data: nodes.data,
    criteria: 'up',
    issuesMatch: false,
  });

  const operatorsIssuesAndWarnings = getIssuesAndWarnings({
    data: operators.data,
    criteria: 'condition',
    issuesMatch: operatorsStatuses.FAILING,
    warningsMatch: operatorsStatuses.DEGRADED,
  });

  const resourceUsageIssuesAndWarnings = {
    issuesCount: resourceUsageIssuesHelper(
      cluster?.metrics?.cpu,
      cluster?.metrics?.memory,
      thresholds.DANGER,
    ),
    warningsCount: resourceUsageIssuesHelper(
      cluster?.metrics?.cpu,
      cluster?.metrics?.memory,
      thresholds.WARNING,
    ),
  };

  return {
    issues: {
      alerts: alertsIssuesAndWarnings.issuesCount,
      nodes: nodesIssues.issuesCount,
      operators: operatorsIssuesAndWarnings.issuesCount,
      resourceUsage: resourceUsageIssuesAndWarnings.issuesCount,
      totalCount:
        (alertsIssuesAndWarnings.issuesCount ?? 0) +
        (nodesIssues.issuesCount ?? 0) +
        (operatorsIssuesAndWarnings.issuesCount ?? 0) +
        (resourceUsageIssuesAndWarnings.issuesCount ?? 0),
    },
    warnings: {
      alerts: alertsIssuesAndWarnings.warningsCount,
      operators: operatorsIssuesAndWarnings.warningsCount,
      resourceUsage: resourceUsageIssuesAndWarnings.warningsCount,
    },
  };
};

export {
  alertsNodesOperatorsSelector,
  clusterHealthSelector,
  issuesAndWarningsSelector,
  lastCheckInSelector,
};
