import { InsightsRuleCategories } from '~/components/clusters/ClusterDetailsMultiRegion/components/Insights/InsightsConstants';
import { ClusterFromSubscription } from '~/types/types';

import { hasCpuAndMemory } from '../../clusters/ClusterDetailsMultiRegion/clusterDetailsHelper';
import {
  hasResourceUsageMetrics,
  resourceUsageIssuesHelper,
} from '../../clusters/ClusterDetailsMultiRegion/components/Monitoring/monitoringHelper';
import { getIssuesCount, getSeverityName, groupTagHitsByGroups } from '../overviewHelpers';

jest.mock('../../clusters/ClusterDetailsMultiRegion/clusterDetailsHelper');
jest.mock('../../clusters/ClusterDetailsMultiRegion/components/Monitoring/monitoringHelper');

describe('groupTagHitsByGroups', () => {
  it.each([
    [1, 'Low'],
    [2, 'Moderate'],
    [3, 'Important'],
    [4, 'Critical'],
  ])('The name for Severity %p is %p', (num, expected) =>
    expect(getSeverityName(num)).toBe(expected),
  );

  describe('getIssuesCount', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    const clusterWithEmptyMetrics = { metrics: {} };
    const clusterWithCriticalAlertsFiring = { metrics: { critical_alerts_firing: 4 } };
    const clusterWithOperatorsConditionFailing = { metrics: { operators_condition_failing: 2 } };
    const clusterWithCritialAlertsFiringAndOperatorsConditionFailing = {
      metrics: { critical_alerts_firing: 4, operators_condition_failing: 2 },
    };

    it.each([
      ['when cluster undefined', undefined, false, false, false, 0],
      ['when cluster has empty metrics', clusterWithEmptyMetrics, false, false, false, 0],
      [
        'when cluster has critical alerts firing',
        clusterWithCriticalAlertsFiring,
        false,
        false,
        false,
        4,
      ],
      [
        'when cluster has operators condition failing',
        clusterWithOperatorsConditionFailing,
        false,
        false,
        false,
        2,
      ],
      ['when hasResourceUsageData', clusterWithEmptyMetrics, true, true, 1, 1],
      [
        'when cluster has critical alerts firing and hasResourceUsageData',
        clusterWithCriticalAlertsFiring,
        true,
        true,
        1,
        5,
      ],
      [
        'when cluster has critical alerts firing, operators condition failing and hasResourceUsageData',
        clusterWithCritialAlertsFiringAndOperatorsConditionFailing,
        true,
        true,
        1,
        7,
      ],
    ])(
      '%p',
      (
        title,
        cluster,
        hasCpuAndMemoryResult,
        hasResourceUsageMetricsResult,
        resourceUsageIssuesHelperResult,
        expectedIssues,
      ) => {
        // Arrange
        (hasCpuAndMemory as jest.Mock).mockReturnValueOnce(hasCpuAndMemoryResult);
        (hasResourceUsageMetrics as jest.Mock).mockReturnValueOnce(hasResourceUsageMetricsResult);
        (resourceUsageIssuesHelper as jest.Mock).mockReturnValueOnce(
          resourceUsageIssuesHelperResult,
        );

        // Act
        const result = getIssuesCount(cluster as ClusterFromSubscription);

        // Assert
        expect(result).toBe(expectedIssues);
      },
    );
  });

  describe('groupTagHitsByGroups', () => {
    let hits = { tag1: 3, tag2: 2, tag3: 1, tag42: 0 };
    let groups: InsightsRuleCategories[] = [];

    const okReturnValue = {
      Group1: { count: 3, tags: 'tag1' },
      Group2: { count: 5, tags: 'tag1,tag2' },
      Group3: { count: 6, tags: 'tag1,tag2,tag3' },
    };

    beforeEach(() => {
      hits = { tag1: 3, tag2: 2, tag3: 1, tag42: 0 };
      groups = [
        { title: 'Group1', tags: ['tag1'] },
        { title: 'Group2', tags: ['tag1', 'tag2'] },
        { title: 'Group3', tags: ['tag1', 'tag2', 'tag3'] },
      ];
    });

    it('returns when hits and/or group are undefined', () =>
      expect(groupTagHitsByGroups(undefined, undefined)).toBe(undefined));

    it('returns groups with theirs count and tags', () =>
      expect(groupTagHitsByGroups(hits, groups)).toStrictEqual(okReturnValue));

    it('does not count unknown tags', () => {
      groups[2].tags = ['tag42'];
      expect(groupTagHitsByGroups(hits, groups)).toStrictEqual({
        Group1: { count: 3, tags: 'tag1' },
        Group2: { count: 5, tags: 'tag1,tag2' },
        Group3: { count: 0, tags: 'tag42' },
      });
    });

    it('does not count tags not presented in groups', () => {
      hits.tag42 = 2;
      expect(groupTagHitsByGroups(hits, groups)).toStrictEqual(okReturnValue);
    });
  });
});
