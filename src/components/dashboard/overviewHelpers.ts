import { ClusterFromSubscription } from '~/types/types';

import { hasCpuAndMemory } from '../clusters/ClusterDetailsMultiRegion/clusterDetailsHelper';
import { InsightsRuleCategories } from '../clusters/ClusterDetailsMultiRegion/components/Insights/InsightsConstants';
import {
  hasResourceUsageMetrics,
  resourceUsageIssuesHelper,
  thresholds,
} from '../clusters/ClusterDetailsMultiRegion/components/Monitoring/monitoringHelper';

const RULE_SEVERITIES: { [key: number]: string } = {
  1: 'Low',
  2: 'Moderate',
  3: 'Important',
  4: 'Critical',
};

const getSeverityName = (severityLevel: keyof typeof RULE_SEVERITIES): string =>
  RULE_SEVERITIES[severityLevel];

const getIssuesCount = <E extends ClusterFromSubscription>(cluster?: E) => {
  const metrics = cluster?.metrics ?? undefined;
  if (!metrics) {
    return 0;
  }

  const { cpu, memory } = metrics;
  // For each entity, check if there is data available
  const clustersAlertsFiringCritical = metrics.critical_alerts_firing ?? 0;
  const clusterOperatorsConditionFailing = metrics.operators_condition_failing ?? 0;

  const hasResourceUsageData =
    cluster && hasCpuAndMemory(cpu, memory) && hasResourceUsageMetrics(cluster);
  const resourceUsageIssues = hasResourceUsageData
    ? resourceUsageIssuesHelper(cpu, memory, thresholds.DANGER)
    : 0;

  // Sum all issues
  return (
    clustersAlertsFiringCritical + (resourceUsageIssues ?? 0) + clusterOperatorsConditionFailing
  );
};

const groupTagHitsByGroups = (
  hits: Record<string, number> | undefined,
  groups?: InsightsRuleCategories[],
) =>
  groups
    ?.sort((a, b) => a.title.localeCompare(b.title))
    .reduce(
      (acc, { tags, title }) => ({
        ...acc,
        [title]: {
          count: tags.reduce((num, item) => num + (hits?.[item] ?? 0), 0),
          tags: tags.join(','),
        },
      }),
      {},
    );

export { getIssuesCount, groupTagHitsByGroups, getSeverityName };

export default getIssuesCount;
