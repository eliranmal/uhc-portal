import React from 'react';
import * as reactRedux from 'react-redux';

import getClusterName from '~/common/getClusterName';
import * as useToggleSubscriptionReleased from '~/queries/ClusterActionsQueries/useToggleSubscriptionReleased';
import { useGlobalState } from '~/redux/hooks';
import { checkAccessibility, render, screen, withState } from '~/testUtils';
import { SubscriptionCommonFieldsStatus } from '~/types/accounts_mgmt.v1';

import TransferClusterOwnershipDialog from '../TransferClusterOwnershipDialog';

import { subscription } from './TransferClusterOwnershipDialog.fixtures';

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

jest.mock('react-redux', () => {
  const config = {
    __esModule: true,
    ...jest.requireActual('react-redux'),
  };
  return config;
});

jest.mock('~/common/getClusterName', () => jest.fn());

const mockedUseToggleSubscriptionReleased = jest.spyOn(
  useToggleSubscriptionReleased,
  'useToggleSubscriptionReleased',
);

const useGlobalStateMock = useGlobalState as jest.Mock;
const getClusterNameMock = getClusterName as jest.Mock;

describe('<TransferClusterOwnershipDialog />', () => {
  const onClose = jest.fn();
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  const mutate = jest.fn();

  const defaultProps = {
    onClose,
  };

  const defaultState = {
    modal: {
      data: {
        id: 'my-cluster-id',
        subscription: {
          ...subscription,
        },
        shouldDisplayClusterName: false,
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatchMock.mockReturnValue(mockedDispatch);
  });

  it('is accessible', async () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({ subscription });
    const { container } = render(<TransferClusterOwnershipDialog onClose={onClose} />);

    // Act
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Assert
    await checkAccessibility(container);
  });

  it('should release clusters', async () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({ subscription: { ...subscription, released: false } });
    mockedUseToggleSubscriptionReleased.mockReturnValue({
      mutate,
      isPending: false,
      isError: false,
      error: null,
      isSuccess: true,
      data: undefined,
    });
    const { user } = withState(defaultState, true).render(
      <TransferClusterOwnershipDialog {...defaultProps} />,
    );
    expect(mutate).toHaveBeenCalledTimes(0);

    // Act
    await user.click(screen.getByRole('button', { name: 'Initiate transfer' }));

    // Assert
    expect(mockedDispatch).toHaveBeenCalled();
    expect(mockedDispatch.mock.calls[0][0].type).toEqual('CLOSE_MODAL');
    expect(mutate).toHaveBeenCalledWith(
      {
        released: true,
        subscriptionID: '0',
      },
      { onSuccess: expect.any(Function) },
    );
  });

  it('should not show dialog for canceling transfer', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({ subscription: { ...subscription, released: true } });

    // Act
    const { container } = render(<TransferClusterOwnershipDialog onClose={onClose} />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it('should show dialog for transferring disconnected clusters', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({
      subscription: {
        ...subscription,
        released: false,
        status: SubscriptionCommonFieldsStatus.Disconnected,
      },
    });

    // Act
    render(<TransferClusterOwnershipDialog onClose={onClose} />);

    // Assert
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should show error', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({
      subscription: {
        ...subscription,
        released: false,
        status: SubscriptionCommonFieldsStatus.Disconnected,
      },
    });

    mockedUseToggleSubscriptionReleased.mockReturnValue({
      mutate,
      isPending: false,
      isError: true,
      error: {
        isLoading: false,
        isError: true,
        error: {
          errorMessage: 'this is an error',
        },
      },
      isSuccess: false,
      data: undefined,
    });

    // Act
    render(<TransferClusterOwnershipDialog onClose={onClose} />);

    // Assert
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('alert-error')).toBeInTheDocument();
  });

  it('should display modal when subscription is undefined', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({
      subscription: undefined,
    });

    // Act
    render(<TransferClusterOwnershipDialog onClose={onClose} />);

    // Assert
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('is onClose called', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({
      subscription: undefined,
    });
    mockedUseToggleSubscriptionReleased.mockReturnValue({
      mutate,
      isPending: false,
      isError: false,
      error: null,
      isSuccess: true,
      data: undefined,
    });

    // Act
    render(<TransferClusterOwnershipDialog onClose={onClose} />);

    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockedDispatch.mock.calls[0][0].type).toEqual('CLOSE_MODAL');
  });

  it('shouldDisplayClusterName false', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({
      subscription: undefined,
      shouldDisplayClusterName: false,
    });
    getClusterNameMock.mockReturnValue('whatever the name');

    // Act
    render(<TransferClusterOwnershipDialog onClose={onClose} />);

    // Assert
    expect(screen.queryByText(/whatever the name/i)).not.toBeInTheDocument();
  });

  it('shouldDisplayClusterName true', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({
      subscription: { ...subscription },
      shouldDisplayClusterName: true,
    });
    getClusterNameMock.mockReturnValue('whatever the name');
    const updatedState = {
      modal: {
        data: {
          subscription: { ...subscription },
          shouldDisplayClusterName: true,
        },
      },
    };
    // Act
    withState(updatedState, true).render(<TransferClusterOwnershipDialog {...defaultProps} />);

    // Assert
    expect(screen.getByText(/whatever the name/i)).toBeInTheDocument();
  });
});
