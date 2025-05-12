import React from 'react';

import { Tooltip } from '@patternfly/react-core';

type CreateManagedClusterTooltipProps = {
  children: React.ReactElement;
  wrap?: boolean;
};

const CreateManagedClusterTooltip = ({
  children,
  wrap = false,
}: CreateManagedClusterTooltipProps) => (
  <Tooltip content="You do not have permission to create a managed cluster.">
    {wrap ? <div data-testid="create-cluster-tooltip-wrapper">{children}</div> : children}
  </Tooltip>
);

export default CreateManagedClusterTooltip;
