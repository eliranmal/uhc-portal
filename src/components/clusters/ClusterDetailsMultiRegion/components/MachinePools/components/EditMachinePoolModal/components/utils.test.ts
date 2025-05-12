import { MachinePool } from '~/types/clusters_mgmt.v1';
import { ClusterFromSubscription } from '~/types/types';

import fixtures from '../../../../../__tests__/ClusterDetails.fixtures';

import { masterResizeAlertThreshold, masterResizeThresholds } from './utils';

const cluster: ClusterFromSubscription = fixtures.clusterDetails.cluster as any;

describe('masterResizeAlertThreshold', () => {
  it('When scaling a cluster to more then 25 nodes with autoscaling disabled on default machinepool, return medium threshold ', () => {
    const machinePools: MachinePool[] = [
      {
        id: 'foo',
        replicas: 2,
        instance_type: 'm5.xlarge',
      },
    ];

    const result = masterResizeAlertThreshold({
      selectedMachinePoolID: 'foo',
      requestedNodes: 27,
      cluster,
      machinePools,
    });

    expect(result).toEqual(masterResizeThresholds.medium);
  });

  it('When scaling a cluster to more then 100 nodes with autoscaling enabled on default machinepool, return large threshold ', () => {
    const machinePools: MachinePool[] = [
      {
        id: 'foo',
        autoscaling: {
          min_replicas: 1,
          max_replicas: 2,
        },
        instance_type: 'm5.xlarge',
      },
    ];

    const result = masterResizeAlertThreshold({
      selectedMachinePoolID: 'foo',
      requestedNodes: 101,
      cluster,
      machinePools,
    });

    expect(result).toEqual(masterResizeThresholds.large);
  });

  it('When scaling a cluster with additional machinePools to more than 25 nodes, return medium threshold', () => {
    const machinePools: MachinePool[] = [
      {
        id: 'foo',
        replicas: 4,
        instance_type: 'm5.xlarge',
      },
      {
        availability_zones: ['us-east-1a'],
        href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake2',
        id: 'mp-with-label0',
        instance_type: 'm5.xlarge',
        kind: 'MachinePool',
        replicas: 7,
      },
      {
        availability_zones: ['us-east-1a'],
        href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake2',
        id: 'mp-with-label1',
        instance_type: 'm5.xlarge',
        kind: 'MachinePool',
        replicas: 10,
      },
    ];

    const result = masterResizeAlertThreshold({
      selectedMachinePoolID: 'mp-with-label0',
      requestedNodes: 12,
      cluster,
      machinePools,
    });

    expect(result).toEqual(masterResizeThresholds.medium);
  });

  it('When scaling a cluster with "autoscaled enabled" and additional machinePools to more than 25 nodes, return medium threshold', () => {
    const machinePools: MachinePool[] = [
      {
        id: 'foo',
        autoscaling: {
          min_replicas: 7,
          max_replicas: 10,
        },
      },
      {
        availability_zones: ['us-east-1a'],
        href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake2',
        id: 'mp-with-label',
        instance_type: 'm5.xlarge',
        kind: 'MachinePool',
        autoscaling: {
          min_replicas: 10,
          max_replicas: 14,
        },
      },
    ];

    const result = masterResizeAlertThreshold({
      selectedMachinePoolID: 'mp-with-label',
      requestedNodes: 16,
      cluster,
      machinePools,
    });

    expect(result).toEqual(masterResizeThresholds.medium);
  });

  it('When scaling a cluster with additional "autoscaled enabled" machinePools to more than 25 nodes, return medium threshold', () => {
    const machinePools: MachinePool[] = [
      {
        id: 'foo',
        replicas: 4,
      },
      {
        availability_zones: ['us-east-1a'],
        href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake2',
        id: 'mp-with-label0',
        instance_type: 'm5.xlarge',
        kind: 'MachinePool',
        autoscaling: {
          min_replicas: 3,
          max_replicas: 4,
        },
      },
      {
        availability_zones: ['us-east-1a'],
        href: '/api/clusters_mgmt/v1/clusters/cluster-id/machine_pools/fake2',
        id: 'mp-with-label1',
        instance_type: 'm5.xlarge',
        kind: 'MachinePool',
        autoscaling: {
          min_replicas: 10,
          max_replicas: 15,
        },
      },
    ];

    const result = masterResizeAlertThreshold({
      selectedMachinePoolID: 'mp-with-label0',
      requestedNodes: 9,
      cluster,
      machinePools,
    });

    expect(result).toEqual(masterResizeThresholds.medium);
  });

  it('When scaling a cluster to less then 25 nodes, return 0', () => {
    const machinePools: MachinePool[] = [
      {
        id: 'foo',
        replicas: 2,
        instance_type: 'm5.xlarge',
      },
    ];

    const result = masterResizeAlertThreshold({
      selectedMachinePoolID: 'foo',
      requestedNodes: 6,
      cluster,
      machinePools,
    });

    expect(result).toEqual(0);
  });
});
