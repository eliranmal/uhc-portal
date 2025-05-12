import React from 'react';

import { Link } from '~/common/routing';
import {
  MachinePoolItemList,
  securityGroupsRenderer,
} from '~/components/clusters/ClusterDetailsMultiRegion/components/MachinePools/components/MachinePoolExpandedRow';
import { MachinePool, NodePool, SecurityGroup } from '~/types/clusters_mgmt.v1';

const getCombinedMachinePoolSecurityGroupIds = (
  machinePoolData: MachinePool[] | NodePool[],
): string[] => {
  // Step through the machine pools and combine the security groups into single array
  const securityGroups: string[] = [];
  machinePoolData.forEach((pool) => {
    const additionalSecurityGroupIds =
      (pool as MachinePool)?.aws?.additional_security_group_ids ||
      (pool as NodePool)?.aws_node_pool?.additional_security_group_ids ||
      [];
    if (additionalSecurityGroupIds?.length ?? 0) {
      securityGroups.push(...(additionalSecurityGroupIds || []));
    }
  });
  // Remove duplicates
  return [...new Set(securityGroups)];
};
const SecurityGroupsDisplayByNode = ({
  securityGroups = [],
  securityGroupIdsForControl = [],
  securityGroupIdsForInfra = [],
  machinePoolData = [],
  showLinkToMachinePools = false,
  showWorkerNodesTogether = false,
}: {
  securityGroups?: SecurityGroup[] | undefined;
  securityGroupIdsForControl?: string[];
  securityGroupIdsForInfra?: string[];
  machinePoolData?: MachinePool[];
  showLinkToMachinePools?: boolean;
  showWorkerNodesTogether?: boolean;
}) => (
  <>
    {securityGroupIdsForControl.length > 0 && (
      <dd key="sg-detail-display-controlplane-nodes">
        <MachinePoolItemList
          title="Control plane nodes"
          items={securityGroupsRenderer(securityGroupIdsForControl, securityGroups || [])}
          showSmallTitle
        />
      </dd>
    )}
    {securityGroupIdsForInfra.length > 0 && (
      <dd key="sg-detail-display-infra-nodes">
        <MachinePoolItemList
          title="Infrastructure nodes"
          items={securityGroupsRenderer(securityGroupIdsForInfra, securityGroups || [])}
          showSmallTitle
        />
      </dd>
    )}

    {!showWorkerNodesTogether &&
      machinePoolData.map((pool) => {
        const additionalSecurityGroupIds =
          (pool as MachinePool)?.aws?.additional_security_group_ids ||
          (pool as NodePool)?.aws_node_pool?.additional_security_group_ids ||
          [];
        return (
          (additionalSecurityGroupIds?.length || 0) > 0 && (
            <dd key={`sg-detail-display-compute-nodes-${pool?.id}`}>
              <MachinePoolItemList
                title={`Compute (${pool?.id}) nodes `}
                items={securityGroupsRenderer(additionalSecurityGroupIds, securityGroups || [])}
                showSmallTitle
              />
            </dd>
          )
        );
      })}
    {showWorkerNodesTogether && (
      <dd key="sg-detail-display-all-compute-nodes">
        <MachinePoolItemList
          title={`Compute nodes `}
          items={securityGroupsRenderer(
            getCombinedMachinePoolSecurityGroupIds(machinePoolData) || [],
            securityGroups || [],
          )}
          showSmallTitle
        />
      </dd>
    )}

    {showLinkToMachinePools &&
      getCombinedMachinePoolSecurityGroupIds(machinePoolData).length > 0 && (
        <dt>
          See more information in the <Link to={{ hash: '#machinePools' }}>machine pools tab</Link>
        </dt>
      )}
  </>
);

export default SecurityGroupsDisplayByNode;
