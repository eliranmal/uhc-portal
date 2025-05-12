import { isHibernating, isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import {
  ClusterResource,
  Subscription,
  SubscriptionCommonFieldsStatus,
} from '~/types/accounts_mgmt.v1';
import { ClusterState } from '~/types/clusters_mgmt.v1/enums';
import { ClusterFromSubscription } from '~/types/types';

import {
  defaultClusterFromSubscription,
  defaultSubscription,
} from '../../common/__tests__/defaultClusterFromSubscription.fixtures';
import {
  getSubscriptionLastReconciledDate,
  hasCpuAndMemory,
  isArchivedSubscription,
  isMultiAZ,
  isReadyForAwsAccessActions,
  isReadyForIdpActions,
  isReadyForRoleAccessActions,
} from '../clusterDetailsHelper';

import { defaultMetric } from './clusterDetailsDefaultMetric.fixtures';

jest.mock('~/components/clusters/common/clusterStates');
const isHypershiftClusterMock = isHypershiftCluster as jest.Mock;
const isHibernatingMock = isHibernating as jest.Mock;

describe('clusterDetailsHelper', () => {
  describe('hasCpuAndMemory', () => {
    const defaultCPU = defaultMetric.cpu;
    const defaultMemory = defaultMetric.memory;
    it.each([
      [undefined, defaultMemory, false],
      [defaultCPU, undefined, false],
      [defaultCPU, { ...defaultMemory, updated_timestamp: '0001-01-01T00:00:00Z' }, false],
      [{ ...defaultCPU, updated_timestamp: '0001-01-01T00:00:00Z' }, defaultMemory, false],
      [
        { ...defaultCPU, updated_timestamp: new Date().toISOString() },
        { ...defaultMemory, updated_timestamp: new Date().toISOString() },
        true,
      ],
    ])(
      'when cpu is %o and memory %o to be %p',
      (
        cpu: ClusterResource | undefined,
        memory: ClusterResource | undefined,
        expected: boolean,
      ) => {
        expect(hasCpuAndMemory(cpu, memory)).toBe(expected);
      },
    );
  });

  describe('getSubscriptionLastReconciledDate', () => {
    it.each([
      [undefined, false],
      ['2019-12-22T09:45:57.158566Z', new Date('2019-12-22T09:45:57.158566Z').toLocaleString()],
      ['0001-01-01T00:00:00Z', false],
    ])(
      'when last_reconcile_date is %p result shoule be %p',
      (lastReconcileDate: string | undefined, expected: boolean | string) => {
        const subscription: Readonly<Subscription> = {
          ...defaultSubscription,
          last_reconcile_date: lastReconcileDate,
        };
        expect(getSubscriptionLastReconciledDate(subscription)).toBe(expected);
      },
    );
  });

  describe('isMultiAZ', () => {
    it.each([
      [true, undefined, false],
      [true, false, false],
      [true, true, false],
      [false, true, true],
      [false, false, false],
      [false, undefined, false],
    ])(
      'isHypershiftCluster result: %p, multi_az: %p. It returns %p',
      (
        isHypershiftClusterResult: boolean,
        multiAz: boolean | undefined,
        expectedResult: boolean,
      ) => {
        const defaultCluster: Readonly<ClusterFromSubscription> = {
          multi_az: multiAz,
        } as ClusterFromSubscription;
        isHypershiftClusterMock.mockReturnValueOnce(isHypershiftClusterResult);
        expect(isMultiAZ(defaultCluster)).toBe(expectedResult);
      },
    );
  });

  describe('isArchivedSubscription', () => {
    it.each([
      [SubscriptionCommonFieldsStatus.Archived, true],
      [SubscriptionCommonFieldsStatus.Deprovisioned, true],
      [SubscriptionCommonFieldsStatus.Active, false],
      [SubscriptionCommonFieldsStatus.Disconnected, false],
      [SubscriptionCommonFieldsStatus.Reserved, false],
      [SubscriptionCommonFieldsStatus.Stale, false],
      [undefined, false],
    ])(
      'status: %p. It returns %p',
      (status: SubscriptionCommonFieldsStatus | undefined, expectedResult: boolean) => {
        const defaultCluster: Readonly<ClusterFromSubscription> = {
          ...defaultClusterFromSubscription,
          subscription: {
            ...defaultSubscription,
            status,
          },
        };
        expect(isArchivedSubscription(defaultCluster)).toBe(expectedResult);
      },
    );
  });

  describe('isReadyForRoleAccessActions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it.each([
      [false, 'consoleurlvalue', ClusterState.ready, true, false, false],
      [true, 'consoleurlvalue', ClusterState.ready, true, false, true],
      [true, '', ClusterState.ready, true, false, true],
      [true, undefined, ClusterState.ready, true, false, true],
      [true, 'consoleurlvalue', undefined, true, false, true],
      [true, 'consoleurlvalue', undefined, false, false, false],
      [true, 'consoleurlvalue', ClusterState.ready, true, true, false],
    ])(
      'managed: %p, consoleUrl: %p, clusterState: %p, isHibernatingResult: %p, isArchivedSubscription: %p. It returns %p',
      (
        managed: boolean | undefined,
        url: string | undefined,
        state: string | ClusterState | undefined,
        isHibernatingResult: boolean,
        isArchivedSubscription: boolean,
        expectedResult: boolean,
      ) => {
        const defaultCluster: Readonly<ClusterFromSubscription> = {
          ...defaultClusterFromSubscription,
          managed,
          console: {
            url,
          },
          state,
          subscription: {
            ...defaultSubscription,
            status: isArchivedSubscription ? SubscriptionCommonFieldsStatus.Archived : undefined,
          },
        };
        isHibernatingMock.mockReturnValue(isHibernatingResult);
        expect(isReadyForRoleAccessActions(defaultCluster)).toBe(expectedResult);
      },
    );
  });

  describe('isReadyForAwsAccessActions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it.each([
      [true, 'consoleurlvalue', ClusterState.ready, true, false, 'aws', false, true],
      [true, 'consoleurlvalue', ClusterState.ready, true, false, 'X', false, false],
      [true, 'consoleurlvalue', ClusterState.ready, true, false, undefined, false, false],
      [true, 'consoleurlvalue', ClusterState.ready, true, false, 'aws', true, false],
      [true, 'consoleurlvalue', ClusterState.ready, true, false, 'aws', undefined, true],
    ])(
      'managed: %p, consoleUrl: %p, clusterState: %p, isHibernatingResult: %p, isArchivedSubscription: %p. It returns %p',
      (
        managed: boolean | undefined,
        url: string | undefined,
        state: string | ClusterState | undefined,
        isHibernatingResult: boolean,
        isArchivedSubscription: boolean,
        cloudProviderId: string | undefined,
        ccsEnabled: boolean | undefined,
        expectedResult: boolean,
      ) => {
        const defaultCluster: Readonly<ClusterFromSubscription> = {
          ...defaultClusterFromSubscription,
          managed,
          console: {
            url,
          },
          state,
          subscription: {
            ...defaultSubscription,
            status: isArchivedSubscription ? SubscriptionCommonFieldsStatus.Archived : undefined,
          },
          cloud_provider: {
            id: cloudProviderId,
          },
          ccs: {
            enabled: ccsEnabled,
          },
        };
        isHibernatingMock.mockReturnValue(isHibernatingResult);
        expect(isReadyForAwsAccessActions(defaultCluster)).toBe(expectedResult);
      },
    );
  });

  describe('isReadyForIdpActions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it.each([
      [true, undefined, ClusterState.ready, true, false, true],
      [true, undefined, ClusterState.ready, false, false, false],
    ])(
      'managed: %p, consoleUrl: %p, clusterState: %p, isHypershiftClusterResult: %p, isArchivedSubscription: %p. It returns %p',
      (
        managed: boolean | undefined,
        url: string | undefined,
        state: string | ClusterState | undefined,
        isHypershiftClusterResult: boolean,
        isArchivedSubscription: boolean,
        expectedResult: boolean,
      ) => {
        const defaultCluster: Readonly<ClusterFromSubscription> = {
          ...defaultClusterFromSubscription,
          managed,
          console: {
            url,
          },
          state,
          subscription: {
            ...defaultSubscription,
            status: isArchivedSubscription ? SubscriptionCommonFieldsStatus.Archived : undefined,
          },
        };
        isHypershiftClusterMock.mockReturnValue(isHypershiftClusterResult);
        expect(isReadyForIdpActions(defaultCluster)).toBe(expectedResult);
      },
    );
  });
});
