import dayjs from 'dayjs';
import { produce } from 'immer';

import { defaultMetric } from '~/components/clusters/common/__tests__/clusterStates.fixtures';
import {
  defaultClusterFromSubscription,
  defaultSubscription,
} from '~/components/clusters/common/__tests__/defaultClusterFromSubscription.fixtures';
import { OneMetric, SubscriptionCommonFieldsStatus } from '~/types/accounts_mgmt.v1';
import { ClusterFromSubscription } from '~/types/types';

const mockNodes = {
  data: [
    {
      internal_ip: '10.0.139.97:9537',
      hostname: 'ip-10-0-139-97.us-west-2.compute.internal',
      up: true,
      time: '1562168629557',
    },
    {
      internal_ip: '10.0.152.98',
      hostname: 'ip-10-0-133-185.ec2.internal',
      up: true,
      time: '1562168629557',
    },
    {
      internal_ip: '10.0.143.198',
      hostname: 'ip-10-0-143-198.ec2.internal',
      up: false,
      time: '1562168629557',
    },
  ],
};

const mockAlerts = {
  data: [
    {
      name: 'KubeDeploymentReplicasMismatch',
      severity: 'warning',
    },
    {
      name: 'KubeDeploymentReplicasMismatch',
      severity: 'critical',
    },
    {
      name: 'SomeAlert',
      severity: 'critical',
    },
    {
      name: 'SomeOtherAlert',
      severity: 'warning',
    },
    {
      name: 'KubeDeploymentReplicasMismatch',
      severity: 'warning',
    },
    {
      name: 'test',
      severity: 'info',
    },
    {
      name: 'DeadMansSwitch',
      severity: 'none',
    },
    {
      name: 'Watchdog',
      severity: 'none',
    },
  ],
};

const mockOperators = {
  data: [
    {
      time: '2020-07-20T08:59:35Z',
      name: 'storage',
      condition: 'available',
      reason: 'AsExpected',
      version: '4.3.18',
    },
    {
      time: '2020-07-20T08:59:35Z',
      name: 'version',
      condition: 'failing',
      reason: 'ClusterOperatorDegraded',
      version: '',
    },
  ],
};

const mockWatchdog = [{ name: 'Watchdog', severity: 'none' }];

const resourceUsageWithIssues = {
  memory: {
    updated_timestamp: '2019-04-28T14:23:19Z',
    used: {
      value: 16546058240,
      unit: 'B',
    },
    total: {
      value: 16546058239,
      unit: 'B',
    },
  },
  cpu: {
    updated_timestamp: '2019-04-28T14:23:18Z',
    used: {
      value: 15.5,
      unit: '',
    },
    total: {
      value: 16,
      unit: '',
    },
  },
  sockets: {
    updated_timestamp: '0001-01-01T00:00:00Z',
    used: {
      value: 0,
      unit: '',
    },
    total: {
      value: 0,
      unit: '',
    },
  },
  storage: {
    updated_timestamp: '0001-01-01T00:00:00Z',
    used: {
      value: 0,
      unit: 'B',
    },
    total: {
      value: 0,
      unit: 'B',
    },
  },
  nodes: {
    total: 7,
    master: 3,
    compute: 4,
  },
};

const resourceUsageWithoutIssues: OneMetric = {
  ...defaultMetric,
  memory: {
    updated_timestamp: '2019-04-28T14:23:19Z',
    used: {
      value: 16546058240,
      unit: 'B',
    },
    total: {
      value: 82293346304,
      unit: 'B',
    },
  },
  cpu: {
    updated_timestamp: '2019-04-28T14:23:18Z',
    used: {
      value: 3.995410922987096,
      unit: '',
    },
    total: {
      value: 16,
      unit: '',
    },
  },
  sockets: {
    updated_timestamp: '0001-01-01T00:00:00Z',
    used: {
      value: 0,
      unit: '',
    },
    total: {
      value: 0,
      unit: '',
    },
  },
  storage: {
    updated_timestamp: '0001-01-01T00:00:00Z',
    used: {
      value: 0,
      unit: 'B',
    },
    total: {
      value: 0,
      unit: 'B',
    },
  },
  nodes: {
    total: 7,
    master: 3,
    compute: 4,
  },
};

