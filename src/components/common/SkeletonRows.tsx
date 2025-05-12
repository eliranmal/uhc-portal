/*
SkeletonRows creates a list of rows object for PatternFly <Table>
containing the Insights Platform <Sekelton> animation, for table loading states.

This is NOT a React component, because it returns an array of rows, so it's not directly renderable.
*/

import React from 'react';

import { Skeleton } from '@patternfly/react-core';

const skeletonRows = (
  count = 10,
  colSpan = 6,
  size: React.ComponentProps<typeof Skeleton>['fontSize'] = 'lg',
) => {
  const row = {
    cells: [
      {
        props: { colSpan },
        title: <Skeleton fontSize={size} screenreaderText="Loading..." />,
      },
    ],
  };
  const ret = [];
  for (let i = 0; i < count; i += 1) {
    ret.push(row);
  }
  return ret;
};

export default skeletonRows;
