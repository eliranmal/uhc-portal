import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import ClusterNonEditableAlert from '../ClusterDetailsTop/components/ClusterNonEditableAlert';

describe('<ClusterNonEditableAlert />', () => {
  it('properly renders', async () => {
    // Act
    const { container } = render(<ClusterNonEditableAlert />);

    // Assert
    expect(
      await screen.findByText(
        'To get permission to edit, contact the Cluster Owner or Organization Admin.',
      ),
    ).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
