import React from 'react';

import { Table, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { OndemandMetricsClusterOperators } from '~/types/accounts_mgmt.v1';
import { ClusterConsole } from '~/types/clusters_mgmt.v1';

import { monitoringItemLinkProps, monitoringItemTypes } from '../monitoringHelper';

import { ClusterOperatorStatus } from './ClusterOperatorStatus';

type ClusterOperatorsProps = {
  operators?: Array<OndemandMetricsClusterOperators>;
  clusterConsole?: ClusterConsole;
};

const ClusterOperators = ({ operators = [], clusterConsole }: ClusterOperatorsProps) => {
  const rows = operators.map((operator) => {
    const operatorLinkProps = monitoringItemLinkProps(
      clusterConsole,
      monitoringItemTypes.OPERATOR,
      operator.name,
    );
    return {
      operatorName:
        operatorLinkProps !== null ? <a {...operatorLinkProps}>{operator.name}</a> : operator.name,
      operatorCondition: <ClusterOperatorStatus condition={operator.condition} />,
      operatorVersion: operator.version,
      operatorKey: operator.name,
    };
  });

  return (
    <Table variant={TableVariant.compact} borders={false} aria-label="operators">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Status</Th>
          <Th>Version</Th>
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((row) => (
          <Tr key={row.operatorKey}>
            <Td>{row.operatorName}</Td>
            <Td>{row.operatorCondition}</Td>
            <Td>{row.operatorVersion}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export { ClusterOperators };
