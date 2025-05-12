import * as React from 'react';

import { render, screen } from '~/testUtils';
import { ClusterFromSubscription } from '~/types/types';

import ResizingAlert from './ResizingAlert';
import { masterResizeThresholds } from './utils';

describe('<ResizingAlert />', () => {
  it('Does not show alert for no threshold', () => {
    const { container } = render(
      <ResizingAlert
        autoscalingEnabled={false}
        cluster={{} as ClusterFromSubscription}
        machinePools={[
          {
            id: 'foo',
            replicas: 1,
          },
        ]}
        replicasValue={2}
        autoScaleMaxNodesValue={0}
        selectedMachinePoolID="foo"
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
  it('Shows alert with medium threshold', () => {
    render(
      <ResizingAlert
        autoscalingEnabled={false}
        cluster={{} as ClusterFromSubscription}
        machinePools={[
          {
            id: 'foo',
            replicas: 1,
          },
        ]}
        replicasValue={30}
        autoScaleMaxNodesValue={0}
        selectedMachinePoolID="foo"
      />,
    );

    expect(
      screen.getByRole('heading', {
        name: new RegExp(`${masterResizeThresholds.medium} nodes`, 'i'),
      }),
    ).toBeInTheDocument();
  });

  it('Shows alert with high threshold', () => {
    render(
      <ResizingAlert
        autoscalingEnabled={false}
        cluster={{} as ClusterFromSubscription}
        machinePools={[
          {
            id: 'foo',
            replicas: 1,
          },
        ]}
        replicasValue={150}
        autoScaleMaxNodesValue={0}
        selectedMachinePoolID="foo"
      />,
    );

    expect(
      screen.getByRole('heading', {
        name: new RegExp(`${masterResizeThresholds.large} nodes`, 'i'),
      }),
    ).toBeInTheDocument();
  });
});
