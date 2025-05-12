import { MachinePool, NodePool } from '~/types/clusters_mgmt.v1';
import { ClusterFromSubscription } from '~/types/types';

import { defaultMetric } from '../../ClusterDetailsMultiRegion/__tests__/clusterDetailsDefaultMetric.fixtures';

export type TotalNodesDataSelectorExpected = {
  hasMachinePoolWithAutoscaling: boolean;
  totalMinNodesCount: number;
  totalMaxNodesCount: number;
  totalDesiredComputeNodes: number;
  totalActualNodes: number | boolean;
};

export const clusterEmptyMachinePoolsUndefinedExpected: TotalNodesDataSelectorExpected = {
  hasMachinePoolWithAutoscaling: false,
  totalMinNodesCount: 0,
  totalMaxNodesCount: 0,
  totalDesiredComputeNodes: 0,
  totalActualNodes: false,
};

export const clusterEmptyMachinePoolsEmptyExpected: TotalNodesDataSelectorExpected = {
  hasMachinePoolWithAutoscaling: false,
  totalMinNodesCount: 0,
  totalMaxNodesCount: 0,
  totalDesiredComputeNodes: 0,
  totalActualNodes: false,
};

export const clusterEmptyMachinePoolsAutoscalingEnabledExpected: TotalNodesDataSelectorExpected = {
  hasMachinePoolWithAutoscaling: true,
  totalMinNodesCount: 8,
  totalMaxNodesCount: 10,
  totalDesiredComputeNodes: 4,
  totalActualNodes: false,
};

export const clusterEmptyMachinePoolsAdditionalAutoscalingEnabledExpected: TotalNodesDataSelectorExpected =
  {
    hasMachinePoolWithAutoscaling: true,
    totalMinNodesCount: 9,
    totalMaxNodesCount: 12,
    totalDesiredComputeNodes: 2,
    totalActualNodes: 2,
  };

export const clusterAndMachinePoolsDefaultExpected: TotalNodesDataSelectorExpected = {
  hasMachinePoolWithAutoscaling: true,
  totalMinNodesCount: 9,
  totalMaxNodesCount: 12,
  totalDesiredComputeNodes: 2,
  totalActualNodes: 2,
};

export const clusterEmptyMachinePoolsAdditionalAutoscalingEnabledHypershiftExpected: TotalNodesDataSelectorExpected =
  {
    hasMachinePoolWithAutoscaling: true,
    totalMinNodesCount: 6,
    totalMaxNodesCount: 8,
    totalDesiredComputeNodes: 0,
    totalActualNodes: 0,
  };

export const shouldCountTotalDesiredComputeNodesExpected: TotalNodesDataSelectorExpected = {
  hasMachinePoolWithAutoscaling: true,
  totalMinNodesCount: 9,
  totalMaxNodesCount: 10,
  totalDesiredComputeNodes: 6,
  totalActualNodes: false,
};

export const reportsTotalActualComputeNodesExpected: TotalNodesDataSelectorExpected = {
  hasMachinePoolWithAutoscaling: false,
  totalMinNodesCount: NaN,
  totalMaxNodesCount: NaN,
  totalDesiredComputeNodes: NaN,
  totalActualNodes: 2,
};

export const reportsTotalActualComputeNodesHypershiftExpected: TotalNodesDataSelectorExpected = {
  hasMachinePoolWithAutoscaling: false,
  totalMinNodesCount: NaN,
  totalMaxNodesCount: NaN,
  totalDesiredComputeNodes: NaN,
  totalActualNodes: 11,
};

export const defaultClusterMachinePoolNotAutoscaling: ClusterFromSubscription = {
  metrics: { ...defaultMetric, nodes: { compute: 2 } },
};

export const defaultClusterMachinePoolNotAutoscalingHypershift: ClusterFromSubscription = {
  ...defaultClusterMachinePoolNotAutoscaling,
  hypershift: { enabled: true },
};

export const workerMachinePool: MachinePool = {
  availability_zones: ['us-east-1a'],
  href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake2',
  id: 'worker',
  instance_type: 'm5.xlarge',
  kind: 'MachinePool',
  replicas: 4,
};

export const workerAutoscaleMachinePool: MachinePool = {
  availability_zones: ['us-east-1a'],
  href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake2',
  id: 'worker',
  instance_type: 'm5.xlarge',
  kind: 'MachinePool',
  autoscaling: {
    min_replicas: 4,
    max_replicas: 6,
  },
};
export const autoScalingAdditionalMachinePool: MachinePool = {
  availability_zones: ['us-east-1a'],
  href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake2',
  id: 'mp-with-label',
  instance_type: 'm5.xlarge',
  kind: 'MachinePool',
  autoscaling: {
    min_replicas: 3,
    max_replicas: 4,
  },
};
export const autoScalingAdditionalMachinePoolHypershift: NodePool = {
  href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake2',
  id: 'mp-with-label',
  kind: 'MachinePool',
  autoscaling: {
    min_replica: 3,
    max_replica: 4,
  },
};

export const notAutoScalingAdditionalMachinePool: MachinePool = {
  availability_zones: ['us-east-1a'],
  href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake1',
  id: 'mp-with-labels-and-taints',
  instance_type: 'm5.xlarge',
  kind: 'MachinePool',
  replicas: 2,
};

export const nonAutoScalingNodePool: NodePool = {
  status: { current_replicas: 5 },
};
export const additionalNonAutoScalingNodePool: NodePool = {
  status: { current_replicas: 6 },
};

export const defaultMachinePoolList: MachinePool[] = [
  workerAutoscaleMachinePool,
  notAutoScalingAdditionalMachinePool,
  autoScalingAdditionalMachinePool,
];

export const workerAndRepeatedNotAutoscalingList: MachinePool[] = [
  workerAutoscaleMachinePool,
  notAutoScalingAdditionalMachinePool,
  notAutoScalingAdditionalMachinePool,
];

export const computeNodesList: NodePool[] = [
  workerMachinePool,
  nonAutoScalingNodePool,
  additionalNonAutoScalingNodePool,
];
