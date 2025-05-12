import totalNodesDataSelector from '~/components/clusters/common/totalNodesDataSelector';
import { MachinePool } from '~/types/clusters_mgmt.v1';
import { ClusterFromSubscription } from '~/types/types';

// Determine whether a master instance resize alert should be shown.
// Since the threshold is depenent on the current nodes, we return it
// for inclusion in the alert itself.
export const masterResizeThresholds = {
  medium: 25,
  large: 100,
};

// Determine the master machine type size according to the
// current nodes and the requested nodes.
export const masterResizeAlertThreshold = ({
  selectedMachinePoolID,
  requestedNodes,
  cluster,
  machinePools,
}: {
  selectedMachinePoolID: string;
  requestedNodes: number;
  cluster: ClusterFromSubscription;
  machinePools: MachinePool[];
}) => {
  const nodes = totalNodesDataSelector(cluster, machinePools);
  const currentNodes = nodes.totalMaxNodesCount;
  let totalRequestedNodes = 0;
  const selectedMachinePool = machinePools.find(
    (machinePool) => machinePool.id === selectedMachinePoolID,
  );
  if (selectedMachinePool) {
    if (selectedMachinePool.autoscaling) {
      totalRequestedNodes =
        nodes.totalMaxNodesCount +
        (requestedNodes - (selectedMachinePool.autoscaling.max_replicas || 0));
    } else {
      totalRequestedNodes =
        nodes.totalMaxNodesCount + (requestedNodes - (selectedMachinePool.replicas || 0));
    }
  }

  if (requestedNodes && currentNodes) {
    if (
      currentNodes <= masterResizeThresholds.large &&
      totalRequestedNodes > masterResizeThresholds.large
    ) {
      return masterResizeThresholds.large;
    }
    if (
      currentNodes <= masterResizeThresholds.medium &&
      totalRequestedNodes > masterResizeThresholds.medium
    ) {
      return masterResizeThresholds.medium;
    }
  }
  return 0;
};
