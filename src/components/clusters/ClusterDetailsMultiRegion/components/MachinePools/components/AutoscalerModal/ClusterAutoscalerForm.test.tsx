import React from 'react';

import { checkAccessibility, render } from '~/testUtils';

import { clusterAutoscalerData } from './ClusterAutoscaler.fixtures';
import { ClusterAutoscalerForm } from './ClusterAutoscalerForm';

const initialProps = {
  hasClusterAutoscaler: true,
  clusterId: 'CLUSTERID123',
  isWizard: false,
  hasAutoscalingMachinePools: true,
  clusterAutoscalerData: {
    ...clusterAutoscalerData,
  },
  isClusterAutoscalerRefetching: false,
  maxNodesTotalDefault: 180,
};

describe('Cluster autoscaler form', () => {
  it('is accessible', async () => {
    const { container } = render(<ClusterAutoscalerForm {...initialProps} />);
    await checkAccessibility(container);
  });
});
