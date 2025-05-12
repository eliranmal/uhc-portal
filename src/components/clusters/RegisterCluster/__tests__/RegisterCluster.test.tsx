import React from 'react';
import * as reactRedux from 'react-redux';

import { useGlobalState } from '~/redux/hooks';
import { checkAccessibility, render, screen } from '~/testUtils';

import RegisterCluster from '../RegisterCluster';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports from react-router-dom
  Navigate: jest.fn(({ to }) => `Redirected to "${to}"`),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

jest.mock('../EditSubscriptionSettings');

describe('<RegisterCluster />', () => {
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  useDispatchMock.mockReturnValue(mockedDispatch);

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.unmock('react-router-dom');
  });

  it('is accessible', async () => {
    // Arrange
    (useGlobalState as jest.Mock).mockReturnValue({
      quotaResponse: {},
      registerClusterResponse: {},
      isOpen: false,
      canSubscribeOCP: false,
    });

    // Act
    // @ts-ignore
    const { container } = render(<RegisterCluster />);

    // Assert
    await checkAccessibility(container);
  });

  it('shows spinner when quota has not been fulfilled', () => {
    // Arrange
    (useGlobalState as jest.Mock).mockReturnValue({
      quotaResponse: { fulfilled: false },
      registerClusterResponse: {},
      isOpen: false,
      canSubscribeOCP: false,
    });

    // Act
    // @ts-ignore
    render(<RegisterCluster />);

    // Assert
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
    expect(screen.queryByLabelText('Cluster ID', { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByText('Redirected to ', { exact: false })).not.toBeInTheDocument();
  });

  it('shows form when quota has been fulfilled', () => {
    // Arrange

    (useGlobalState as jest.Mock).mockReturnValue({
      quotaResponse: { fulfilled: true },
      registerClusterResponse: {},
      isOpen: false,
      canSubscribeOCP: false,
    });

    // Act
    // @ts-ignore
    render(<RegisterCluster />);

    // Assert
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Cluster ID', { exact: false })).toBeInTheDocument();
    expect(screen.queryByText('Redirected to ', { exact: false })).not.toBeInTheDocument();
  });

  it('redirects to cluster details when the cluster data is fulfilled', () => {
    // Arrange
    (useGlobalState as jest.Mock).mockReturnValue({
      quotaResponse: { fulfilled: true },
      registerClusterResponse: {
        fulfilled: true,
        cluster: { id: 'myClusterId' },
      },
      isOpen: false,
      canSubscribeOCP: false,
    });

    // Act
    // @ts-ignore
    render(<RegisterCluster />);

    // Assert
    expect(
      screen.getByText('Redirected to "/openshift/details/s/myClusterId"'),
    ).toBeInTheDocument();
  });
});
