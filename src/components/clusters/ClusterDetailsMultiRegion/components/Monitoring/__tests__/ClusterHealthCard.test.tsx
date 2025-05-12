import React from 'react';

import { checkAccessibility, render } from '~/testUtils';

import { ClusterHealthCard } from '../components/ClusterHealthCard';
import { monitoringStatuses } from '../monitoringHelper';

describe('<ClusterHealthCard />', () => {
  it.each(Object.entries(monitoringStatuses))(
    'is accessible with health status %s',
    async ([_statusKey, statusValue]) => {
      const { container } = render(<ClusterHealthCard status={statusValue} />);
      await checkAccessibility(container);
    },
  );
});