const mockOCPDisconnectedClusterDetails: ClusterFromSubscription = {
  ...defaultClusterFromSubscription,
  id: '19bap5d1h6q3p9qsdjsgjrpv1esfhfnb',
  name: '1a7744e6-cd0f-4284-918d-357c1f615a4d',
  external_id: '1a7744e6-cd0f-4284-918d-357c1f615a4d',
  creation_timestamp: '2019-11-11T06:07:17.284553Z',
  activity_timestamp: '2019-11-11T06:07:17.284553Z',
  subscription: {
    id: '1TSTL53YWg1quyM9eVEEmyxIR4a',
    kind: 'Subscription',
    href: '/api/accounts_mgmt/v1/subscriptions/1TSTL53YWg1quyM9eVEEmyxIR4a',
    plan: {
      id: 'OCP',
      kind: 'Plan',
      href: '/api/accounts_mgmt/v1/plans/OCP',
    },
    cluster_id: '19bap5d1h6q3p9qsdjsgjrpv1esfhfnb',
    external_cluster_id: '1a7744e6-cd0f-4284-918d-357c1f615a4d',
    organization_id: '1H9rUtbuFqawEdQU5GPHD9W107I',
    last_telemetry_date: '0001-01-01T00:00:00Z',
    created_at: '2019-11-11T06:07:17.695469Z',
    updated_at: '2019-11-26T06:15:34.118717Z',
    display_name: 'sdqe-ui-ocp',
    creator: {
      id: '1DyducJhQOLfPochPyobQCfwJcW',
      kind: 'Account',
      href: '/api/accounts_mgmt/v1/accounts/1DyducJhQOLfPochPyobQCfwJcW',
      name: 'Xue Listg0001',
      username: 'xueli-stg0001',
    },
    managed: false,
    status: SubscriptionCommonFieldsStatus.Disconnected,
    last_reconcile_date: '0001-01-01T00:00:00Z',
  },
  state: 'ready',
  managed: false,
  metrics: {
    ...defaultMetric,
    memory: {
      updated_timestamp: '0001-01-01T00:00:00Z',
      used: {
        value: 0,
        unit: 'B',
      },
      total: {
        value: 0,
        unit: 'B',
      },
    },
    cpu: {
      updated_timestamp: '0001-01-01T00:00:00Z',
      used: {
        value: 0,
        unit: '',
      },
      total: {
        value: 0,
        unit: '',
      },
    },
    sockets: {
      updated_timestamp: '2019-11-11T06:07:17.284553Z',
      used: {
        value: 0,
        unit: '',
      },
      total: {
        value: 1,
        unit: '',
      },
    },
    compute_nodes_memory: {
      updated_timestamp: '0001-01-01T00:00:00Z',
      total: {
        value: 0,
        unit: 'B',
      },
      used: {
        unit: 'B',
        value: 0,
      },
    },
    compute_nodes_cpu: {
      updated_timestamp: '0001-01-01T00:00:00Z',
      total: {
        value: 0,
        unit: '',
      },
      used: {
        unit: 'B',
        value: 0,
      },
    },
    storage: {
      updated_timestamp: '0001-01-01T00:00:00Z',
      used: {
        value: 0,
        unit: 'B',
      },
      total: {
        value: 0,
        unit: 'B',
      },
    },
    nodes: {},
    operating_system: 'Red Hat Enterprise Linux CoreOS',
    upgrade: {
      available: false,
    },
  },
};

const mockOCPActiveClusterDetails = produce(
  mockOCPDisconnectedClusterDetails,
  (draft: ClusterFromSubscription) => {
    if (draft.subscription) {
      draft.subscription.status = SubscriptionCommonFieldsStatus.Active;
    }
  },
);

const archivedCluster: ClusterFromSubscription = {
  ...defaultClusterFromSubscription,
  subscription: {
    ...defaultSubscription,
    status: SubscriptionCommonFieldsStatus.Archived,
  },
};

const disconnectedCluster: ClusterFromSubscription = {
  ...defaultClusterFromSubscription,
  subscription: {
    ...defaultSubscription,
    status: SubscriptionCommonFieldsStatus.Disconnected,
  },
};

