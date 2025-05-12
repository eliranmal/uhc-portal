import { ClusterFromSubscription } from '~/types/types';

import { isClusterUpgrading } from '../../../../common/clusterStates';
import { MonitoringReducerType } from '../model/MonitoringReducerType';
import { monitoringStatuses } from '../monitoringHelper';
import {
  clusterHealthSelector,
  issuesAndWarningsSelector,
  lastCheckInSelector,
} from '../monitoringSelectors';

import {
  makeFreshCheckIn,
  makeFutureDate,
  makeStaleCheckIn,
  mockAlerts,
  mockNodes,
  mockOCPActiveClusterDetails,
  mockOCPDisconnectedClusterDetails,
  mockOperators,
  resourceUsageWithIssues,
} from './Monitoring.fixtures';

jest.mock('../../../../common/clusterStates');

const isClusterUpgradingMock = isClusterUpgrading as jest.Mock;

describe('lastCheckInSelector', () => {
  it('returns something valid if activity_timestamp is missing (unrealistic)', () => {
    const checkIn = lastCheckInSelector({} as ClusterFromSubscription);
    expect(checkIn).toBeInstanceOf(Date);
    expect(checkIn.getTime() < new Date('1900-01-01').getTime()); // far in the past.
  });
});

describe('clusterHealthSelector', () => {
  describe('OCP', () => {
    it('should return DISCONNECTED when subscription Disconnected and metrics are stale', () => {
      const result = clusterHealthSelector(
        mockOCPDisconnectedClusterDetails,
        makeStaleCheckIn(),
        null,
      );
      expect(result).toBe(monitoringStatuses.DISCONNECTED);
    });

    it.todo(
      "if fresh metrics arrived for a Disconnected cluster, but subscription didn't yet switch to Active, what should we return?",
    );

    it('should return NO_METRICS when metrics are stale', () => {
      const result = clusterHealthSelector(mockOCPActiveClusterDetails, makeStaleCheckIn(), null);
      expect(result).toBe(monitoringStatuses.NO_METRICS);
    });

    it('should return UPGRADING when metrics are running', () => {
      isClusterUpgradingMock.mockReturnValueOnce(true);
      const result = clusterHealthSelector(mockOCPActiveClusterDetails, makeFreshCheckIn(), 0);
      expect(result).toBe(monitoringStatuses.UPGRADING);
    });

    it('should return HEALTHY when metrics are fresh & good', () => {
      isClusterUpgradingMock.mockReturnValueOnce(false);
      const result = clusterHealthSelector(mockOCPActiveClusterDetails, makeFreshCheckIn(), 0);
      expect(result).toBe(monitoringStatuses.HEALTHY);
    });

    it("handles timestamp in future (relative to browser's clock)", () => {
      isClusterUpgradingMock.mockReturnValueOnce(false);
      const result = clusterHealthSelector(mockOCPActiveClusterDetails, makeFutureDate(), 0);
      expect(result).toBe(monitoringStatuses.HEALTHY);
    });
  });

  describe('issuesAndWarningsSelector', () => {
    const cluster = {
      ...mockOCPActiveClusterDetails,
      metrics: {
        ...resourceUsageWithIssues,
        memory: {
          ...resourceUsageWithIssues.memory,
          updated_timestamp: new Date().toISOString(),
        },
        cpu: {
          ...resourceUsageWithIssues.cpu,
          updated_timestamp: new Date().toISOString(),
        },
      },
    } as ClusterFromSubscription;

    const monitoring = {
      alerts: mockAlerts,
      nodes: { data: [...mockNodes.data.slice(0, 2)] },
      operators: mockOperators,
    } as MonitoringReducerType;

    it('should count issues, warnings and total issues', () => {
      const expected = {
        issues: {
          alerts: 2,
          nodes: 0,
          operators: 1,
          resourceUsage: 2,
          totalCount: 5,
        },
        warnings: {
          alerts: 3,
          operators: 0,
          resourceUsage: 2,
        },
      };

      expect(issuesAndWarningsSelector(monitoring, cluster)).toEqual(expected);
    });
  });
});
