import dayjs from 'dayjs';

import {
  ClusterResource,
  OndemandMetricsAlerts,
  OndemandMetricsClusterOperators,
  SubscriptionCommonFieldsStatus,
} from '~/types/accounts_mgmt.v1';
import { ClusterConsole } from '~/types/clusters_mgmt.v1';
import { ClusterFromSubscription } from '~/types/types';

import config from '../../../../../config';
import { hasCpuAndMemory } from '../../clusterDetailsHelper';

enum monitoringStatuses {
  HEALTHY = 'HEALTHY',
  HAS_ISSUES = 'HAS_ISSUES',
  DISCONNECTED = 'DISCONNECTED',
  NO_METRICS = 'NO_METRICS',
  UPGRADING = 'UPGRADING',
  UNKNOWN = 'UNKNOWN',
}

enum alertsSeverity {
  WARNING = 'warning',
  CRITICAL = 'critical',
  INFO = 'info',
}

enum operatorsStatuses {
  AVAILABLE = 'available',
  FAILING = 'failing',
  UPGRADING = 'upgrading',
  DEGRADED = 'degraded',
  UNKNOWN = 'unknown',
}

enum thresholds {
  WARNING = 0.8,
  DANGER = 0.95,
}

enum monitoringItemTypes {
  NODE = 'node',
  ALERT = 'alert',
  OPERATOR = 'operator',
}

const baseURLProps = {
  rel: 'noopener noreferrer',
  target: '_blank',
};

type monitoringItemLinkType = {
  rel: typeof baseURLProps.rel;
  target: typeof baseURLProps.target;
  href: string;
};

type CommonMetricsData = {
  hasData: boolean;
  numOfIssues: number | null;
  numOfWarnings: number | null;
};

type OperatorMetricsData = CommonMetricsData & {
  data?: Array<OndemandMetricsClusterOperators>;
};

type OndemandMetricsNodes = {
  up: boolean;
  hostname: string;
  internal_ip: string;
  time: string;
};

type NodeMetricsData = CommonMetricsData & {
  data?: Array<OndemandMetricsNodes>;
};

type AlertsMetricsData = CommonMetricsData & {
  data?: Array<OndemandMetricsAlerts>;
};

/**
 * Returns true if an object has a property named 'data' which is not empty,
 * otherwise returns false.
 * @param {Object} obj
 */
const hasData = (obj: any) => (obj.data?.length ?? 0) > 0;

/**
 * Get the number of issues and warnings by some defined criteria for each of them
 * An item is considered an issue if it's value of the health criteria matches the value
 * of the definition of issue for this data, and considered a warning if it
 * matches some other criteria.
 * Alerts data has an issue if alert's severity is 'critical'.
 * Alerts data has a warning if alert's severity is 'warning'.
 * Example: getIssuesAndWarnings(alerts, 'severity', 'critical', 'warning' )
 * @param {Array} data
 * @param {string} criteria
 * @param {string} issuesMatch
 * @param {string} warningsMatch
 */
const getIssuesAndWarnings = ({
  data,
  criteria,
  issuesMatch,
  warningsMatch,
}: {
  data: Array<any>;
  criteria: string;
  issuesMatch: any;
  warningsMatch?: string;
}): { issuesCount: number | null; warningsCount: number | null } => {
  if (!data || data.length === 0) {
    return { issuesCount: null, warningsCount: null };
  }
  let issuesCount = 0;
  let warningsCount = warningsMatch ? 0 : null;

  data.forEach((element) => {
    if (element[criteria] === issuesMatch) {
      issuesCount += 1;
    }
    if (warningsMatch !== null && warningsCount !== null && element[criteria] === warningsMatch) {
      warningsCount += 1;
    }
  });
  return { issuesCount, warningsCount };
};

// metrics are available with max delta of 3 hours from last update
const maxMetricsTimeDelta = 3;

const hasResourceUsageMetrics = <E extends ClusterFromSubscription>(cluster: E) => {
  const metricsLastUpdate = dayjs.utc(cluster.metrics?.cpu.updated_timestamp ?? 0); // according to model, metrics can't be undefined, but since OCMUI-1034 was technical refactoring, this is about to keep functionallity as it was
  const now = dayjs.utc();
  const isArchived = cluster.subscription?.status === SubscriptionCommonFieldsStatus.Archived;
  const isDisconnected =
    cluster.subscription?.status === SubscriptionCommonFieldsStatus.Disconnected;
  const showOldMetrics = !!config.configData.showOldMetrics;

  return (
    !isArchived &&
    !isDisconnected &&
    hasCpuAndMemory(cluster.metrics?.cpu, cluster.metrics?.memory) &&
    (showOldMetrics || now.diff(metricsLastUpdate, 'hour') < maxMetricsTimeDelta)
  );
};

const resourceUsageIssuesHelper = (
  cpu: ClusterResource | undefined,
  memory: ClusterResource | undefined,
  threshold: number,
): number | null => {
  if (!hasCpuAndMemory(cpu, memory)) {
    return null;
  }

  let numOfIssues = 0;
  if (cpu && cpu.total.value && cpu.used.value / cpu.total.value > threshold) {
    numOfIssues += 1;
  }
  if (memory && memory.total.value && memory.used.value / memory.total.value > threshold) {
    numOfIssues += 1;
  }
  return numOfIssues;
};

// Assure that the base console url is well formatted with trailing '/' and ready
// for concatenations.
const consoleURLSetup = (clusterConsole?: ClusterConsole) => {
  if (clusterConsole?.url) {
    let consoleURL = clusterConsole.url;
    if (consoleURL.charAt(consoleURL.length - 1) !== '/') {
      consoleURL += '/';
    }
    return consoleURL;
  }
  return null;
};

function monitoringItemLinkProps(
  clusterConsole: ClusterConsole | undefined,
  itemType: monitoringItemTypes | undefined,
  itemName?: string,
): monitoringItemLinkType | null {
  const consoleURL = consoleURLSetup(clusterConsole);
  let href;
  if (consoleURL) {
    switch (itemType) {
      case monitoringItemTypes.ALERT:
        href = `${consoleURL}monitoring/alerts?orderBy=asc&sortBy=Severity&alert-name=${itemName}`;
        break;
      case monitoringItemTypes.NODE:
        href = `${consoleURL}k8s/cluster/nodes/${itemName}`;
        break;
      case monitoringItemTypes.OPERATOR:
        href = `${consoleURL}k8s/cluster/config.openshift.io~v1~ClusterOperator/${itemName}`;
        break;
      default:
        return null;
    }
    return { ...baseURLProps, href };
  }
  return null;
}

export {
  AlertsMetricsData,
  alertsSeverity,
  CommonMetricsData,
  getIssuesAndWarnings,
  hasData,
  hasResourceUsageMetrics,
  maxMetricsTimeDelta,
  monitoringItemLinkProps,
  monitoringItemLinkType,
  monitoringItemTypes,
  monitoringStatuses,
  NodeMetricsData,
  OndemandMetricsNodes,
  OperatorMetricsData,
  operatorsStatuses,
  resourceUsageIssuesHelper,
  thresholds,
};
