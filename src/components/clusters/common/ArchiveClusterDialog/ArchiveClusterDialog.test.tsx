import React from 'react';
import * as reactRedux from 'react-redux';

import * as useArchiveCluster from '~/queries/ClusterActionsQueries/useArchiveCluster';
import { checkAccessibility, screen, withState } from '~/testUtils';

import ArchiveClusterDialog from './ArchiveClusterDialog';

jest.mock('react-redux', () => {
  const config = {
    __esModule: true,
    ...jest.requireActual('react-redux'),
  };
  return config;
});

const mockedUseArchiveCluster = jest.spyOn(useArchiveCluster, 'useArchiveCluster');

describe('<ArchiveClusterDialog />', () => {
  const onClose = jest.fn();
  const reset = jest.fn();
  const mutate = jest.fn();

  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  useDispatchMock.mockReturnValue(mockedDispatch);

  const defaultProps = {
    onClose,
  };

  const defaultUseArchiveClusterResponse = {
    isSuccess: false,
    error: null,
    isError: false,
    isPending: false,
    mutate,
    reset,
  };

  const defaultReduxState = {
    modal: {
      data: {
        name: 'myClusterName',
        subscriptionID: 'mySubscriptionId',
        shouldDisplayClusterName: true,
      },
    },
  };

  // Used at start of tests to ensure no calls are registered
  const checkForNoCalls = () => {
    expect(onClose).not.toHaveBeenCalled();
    expect(mockedDispatch).not.toHaveBeenCalled();
    expect(reset).not.toHaveBeenCalled();
    expect(mutate).not.toHaveBeenCalled();
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    mockedUseArchiveCluster.mockReturnValue(defaultUseArchiveClusterResponse);

    const { container } = withState(defaultReduxState).render(
      <ArchiveClusterDialog {...defaultProps} />,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('Does not call onClose prop when cancelled (using cancel button)', async () => {
    mockedUseArchiveCluster.mockReturnValue(defaultUseArchiveClusterResponse);

    const { user } = withState(defaultReduxState).render(
      <ArchiveClusterDialog {...defaultProps} />,
    );

    checkForNoCalls();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).not.toHaveBeenCalled();
    expect(mockedDispatch).toHaveBeenCalled();
    expect(mockedDispatch.mock.calls[0][0].type).toEqual('CLOSE_MODAL');
    expect(reset).toHaveBeenCalled();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('Does not call onClose prop when cancelled (using X button)', async () => {
    mockedUseArchiveCluster.mockReturnValue(defaultUseArchiveClusterResponse);

    const { user } = withState(defaultReduxState).render(
      <ArchiveClusterDialog {...defaultProps} />,
    );

    checkForNoCalls();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).not.toHaveBeenCalled();
    expect(mockedDispatch).toHaveBeenCalled();
    expect(mockedDispatch.mock.calls[0][0].type).toEqual('CLOSE_MODAL');
    expect(reset).toHaveBeenCalled();
  });

  it('calls mutate (which would call the API) when user clicks on primary button', async () => {
    mockedUseArchiveCluster.mockReturnValue(defaultUseArchiveClusterResponse);

    const { user } = withState(defaultReduxState).render(
      <ArchiveClusterDialog {...defaultProps} />,
    );

    checkForNoCalls();

    await user.click(screen.getByRole('button', { name: 'Archive cluster' }));

    expect(mutate).toHaveBeenCalledWith({
      displayName: 'myClusterName',
      subscriptionID: 'mySubscriptionId',
    });
  });

  it('closes the modal on success', async () => {
    const newUseArchiveClusterResponse = { ...defaultUseArchiveClusterResponse, isSuccess: true };

    mockedUseArchiveCluster.mockReturnValue(newUseArchiveClusterResponse);

    checkForNoCalls();

    withState(defaultReduxState).render(<ArchiveClusterDialog {...defaultProps} />);

    expect(mockedDispatch).toHaveBeenCalled();
    expect(mockedDispatch.mock.calls[0][0].type).toEqual('CLOSE_MODAL');
    expect(reset).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('displays an error', async () => {
    const newUseArchiveClusterResponse = {
      ...defaultUseArchiveClusterResponse,
      isError: true,
      error: { errorMessage: 'I am an error', operationID: 'error_id' },
    };

    // @ts-ignore
    mockedUseArchiveCluster.mockReturnValue(newUseArchiveClusterResponse);

    checkForNoCalls();

    withState(defaultReduxState).render(<ArchiveClusterDialog {...defaultProps} />);

    expect(screen.getByTestId('alert-error')).toBeInTheDocument();
    expect(screen.getByText('I am an error')).toBeInTheDocument();
  });

  it('displays spinner when pending', async () => {
    const newUseArchiveClusterResponse = {
      ...defaultUseArchiveClusterResponse,
      isPending: true,
    };

    // @ts-ignore
    mockedUseArchiveCluster.mockReturnValue(newUseArchiveClusterResponse);

    withState(defaultReduxState).render(<ArchiveClusterDialog {...defaultProps} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });
});