const cpuCluster: ClusterFromSubscription = {
  metrics: {
    ...defaultMetric,
    cpu: {
      updated_timestamp: '2021-04-29T10:20:24.14Z',
      total: {
        unit: 'B',
        value: 843893919744,
      },
      used: {
        unit: 'B',
        value: 0,
      },
    },
  },
};

const memoryCluster: ClusterFromSubscription = {
  metrics: {
    ...defaultMetric,
    memory: {
      updated_timestamp: '2021-04-29T10:20:24.14Z',
      total: {
        unit: 'B',
        value: 843893919744,
      },
      used: {
        unit: 'B',
        value: 0,
      },
    },
  },
};

const cpuAndMemoryCluster: ClusterFromSubscription = {
  metrics: {
    ...defaultMetric,
    cpu: {
      updated_timestamp: '2021-04-29T10:20:24.14Z',
      total: {
        unit: 'B',
        value: 843893919744,
      },
      used: {
        unit: 'B',
        value: 0,
      },
    },
    memory: {
      updated_timestamp: '2021-04-29T10:20:24.14Z',
      total: {
        unit: 'B',
        value: 843893919744,
      },
      used: {
        unit: 'B',
        value: 0,
      },
    },
  },
};

const cpuAndMemoryClusterThreshold: ClusterFromSubscription = {
  metrics: {
    ...defaultMetric,
    cpu: {
      updated_timestamp: '2021-04-29T10:20:24.14Z',
      total: {
        unit: 'B',
        value: 1,
      },
      used: {
        unit: 'B',
        value: 3,
      },
    },
    memory: {
      updated_timestamp: '2021-04-29T10:20:24.14Z',
      total: {
        unit: 'B',
        value: 1,
      },
      used: {
        unit: 'B',
        value: 3,
      },
    },
  },
};

const cpuAndMemoryClusterRecentlyUpdated: ClusterFromSubscription = {
  metrics: {
    ...defaultMetric,
    cpu: {
      updated_timestamp: dayjs.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
      total: {
        unit: 'B',
        value: 843893919744,
      },
      used: {
        unit: 'B',
        value: 0,
      },
    },
    memory: {
      updated_timestamp: '2021-04-29T10:20:24.14Z',
      total: {
        unit: 'B',
        value: 843893919744,
      },
      used: {
        unit: 'B',
        value: 0,
      },
    },
  },
};

const expectedMonitoringItemLinkPropsAlert = {
  href: 'http://www.example.com/monitoring/alerts?orderBy=asc&sortBy=Severity&alert-name=alertName',
  rel: 'noopener noreferrer',
  target: '_blank',
};
const expectedMonitoringItemLinkPropsNode = {
  href: 'http://www.example.com/k8s/cluster/nodes/nodeName',
  rel: 'noopener noreferrer',
  target: '_blank',
};
const expectedMonitoringItemLinkPropsOperator = {
  href: 'http://www.example.com/k8s/cluster/config.openshift.io~v1~ClusterOperator/operatorName',
  rel: 'noopener noreferrer',
  target: '_blank',
};

const minute = 60 * 1000;
const hour = 60 * minute;
const makeFutureDate = () => new Date(Date.now() + 2 * minute);
const makeFreshCheckIn = () => new Date(Date.now() - (2 * hour + 20 * minute));
const makeStaleCheckIn = () => new Date(Date.now() - (3 * hour + 20 * minute));

export {
  archivedCluster,
  cpuAndMemoryCluster,
  cpuAndMemoryClusterRecentlyUpdated,
  cpuAndMemoryClusterThreshold,
  cpuCluster,
  disconnectedCluster,
  expectedMonitoringItemLinkPropsAlert,
  expectedMonitoringItemLinkPropsNode,
  expectedMonitoringItemLinkPropsOperator,
  makeFreshCheckIn,
  makeFutureDate,
  makeStaleCheckIn,
  memoryCluster,
  mockAlerts,
  mockNodes,
  mockOCPActiveClusterDetails,
  mockOCPDisconnectedClusterDetails,
  mockOperators,
  mockWatchdog,
  resourceUsageWithIssues,
  resourceUsageWithoutIssues,
};
