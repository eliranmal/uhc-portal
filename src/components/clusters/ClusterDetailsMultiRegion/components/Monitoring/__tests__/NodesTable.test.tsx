import React from 'react';

import { checkAccessibility, render } from '~/testUtils';

import { NodesTable } from '../components/NodesTable';

describe('<NodesTable />', () => {
  it('is accessible', async () => {
    const { container } = render(<NodesTable />);
    await checkAccessibility(container);
  });
});
