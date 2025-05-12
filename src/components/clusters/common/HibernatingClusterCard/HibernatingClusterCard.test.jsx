import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import clusterStates from '../clusterStates';

import HibernatingClusterCard from './HibernatingClusterCard';

describe('<HibernateClusterModal />', () => {
  const openModal = jest.fn();
  const cluster = {
    id: 'test-id',
    name: 'test-cluster',
    subscription: {
      id: 'subscription-id',
    },
    state: clusterStates.hibernating,
  };
  const defaultProps = {
    cluster,
    openModal,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = render(<HibernatingClusterCard {...defaultProps} />);

    expect(screen.getByText('Cluster is currently hibernating')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
