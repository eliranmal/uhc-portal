import React from 'react';
import orderBy from 'lodash/orderBy';

import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import PopoverHint from '../../common/PopoverHint';

type Props = {
  rows: React.ReactNode[][];
  children?: React.ReactNode;
};

const OSDSubscriptionTable = ({ rows, children }: Props) => {
  const tipText = (
    <>
      <p>Standard: Cluster infrastructure costs paid by Red Hat</p>
      <p>CCS: Cluster infrastructure costs paid by the customer</p>
    </>
  );
  const sortedRows = orderBy(rows, [0, 1]).map((cells) => ({ cells }));

  return (
    <>
      <Table aria-label="Quota Table">
        <Thead>
          <Tr>
            <Th>Resource type</Th>
            <Th>Resource name</Th>
            <Th>Availability</Th>
            <Th>
              Plan type <PopoverHint hint={tipText} />
            </Th>
            <Th>Cluster type</Th>
            <Th>Used</Th>
            <Th>Capacity</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedRows.map((sortedRow, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Tr key={index}>
              {sortedRow.cells.map((cell) => (
                <Td>{cell}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      {children}
    </>
  );
};

export default OSDSubscriptionTable;
