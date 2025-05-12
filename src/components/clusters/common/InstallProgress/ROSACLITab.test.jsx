import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import fixtures from '../../ClusterDetailsMultiRegion/__tests__/ClusterDetails.fixtures';

import ROSACLITab from './ROSACLITab';

describe('<ROSACLITab />', () => {
  it('is accessible', async () => {
    // Note this test throws warnings into the console because
    // a div is inside a paragraph
    // this appears to be a problem in  PF ClipboardCopy
    const { container } = render(
      <ROSACLITab cluster={fixtures.ROSAManualClusterDetails.cluster} />,
    );

    expect(
      screen.getByDisplayValue('rosa create operator-roles --interactive -c test-liza'),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
